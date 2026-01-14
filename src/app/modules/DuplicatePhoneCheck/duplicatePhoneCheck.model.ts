import { Schema, model } from 'mongoose';

export interface IDuplicatePhoneCheckSetting {
  userId: string;
  enabled: boolean;
  days?: number; // number of days to check for duplicates (default: 7)
}

const duplicatePhoneCheckSettingSchema = new Schema<IDuplicatePhoneCheckSetting>({
  userId: { type: String, required: true, index: true, unique: true },
  enabled: { type: Boolean, default: false },
  days: { type: Number, default: 7 },
});

export const DuplicatePhoneCheckSetting = model<IDuplicatePhoneCheckSetting>('DuplicatePhoneCheckSetting', duplicatePhoneCheckSettingSchema);
