import { z } from 'zod';
const SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/;

const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/\d/, 'Password must contain a number')
  .regex(SPECIAL_CHARS, 'Password must contain a special character');

export const registerSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  password: strongPassword,
  name: z.string().trim().min(1).max(80).optional(),
});

export const loginSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, 'Password is required'),
});

export const verifySchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  code: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: strongPassword,
});

export const resendVerificationSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
});