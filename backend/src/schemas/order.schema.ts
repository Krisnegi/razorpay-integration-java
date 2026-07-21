import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

export const checkoutOrderSchema = z.object({
  headers: z.object({
    'x-cart-id': z.string({ required_error: 'x-cart-id header is required for checkout' }).uuid('x-cart-id must be a valid UUID'),
  }).passthrough(),
  body: z.object({
    paymentMethod: z.nativeEnum(PaymentMethod, {
      errorMap: () => ({
        message: 'Invalid payment method. Must be one of: UPI, CARD, NETBANKING, WALLET, COD',
      }),
    }),
    customerEmail: z.string().email('Invalid customer email address'),
    customerPhone: z.string().optional().nullable(),
    shippingAddress: z.string().optional().nullable(),
  }),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, { message: 'Order ID must be a valid positive integer' }),
  }),
});
