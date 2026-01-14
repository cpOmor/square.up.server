import { Schema, model } from 'mongoose';

export interface ICustomAIPrompt {
  userId: string;
  prompt: string;
}

const customAIPromptSchema = new Schema<ICustomAIPrompt>({
  userId: { type: String, required: true, index: true, unique: true },
  prompt: { type: String, required: true, maxlength: 50 },
});

export const CustomAIPrompt = model<ICustomAIPrompt>('CustomAIPrompt', customAIPromptSchema);
