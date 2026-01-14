import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required.' }).email('Invalid email format'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const registerValidationSchema = z.object({
  body: z.object({
    businessName: z.string({ required_error: 'Business name is required' }),
    phone: z.string({ required_error: 'Phone number is required' }),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters'),
    image: z.string().optional(),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
  }),
});

const verifyOTPValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
    code: z.string({ required_error: 'Verification code is required' }).length(5, 'Code must be 5 digits'),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters'),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  registerValidationSchema,
  forgotPasswordValidationSchema,
  verifyOTPValidationSchema,
  resetPasswordValidationSchema,
  refreshTokenValidationSchema,
};
