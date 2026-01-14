

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FraudService } from './fraud.service';
import { JwtPayload } from 'jsonwebtoken';

const getFraudSetting = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const result = await FraudService.getFraudSetting(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fraud setting retrieved successfully',
    data: result,
  });
});

const updateFraudSetting = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { enabled, threshold } = req.body;
  const result = await FraudService.updateFraudSetting(userId, { enabled, threshold });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fraud setting updated successfully',
    data: result,
  });
});


// Accepts orderData (ip, email, billing, etc.) in req.body for FraudLabs Pro
const checkFraud = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const orderData = req.body;
  const result = await FraudService.checkFraud(userId, orderData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fraud check completed',
    data: result,
  });
});

// Add fraud setting for user
const addFraudSetting = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { enabled, threshold } = req.body;
  // status: boolean (true/false), riskScore: number
  const result = await FraudService.addFraudSetting(userId, enabled, threshold);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Fraud setting created successfully',
    data: result,
  });
});

// Check fraud using only email or phone
const checkFraudByEmailOrPhone = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { email, phone } = req.body;
  if (!email && !phone) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Either email or phone is required',
      data: null,
    });
  }
  const orderData: any = {};
  if (email) orderData.email = email;
  if (phone) orderData.phone = phone;
  const result = await FraudService.checkFraud(userId, orderData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fraud check (email/phone) completed',
    data: result,
  });
});


export const FraudController = {
  addFraudSetting,
  getFraudSetting,
  updateFraudSetting,
  checkFraud,
  checkFraudByEmailOrPhone,
};
