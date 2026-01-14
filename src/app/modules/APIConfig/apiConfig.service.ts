import { APIConfig, IAPIConfig } from './apiConfig.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createAPIConfig = async (userId: string, apiKey: string, secretKey: string) => {
  if (!userId || !apiKey || !secretKey) {
    throw new AppError(httpStatus.BAD_REQUEST, 'userId, apiKey, and secretKey are required');
  }


  const config = await APIConfig.findOneAndUpdate(
    { userId },
    { apiKey, secretKey },
    { new: true, upsert: true }
  );
  return config;

};


const getAPIConfigById = async (id: string) => {
  if (!id) throw new AppError(httpStatus.BAD_REQUEST, 'ID is required');
  const config = await APIConfig.findById(id);
  if (!config) throw new AppError(httpStatus.NOT_FOUND, 'API Config not found');
  return config;
};



const getAPIConfigs = async (filter: Partial<IAPIConfig> = {}) => {
  return APIConfig.findOne(filter);
};

const updateAPIConfig = async (id: string, update: Partial<IAPIConfig>) => {
  if (!id) throw new AppError(httpStatus.BAD_REQUEST, 'ID is required');
  if (!update || (Object.keys(update).length === 0)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Update data is required');
  }
  const config = await APIConfig.findByIdAndUpdate(id, update, { new: true });
  if (!config) throw new AppError(httpStatus.NOT_FOUND, 'API Config not found');
  return config;
};

const deleteAPIConfig = async (id: string) => {
  if (!id) throw new AppError(httpStatus.BAD_REQUEST, 'ID is required');
  const config = await APIConfig.findByIdAndDelete(id);
  if (!config) throw new AppError(httpStatus.NOT_FOUND, 'API Config not found');
  return config;
};

export const APIConfigService = {
  createAPIConfig,
  getAPIConfigById,
  getAPIConfigs,
  updateAPIConfig,
  deleteAPIConfig,
};
