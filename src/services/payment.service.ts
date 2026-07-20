import crypto from 'crypto';
import { razorpay } from '../config/razorpay';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class PaymentService {
  public static async createOrder(data: {
    amount: number;
    currency: string;
    method: PaymentMethod;
    customerEmail: string;
    customerPhone?: string | null;
  }) {
    const { amount, currency, method, customerEmail, customerPhone } = data;

    if (method === PaymentMethod.COD) {
      const orderId = `COD-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
      
      const payment = await prisma.payment.create({
        data: {
          orderId,
          amount,
          currency,
          method,
          status: PaymentStatus.PENDING,
          customerEmail,
          customerPhone,
        },
      });

      return {
        orderId: payment.orderId,
        amount: Number(payment.amount),
        currency: payment.currency,
        method: payment.method,
        status: payment.status,
      };
    } else {
      // Create Razorpay Order
      try {
        const amountInPaise = Math.round(amount * 100);
        const razorpayOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: currency,
          receipt: `rcpt_${crypto.randomBytes(4).toString('hex')}`,
        });

        const payment = await prisma.payment.create({
          data: {
            orderId: razorpayOrder.id,
            amount: amount,
            currency: currency,
            method,
            status: PaymentStatus.PENDING,
            customerEmail,
            customerPhone,
          },
        });

        return {
          orderId: payment.orderId,
          amount: amountInPaise, // Returned in paise for Checkout SDK frontend use
          currency: payment.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
          method: payment.method,
          status: payment.status,
        };
      } catch (error: any) {
        const errorMsg = error.error?.description || error.message || JSON.stringify(error);
        throw new AppError(`Razorpay Order Creation Failed: ${errorMsg}`, 500);
      }
    }
  }

  public static async verifySignature(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    // Verify signature logic: HMAC-SHA256(order_id + "|" + payment_id, secret)
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      try {
        await prisma.payment.update({
          where: { orderId: razorpay_order_id },
          data: { status: PaymentStatus.FAILED },
        });
      } catch (e) {
        // Payment entry might not exist
      }
      throw new AppError('Payment verification failed: Signature mismatch', 400);
    }

    try {
      const updatedPayment = await prisma.payment.update({
        where: { orderId: razorpay_order_id },
        data: {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: PaymentStatus.CAPTURED,
        },
      });

      // Sync Order status to PAID if linked
      if (updatedPayment.orderRefId) {
        await prisma.order.update({
          where: { id: updatedPayment.orderRefId },
          data: { status: 'PAID' },
        });
      }

      return updatedPayment;
    } catch (error: any) {
      throw new AppError('Payment not found or database update failed', 404);
    }
  }

  public static async handleWebhook(rawBody: string, signature: string) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new AppError('Webhook secret not configured', 500);
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new AppError('Invalid webhook signature', 400);
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (error) {
      throw new AppError('Invalid Webhook JSON payload', 400);
    }

    if (event.event === 'payment.captured') {
      const paymentPayload = event.payload.payment.entity;
      const orderId = paymentPayload.order_id;
      const paymentId = paymentPayload.id;

      if (orderId) {
        try {
          const payment = await prisma.payment.findUnique({
            where: { orderId },
          });

          if (payment) {
            await prisma.payment.update({
              where: { orderId },
              data: {
                status: PaymentStatus.CAPTURED,
                paymentId: paymentId,
              },
            });

            if (payment.orderRefId) {
              await prisma.order.update({
                where: { id: payment.orderRefId },
                data: { status: 'PAID' },
              });
            }
          }
        } catch (error) {
          console.error('[Webhook Error] Failed to update payment/order status:', error);
        }
      }
    }

    return { received: true };
  }
}
