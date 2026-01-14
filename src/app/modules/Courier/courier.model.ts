import { Schema, model } from 'mongoose';
import { TCourierEntry, TCustomerInfo } from './courier.interface';

const customerInfoSchema = new Schema<TCustomerInfo>(
  {
    name: { type: String },
    phone: { type: String },
    address: { type: String },
    quantity: { type: Number },
    codAmount: { type: Number },
  },
  { _id: false, strict: false }
);

const courierEntrySchema = new Schema<TCourierEntry>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    rawText: {
      type: String,
      required: true,
    },
    customerInfo: {
      type: customerInfoSchema,
      required: true,
    },
    parsedBy: {
      type: String,
      enum: ['ai', 'manual'],
      default: 'ai',
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const CourierEntry = model<TCourierEntry>('CourierEntry', courierEntrySchema);
