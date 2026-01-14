
import { FraudSetting, IFraudSetting } from './fraudSetting.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import axios from 'axios';
import config from '../../config';

const getFraudSetting = async (userId: string) => {
  const setting = await FraudSetting.findOne({ userId });
  if (!setting) throw new AppError(httpStatus.NOT_FOUND, 'Fraud setting not found');
  return setting;
};

const updateFraudSetting = async (userId: string, update: Partial<IFraudSetting>) => {
  const setting = await FraudSetting.findOneAndUpdate({ userId }, update, { new: true, upsert: true });
  return setting;
}; 




const FRAUDLABS_API_KEY = config.fraudlabs_api_key || 'YOUR_API_KEY'; // Set your API key in env
 

const checkFraud = async (userId: string, orderData: Record<string, unknown>) => {
  const setting = await getFraudSetting(userId);
  if (!setting.enabled) return { allowed: true, reason: 'Fraud detection disabled' };

  // Prepare FraudLabs Pro API request
  const params = new URLSearchParams({
    key: FRAUDLABS_API_KEY,
    format: 'json',
    ...orderData,
  });

  const response = await axios.get(`https://api.fraudlabspro.com/v1/order/screen?${params.toString()}`);
  const result = response.data as Record<string, unknown>;

  // FraudLabs returns risk_score (0-100)
  const riskScore = parseFloat((result.risk_score as string) || '0');
  if (riskScore >= setting.threshold) {
    return { allowed: false, reason: `FraudLabsPro: Risk score ${riskScore}% exceeds threshold ${setting.threshold}%`, details: result };
  }
  return { allowed: true, reason: `FraudLabsPro: Risk score ${riskScore}% is below threshold ${setting.threshold}%`, details: result };
};

// Add a new fraud setting for a user
const addFraudSetting = async (userId: string, enabled: boolean, threshold: number) => {
  const setting = await FraudSetting.findOneAndUpdate(
    { userId },
    { enabled , threshold },
    { new: true, upsert: true }
  );
  return setting;
};

export const FraudService = {
  getFraudSetting,
  updateFraudSetting,
  addFraudSetting,
  checkFraud,
};
