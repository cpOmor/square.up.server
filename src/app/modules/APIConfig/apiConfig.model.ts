import { Schema, model } from 'mongoose';

export interface IAPIConfig {
  userId: string;
  apiKey: string;
  secretKey: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const apiConfigSchema = new Schema<IAPIConfig>({
  userId: { type: String, required: true, index: true },
  apiKey: { type: String, required: true, unique: true },
  secretKey: { type: String, required: true },
}, {
  timestamps: true,
});

export const APIConfig = model<IAPIConfig>('APIConfig', apiConfigSchema);
