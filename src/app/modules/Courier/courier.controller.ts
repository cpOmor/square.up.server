
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourierService } from './courier.service';
import { JwtPayload } from 'jsonwebtoken';

/**
 * Create a new courier entry
 */
const createCourierEntry = catchAsync(async (req, res) => {
    
    const userId = (req.user as JwtPayload).id;
  const result = await CourierService.createCourierEntry(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Courier entry created successfully',
    data: result,
  });
});

/**
 * Get all courier entries
 */
const getAllCourierEntries = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const result = await CourierService.getAllCourierEntries(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courier entries retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

/**
 * Get a single courier entry
 */
const getCourierEntryById = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { id } = req.params;
  const result = await CourierService.getCourierEntryById(userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courier entry retrieved successfully',
    data: result,
  });
});

/**
 * Update a courier entry
 */
const updateCourierEntry = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { id } = req.params;
  const result = await CourierService.updateCourierEntry(userId, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courier entry updated successfully',
    data: result,
  });
});

/**
 * Delete a courier entry
 */
const deleteCourierEntry = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { id } = req.params;
  await CourierService.deleteCourierEntry(userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courier entry deleted successfully',
    data: null,
  });
});

/**
 * Get courier statistics
 */
const getCourierStats = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const result = await CourierService.getCourierStats(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courier statistics retrieved successfully',
    data: result,
  });
});

/**
 * Bulk delete courier entries by array of IDs
 */
const deleteMultipleCourierEntries = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const { ids } = req.body;
  const result = await CourierService.deleteMultipleCourierEntries(userId, ids);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courier entries deleted successfully',
    data: result,
  });
});

/**
 * Clear all courier entries for the authenticated user
 */
const clearAllCourierEntries = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload).id;
  const result = await CourierService.clearAllCourierEntries(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All courier entries deleted successfully',
    data: result,
  });
});

export const CourierController = {
  createCourierEntry,
  getAllCourierEntries,
  getCourierEntryById,
  updateCourierEntry,
  deleteCourierEntry,
  getCourierStats,
  deleteMultipleCourierEntries,
  clearAllCourierEntries,
};
