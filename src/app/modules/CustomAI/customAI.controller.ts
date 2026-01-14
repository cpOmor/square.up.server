import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CustomAIService } from './customAI.service';
import { JwtPayload } from 'jsonwebtoken';

const setCustomPrompt = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { prompt } = req.body;
  const result = await CustomAIService.setCustomPrompt(userId, prompt);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Custom AI prompt set successfully',
    data: result,
  });
});

const getCustomPrompt = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const result = await CustomAIService.getCustomPrompt(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Custom AI prompt retrieved',
    data: result,
  });
});

const deleteCustomPrompt = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  await CustomAIService.deleteCustomPrompt(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Custom AI prompt deleted',
    data: null,
  });
});
const updateCustomPrompt = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { prompt } = req.body;
  const result = await CustomAIService.updateCustomPrompt(userId, prompt);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Custom AI prompt updated successfully',
    data: result,
  });
});

export const CustomAIController = {
  setCustomPrompt,
  getCustomPrompt,
  deleteCustomPrompt,
  updateCustomPrompt,
};
