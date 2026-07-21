import { z } from 'zod';

export const getCartHeaderSchema = z.object({
  headers: z.object({
    'x-cart-id': z.string().uuid('x-cart-id must be a valid UUID').optional(),
  }).passthrough(),
});

export const addToCartSchema = z.object({
  headers: z.object({
    'x-cart-id': z.string().uuid('x-cart-id must be a valid UUID').optional(),
  }).passthrough(),
  body: z.object({
    productId: z.number().int().positive('productId must be a positive integer'),
    quantity: z.number().int().positive('quantity must be a positive integer').default(1),
  }),
});

export const updateCartItemSchema = z.object({
  headers: z.object({
    'x-cart-id': z.string({ required_error: 'x-cart-id header is required' }).uuid('x-cart-id must be a valid UUID'),
  }).passthrough(),
  params: z.object({
    productId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, { message: 'productId must be a valid positive integer' }),
  }),
  body: z.object({
    quantity: z.number().int().positive('quantity must be at least 1'),
  }),
});

export const removeCartItemSchema = z.object({
  headers: z.object({
    'x-cart-id': z.string({ required_error: 'x-cart-id header is required' }).uuid('x-cart-id must be a valid UUID'),
  }).passthrough(),
  params: z.object({
    productId: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, { message: 'productId must be a valid positive integer' }),
  }),
});

export const clearCartSchema = z.object({
  headers: z.object({
    'x-cart-id': z.string({ required_error: 'x-cart-id header is required' }).uuid('x-cart-id must be a valid UUID'),
  }).passthrough(),
});
