import { z } from 'zod';

export const getProductsQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val > 0, { message: 'Page must be a positive integer' }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => val > 0 && val <= 50, { message: 'Limit must be between 1 and 50' }),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, { message: 'Product ID must be a valid positive integer' }),
  }),
});
