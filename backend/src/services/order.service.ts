import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error';
import { PaymentService } from './payment.service';
import { PaymentMethod, OrderStatus } from '@prisma/client';

export class OrderService {
  public static async checkout(data: {
    cartId: string;
    customerEmail: string;
    customerCountryCode?: string | null;
    customerPhone?: string | null;
    shippingAddress?: string | null;
    paymentMethod: PaymentMethod;
    userId?: number;
  }) {
    const { cartId, customerEmail, customerCountryCode, customerPhone, shippingAddress, paymentMethod, userId } = data;

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
          userId: userId || null,
          cartId,
          customerEmail,
          customerCountryCode: customerCountryCode || '+91',
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

      // Clear cart items and decrement stock IMMEDIATELY ONLY for COD orders.
      // For online payments, we wait until payment is verified successfully.
      if (paymentMethod === PaymentMethod.COD) {
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
      }

      return newOrder;
    });

    // Create Payment (COD or Razorpay order)
    const paymentResult = await PaymentService.createOrder({
      amount: Number(order.totalAmount),
      currency: 'INR',
      method: paymentMethod,
      customerEmail,
      customerCountryCode,
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
      userId: order.userId,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      paymentMethod: order.paymentMethod,
      payment: paymentResult,
    };
  }

  public static async getOrderById(id: number, userId?: number) {
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
      throw new AppError('Order not found', 404);
    }

    if (userId && order.userId !== userId) {
      throw new AppError('Unauthorized access to this order', 403);
    }

    return order;
  }

  public static async getMyOrders(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, totalItems] = await prisma.$transaction([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.order.count({
        where: { userId },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      orders,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }
}
