import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

export const createOrderSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be a positive number'),
    currency: z.string().default('INR'),
    method: z.nativeEnum(PaymentMethod, {
      errorMap: () => ({
        message: 'Invalid payment method. Must be one of: UPI, CARD, NETBANKING, WALLET, COD',
      }),
    }),
    customerEmail: z.string().email('Invalid customer email address'),
    customerPhone: z.string().optional().nullable(),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1, 'razorpay_order_id is required'),
    razorpay_payment_id: z.string().min(1, 'razorpay_payment_id is required'),
    razorpay_signature: z.string().min(1, 'razorpay_signature is required'),
  }),
});
