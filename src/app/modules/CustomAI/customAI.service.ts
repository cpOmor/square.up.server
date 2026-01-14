import { CustomAIPrompt, ICustomAIPrompt } from './customAIPrompt.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const setCustomPrompt = async (userId: string, prompt: string) => {
  if (!prompt || prompt.trim().length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Prompt is required');
  }
  if (prompt.length > 5000) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Prompt must be 5000 characters or less');
  }
  const doc = await CustomAIPrompt.findOneAndUpdate(
    { userId },
    { prompt },
    { new: true, upsert: true }
  );
  return doc;
};

const getCustomPrompt = async (userId: string) => {
  const doc = await CustomAIPrompt.findOne({ userId });
  if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Custom prompt not set');
  return doc;
};

const deleteCustomPrompt = async (userId: string) => {
  const doc = await CustomAIPrompt.findOneAndDelete({ userId });
  if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Custom prompt not set');
  return doc;
};
const updateCustomPrompt = async (userId: string, prompt: string) => {
  if (!prompt || prompt.trim().length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Prompt is required');
  }
  if (prompt.length > 5000) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Prompt must be 5000 characters or less');
  }
  const doc = await CustomAIPrompt.findOneAndUpdate(
    { userId },
    { prompt },
    { new: true }
  );
  if (!doc) throw new AppError(httpStatus.NOT_FOUND, 'Custom prompt not set');
  return doc;
};

export const CustomAIService = {
  setCustomPrompt,
  getCustomPrompt,
  deleteCustomPrompt,
  updateCustomPrompt,
};
