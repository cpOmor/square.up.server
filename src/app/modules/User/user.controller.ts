import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { JwtPayload } from 'jsonwebtoken';

const getUserProfile = catchAsync(async (req, res) => {
  const email = (req.user as JwtPayload).email;
  const result = await UserServices.getUserProfile(email as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const email = (req.user as JwtPayload).email;
  const result = await UserServices.updateUserProfile(email, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.profile,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const result = await UserServices.changePassword(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const UserControllers = {
  getUserProfile,
  updateUserProfile,
  changePassword,
};
