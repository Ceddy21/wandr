import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
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
  newPassword: z.string()
    .min(6, 'New password must be at least 6 characters')
    .max(100, 'Password is too long'),
});

export const resendVerificationSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
});