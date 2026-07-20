import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error';
import { PaymentService } from './payment.service';
import { PaymentMethod, OrderStatus } from '@prisma/client';

export class OrderService {
  public static async checkout(data: {
    cartId: string;
    customerEmail: string;
    customerPhone?: string | null;
    shippingAddress?: string | null;
    paymentMethod: PaymentMethod;
  }) {
    const { cartId, customerEmail, customerPhone, shippingAddress, paymentMethod } = data;

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Your cart is empty', 400);
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new AppError(
          `Insufficient stock for ${item.product.name}. Requested: ${item.quantity}, Available: ${item.product.stock}`,
          400
        );
      }
    }

    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += Number(item.product.price) * item.quantity;
    }

    const orderNumber = `ORD-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Execute atomic transaction for checkout
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          cartId,
          customerEmail,
          customerPhone,
          shippingAddress,
          totalAmount,
          status: OrderStatus.PENDING,
          paymentMethod,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price, // Price snapshot
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Decrement product inventory
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear Cart items
      await tx.cartItem.deleteMany({
        where: { cartId },
      });

      return newOrder;
    });

    // Create Payment (COD or Razorpay order)
    const paymentResult = await PaymentService.createOrder({
      amount: Number(order.totalAmount),
      currency: 'INR',
      method: paymentMethod,
      customerEmail,
      customerPhone,
    });

    // Link Payment record to Order
    await prisma.payment.update({
      where: { orderId: paymentResult.orderId },
      data: {
        orderRefId: order.id,
      },
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      paymentMethod: order.paymentMethod,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: Number(item.price),
        quantity: item.quantity,
        itemTotal: Number(item.price) * item.quantity,
      })),
      payment: paymentResult,
    };
  }

  public static async getOrderById(id: number) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new AppError(`Order with ID ${id} not found`, 404);
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: Number(item.price),
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
        itemTotal: Number(item.price) * item.quantity,
      })),
      payment: order.payment
        ? {
            orderId: order.payment.orderId,
            paymentId: order.payment.paymentId,
            status: order.payment.status,
            method: order.payment.method,
          }
        : null,
    };
  }
}
