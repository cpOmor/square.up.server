/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config, {
  jwt_access_expires_in,
  jwt_refresh_expires_in,
} from '../../config';
import AppError from '../../errors/AppError';
import { TLoginUser, TProfile, TRegisterUser, TUser, TVerification } from './auth.interface';
import { forbidden, notFound } from '../../utils/errorfunc';
import { createToken, verifyToken } from '../../utils/utils';
import { generateUniqueCode } from '../../utils/generateUniqueCode';
import { TEmailInfo } from '../../utils/utils.interface';
import sendEmail from '../../utils/sendEmail';
import { UserStatus } from './auth.utils';
import { Profile, User } from './auth.model';
import { hashedPassword } from '../../utils/hashedPassword';

// Register a new user
const registerUser = async (payload: TRegisterUser) => {
  // Check if user already exists with email
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exists with this email', [
      {
        path: 'email',
        message: 'User already exists with this email',
      },
    ]);
  }

  // Check if phone number already exists
  const existingPhone = await Profile.findOne({ phone: payload.phone });
  if (existingPhone) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This phone number is already registered', [
      {
        path: 'phone',
        message: 'This phone number is already registered',
      },
    ]);
  }

  // Hash the password
  const hashedPass = await hashedPassword(payload.password);

  // Create profile
  const profileData: TProfile = {
    businessName: payload.businessName,
    phone: payload.phone,
    email: payload.email,
    image: payload.image,
  };

  const profile = await Profile.create(profileData);

  // Generate verification code
  const code = generateUniqueCode(5);
  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 5);

  // Create user
  const userData: Partial<TUser> = {
    profileId: profile._id as any,
    email: payload.email,
    password: hashedPass,
    verification: {
      code,
      verification: false,
      expired,
    },
  };

  const user = await User.create(userData);

  // Send verification email
  const emailData: TEmailInfo = {
    email: payload.email,
    subject: 'Verify Your Email - AI Server',
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #fff; margin: 0;">AI Server</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <h2 style="color: #333;">Welcome, ${payload.businessName}!</h2>
                      <p style="font-size: 16px; color: #555;">Thank you for registering with AI Server. Please verify your email using the code below:</p>
                      <table align="center" style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <tr>
                          <td style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px;">${code}</td>
                        </tr>
                      </table>
                      <p style="font-size: 14px; color: #d32f2f; margin-top: 10px;">
                        ⚠ This code is valid for <strong>5 minutes</strong> only.
                      </p>
                      <p style="font-size: 14px; color: #777;">If you didn't request this, please ignore this email.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 8px 8px;">
                      <p>&copy; 2025 AI Server. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  const isSentMail = await sendEmail(emailData);
  if (!isSentMail) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Mail not sent!', [
      {
        path: 'authorization',
        message: 'Mail not sent!',
      },
    ]);
  }
  return {
    message: 'Registration successful! Please check your email for verification code.',
    email: user.email,
  };
};

// Resend verification code
const resendVerificationCode = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw notFound('User not found!');
  }

  if (user?.verification?.verification) {
    throw forbidden('Email already verified');
  }

  // Generate new verification code
  const code = generateUniqueCode(5);
  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 5);

  // Get profile for user name
  const profile = await Profile.findOne({ email });

  // Send verification email
  const emailData: TEmailInfo = {
    email: email,
    subject: 'Verify Your Email - AI Server',
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #fff; margin: 0;">AI Server</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <h2 style="color: #333;">Welcome, ${profile?.businessName || 'User'}!</h2>
                      <p style="font-size: 16px; color: #555;">Here is your new verification code:</p>
                      <table align="center" style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <tr>
                          <td style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px;">${code}</td>
                        </tr>
                      </table>
                      <p style="font-size: 14px; color: #d32f2f; margin-top: 10px;">
                        ⚠ This code is valid for <strong>5 minutes</strong> only.
                      </p>
                      <p style="font-size: 14px; color: #777;">If you didn't request this, please ignore this email.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 8px 8px;">
                      <p>&copy; 2025 AI Server. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  const isSentMail = await sendEmail(emailData);
  if (!isSentMail) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Mail not sent!', [
      {
        path: 'authorization',
        message: 'Mail not sent!',
      },
    ]);
  }

  // Update user with new code
  await User.findOneAndUpdate(
    { email },
    {
      verification: {
        code,
        verification: false,
        expired,
      },
    },
  );

  return {
    message: 'New verification code sent to your email!',
  };
};

// Verify email with OTP
const verifyEmail = async (payload: TVerification) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw notFound('User not found!');
  }

  if (user?.verification?.verification) {
    throw forbidden('Email already verified');
  }

  if (!payload?.code) {
    throw forbidden('Enter 6 digit code');
  }

  if (new Date() > (user?.verification?.expired as Date)) {
    throw forbidden('Code expired. Please request a new code.');
  }

  if (!(payload?.code === user?.verification?.code)) {
    throw forbidden("Oops! That's not the right code");
  }

  await User.findOneAndUpdate(
    { email: payload.email },
    {
      verification: {
        code: user?.verification?.code,
        verification: true,
        expired: user?.verification?.expired,
      },
      status: UserStatus.active,
    },
  );

  return {
    message: 'Email verified successfully! You can now login.',
  };
};

// Login user
const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  
  if (!user) {
    throw notFound('User not found!');
  }

  console.log(user?.verification?.verification)
  
  if (!user?.verification?.verification) {
    console.log(user?.verification?.verification)
    const error: any = forbidden('Please verify your email first!');
    error.data = { verification: false };
    throw error;
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user?.password);

  console.log(isPasswordMatched)

  if (!isPasswordMatched) {
    throw forbidden('Invalid password');
  }

  const userStatus = user?.status;
  if (userStatus === UserStatus.blocked) {
    throw forbidden('Your account has been blocked');
  }

  if (user?.status !== UserStatus.active) {
    throw forbidden('Your account is not active');
  }

  const profile = await Profile.findOne({ email: user?.email });

  if (!profile) {
    throw forbidden('Profile not found');
  }

  const jwtPayload = {
    email: user?.email,
    businessName: profile?.businessName,
    phone: profile?.phone,
    id: user?._id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      role: user.role,
      businessName: profile.businessName,
    },
  };
};

// Logout user
const logoutUser = async (req: any) => {
  req.headers.authorization = '';
  req.cookies.refreshToken = '';
  
  return {
    message: 'Logged out successfully',
  };
};

// Refresh token
const refreshToken = async (req: any) => {
  const { refreshToken } = req.cookies;

  const decoded = verifyToken(refreshToken, config.jwt_refresh_secret as string);

  const { email } = decoded;
  const user = await User.findOne({ email });

  if (!user) {
    throw notFound('User not found!');
  }

  const userStatus = user?.status;
  if (userStatus === UserStatus.blocked) {
    throw forbidden('Your account has been blocked');
  }

  if (user.status !== UserStatus.active) {
    throw forbidden('Your account is not active');
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
    id: user?._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

// Forgot password - Send OTP
const forgotPassword = async (email: string) => {
  console.log("email", email)
  const user = await User.findOne({ email });
  
  if (!user) {
    throw notFound('User not found!');
  }

  // if (!user?.verification?.verification) {
  //   const error: any = forbidden('Please verify your email first!');
  //   error.data = { verification: false };
  //   throw error;
  // }

  const userStatus = user?.status;
  if (userStatus === UserStatus.blocked) {
    throw forbidden('Your account has been blocked');
  }

  const code = generateUniqueCode(5);
  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 5);

  const emailData: TEmailInfo = {
    email: email,
    body: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
          <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="background-color: #FF5722; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #fff; margin: 0;">🔐 Password Reset</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <h2 style="color: #333;">Reset Your Password</h2>
                      <p style="font-size: 16px; color: #555;">You requested to reset your password. Use the verification code below:</p>
                      <table align="center" style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <tr>
                          <td style="font-size: 32px; font-weight: bold; color: #FF5722; letter-spacing: 5px;">${code}</td>
                        </tr>
                      </table>
                      <p style="font-size: 14px; color: #d32f2f; margin-top: 10px; font-weight: bold;">
                        ⚠ This code is valid for <strong>5 minutes</strong> only.
                      </p>
                      <p style="font-size: 14px; color: #777;">If you didn't request this, please ignore this email or contact support.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 8px 8px;">
                      <p>&copy; 2025 AI Server. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    subject: 'Reset Your Password - AI Server',
  };

  const sentMail = await sendEmail(emailData);

  if(!sentMail){
    throw new AppError(httpStatus.UNAUTHORIZED, 'Mail not send!', [
        {
          path: 'authorization',
          message: 'Mail not send!',
        },
      ]);
  }

  

  if (sentMail) {
    await User.findOneAndUpdate(
      { email },
      {
        verification: {
          code,
          verification: user?.verification?.verification,
          expired,
        },
      },
    );
  }

  return {
    message: 'Verification code sent to your email',
  };
};

// Verify OTP for password reset
const verifyOTP = async (payload: { email: string; code: string }) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw notFound('User not found!');
  }

  if (!payload?.code) {
    throw forbidden('Enter 5 digit code');
  }

  if (new Date() > (user?.verification?.expired as Date)) {
    throw forbidden('Code expired. Please request a new code.');
  }

  if (!(payload?.code === user?.verification?.code)) {
    throw forbidden("Oops! That's not the right code");
  }

  // Generate a temporary token for password reset
  const resetToken = createToken(
    { email: user.email, purpose: 'reset' },
    config.jwt_access_secret as string,
    '15m', // 15 minutes validity
  );

  return {
    message: 'OTP verified successfully',
    resetToken,
  };
};

// Reset password
const resetPassword = async (resetToken: string, newPassword: string) => {
   
  let decoded;
  try {
    decoded = verifyToken(resetToken, config.jwt_access_secret as string);
  } catch (error) {
    throw forbidden('Invalid or expired reset token');
  }

  if (decoded.purpose !== 'reset') {
    throw forbidden('Invalid reset token');
  }

  const user = await User.findOne({ email: decoded.email });

  if (!user) {
    throw notFound('User not found!');
  }

  const hashedPass = await hashedPassword(newPassword);

  await User.findOneAndUpdate(
    { email: decoded.email },
    { password: hashedPass },
  );

  return {
    message: 'Password reset successfully! You can now login with your new password.',
  };
};

export const AuthServices = {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  logoutUser,
  refreshToken,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
