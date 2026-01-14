import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { APIConfigService } from './apiConfig.service';
import { JwtPayload } from 'jsonwebtoken';

const createAPIConfig = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { apiKey, secretKey } = req.body;
  const result = await APIConfigService.createAPIConfig(userId, apiKey, secretKey);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'API config created successfully',
    data: result,
  });
});

const getAPIConfigById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await APIConfigService.getAPIConfigById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'API config retrieved successfully',
    data: result,
  });
});

const getAPIConfigs = catchAsync(async (req, res) => {
  const result = await APIConfigService.getAPIConfigs(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'API configs retrieved successfully',
    data: result,
  });
});

const updateAPIConfig = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await APIConfigService.updateAPIConfig(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'API config updated successfully',
    data: result,
  });
});

const deleteAPIConfig = catchAsync(async (req, res) => {
  const { id } = req.params;
  await APIConfigService.deleteAPIConfig(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'API config deleted successfully',
    data: null,
  });
});

export const APIConfigController = {
  createAPIConfig,
  getAPIConfigById,
  getAPIConfigs,
  updateAPIConfig,
  deleteAPIConfig,
};
