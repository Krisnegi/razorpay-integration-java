import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    countryCode: z.string().regex(/^\+\d{1,4}$/, 'Invalid country code format (e.g. +91)').optional().nullable(),
    phone: z
      .string()
      .regex(/^\d{7,15}$/, 'Phone number must contain between 7 and 15 digits')
      .optional()
      .nullable()
      .or(z.literal('')),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
