
import passport from 'passport';
import './googleAuth';
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();
// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Success: req.user থেকে token generate করে redirect করো
    // const token = generateToken(req.user);
    // res.redirect(`http://localhost:3000/login?token=${token}`);
    res.send('Google Auth Success');
  }
);

// Register new user
router.post(
  '/register',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthControllers.registerUser,
);

// Verify email with OTP
router.post(
  '/verify-email',
  validateRequest(AuthValidation.verifyOTPValidationSchema),
  AuthControllers.verifyEmail,
);

// Resend verification code
router.post(
  '/resend-code',
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthControllers.resendVerificationCode,
);

// Login user
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

// Logout user
router.post('/logout', AuthControllers.logoutUser);

// Refresh token
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

// Forgot password - Send OTP
router.post(
  '/forgot-password',
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthControllers.forgotPassword,
);

// Verify OTP for password reset
router.post(
  '/verify-otp',
  validateRequest(AuthValidation.verifyOTPValidationSchema),
  AuthControllers.verifyOTP,
);

// Reset password
router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
