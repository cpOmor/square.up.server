import { DuplicatePhoneCheckSetting, IDuplicatePhoneCheckSetting } from './duplicatePhoneCheck.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const getDuplicatePhoneCheckSetting = async (userId: string) => {
  const setting = await DuplicatePhoneCheckSetting.findOne({ userId });
  if (!setting) {
    // Return default setting if not exists
    return { userId, enabled: false, days: 7 };
  }
  return setting;
};

const updateDuplicatePhoneCheckSetting = async (userId: string, update: Partial<IDuplicatePhoneCheckSetting>) => {
  const setting = await DuplicatePhoneCheckSetting.findOneAndUpdate(
    { userId },
    update,
    { new: true, upsert: true }
  );
  return setting;
};

const createDuplicatePhoneCheckSetting = async (
  userId: string,
  enabled: boolean,
  days: number = 7
) => {
  const setting = await DuplicatePhoneCheckSetting.findOneAndUpdate(
    { userId },
    { enabled, days },
    { new: true, upsert: true }
  );
  return setting;
};

export const DuplicatePhoneCheckService = {
  getDuplicatePhoneCheckSetting,
  updateDuplicatePhoneCheckSetting,
  createDuplicatePhoneCheckSetting,
};
