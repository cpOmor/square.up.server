import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DuplicatePhoneCheckService } from './duplicatePhoneCheck.service';
import { JwtPayload } from 'jsonwebtoken';

const getDuplicatePhoneCheckSetting = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const result = await DuplicatePhoneCheckService.getDuplicatePhoneCheckSetting(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Duplicate phone check setting retrieved successfully',
    data: result,
  });
});

const updateDuplicatePhoneCheckSetting = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { enabled, days } = req.body;
  const result = await DuplicatePhoneCheckService.updateDuplicatePhoneCheckSetting(userId, {
    enabled,
    days,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Duplicate phone check setting updated successfully',
    data: result,
  });
});

const createDuplicatePhoneCheckSetting = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { enabled, days } = req.body;
  const result = await DuplicatePhoneCheckService.createDuplicatePhoneCheckSetting(
    userId,
    enabled,
    days || 7
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Duplicate phone check setting created successfully',
    data: result,
  });
});

export const DuplicatePhoneCheckController = {
  getDuplicatePhoneCheckSetting,
  updateDuplicatePhoneCheckSetting,
  createDuplicatePhoneCheckSetting,
};
