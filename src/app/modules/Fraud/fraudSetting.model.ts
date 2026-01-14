import { Schema, model } from 'mongoose';

export interface IFraudSetting {
  userId: string;
  enabled: boolean;
  threshold: number; // percentage (0-100)
}

const fraudSettingSchema = new Schema<IFraudSetting>({
  userId: { type: String, required: true, index: true },
  enabled: { type: Boolean, default: false },
  threshold: { type: Number, default: 80 },
});

export const FraudSetting = model<IFraudSetting>('FraudSetting', fraudSettingSchema);
