
import { z } from 'zod';

const createCourierEntryValidationSchema = z.object({
  body: z.object({
    rawText: z.string({
      required_error: 'Raw text is required',
    }).min(1, 'Raw text cannot be empty'),
  }),
});

const updateCourierEntryValidationSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'processed', 'delivered', 'cancelled']).optional(),
    customerInfo: z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      quantity: z.number().optional(),
      codAmount: z.number().optional(),
    }).optional(),
  }),
});

const bulkDeleteCourierEntriesValidationSchema = z.object({
  body: z.object({
    ids: z.array(z.string().min(1)).min(1, 'At least one ID is required'),
  }),
});

export const CourierValidation = {
  createCourierEntryValidationSchema,
  updateCourierEntryValidationSchema,
  bulkDeleteCourierEntriesValidationSchema,
};
