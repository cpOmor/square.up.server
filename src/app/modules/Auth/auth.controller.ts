import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: result.message,
    data: { email: result.email },
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyEmail(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const resendVerificationCode = catchAsync(async (req, res) => {
  const result = await AuthServices.resendVerificationCode(req.body.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, user } = result;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful!',
    data: { accessToken, user },
  });
});

const logoutUser = catchAsync(async (req, res) => {
  await AuthServices.logoutUser(req);
  
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully!',
    data: null,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const result = await AuthServices.refreshToken(req);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token refreshed successfully!',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgotPassword(req.body.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyOTP(req.body);

  res.cookie('resetToken', result.resetToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 1000 * 60 * 15, // 15 minutes
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: { resetToken: result.resetToken },
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const resetToken = req.cookies.resetToken || req.body.resetToken;
  const result = await AuthServices.resetPassword(resetToken, req.body.password);

  res.clearCookie('resetToken', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const AuthControllers = {
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
