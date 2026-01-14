import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { CourierEntry } from './courier.model';
import { TCreateCourierEntry, TCourierEntry } from './courier.interface';
import {
  parseCustomerInfoWithGemini,
  basicParseCustomerInfo,
} from '../../utils/parseCustomerInfo';
import QueryBuilder from '../../builder/QueryBuilder';
import axios from 'axios';
import { APIConfig } from '../APIConfig/apiConfig.model';

const createCourierEntry = async (
  userId: string,
  payload: TCreateCourierEntry,
) => {
  let customerInfo;
  let parsedBy: 'ai' | 'manual' = 'ai';

  try {
    customerInfo = await parseCustomerInfoWithGemini(payload.rawText);
    parsedBy = 'ai';
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      'AI parsing failed, using basic parser as fallback:',
      errorMessage,
    );
    customerInfo = basicParseCustomerInfo(payload.rawText);
    parsedBy = 'manual';
  }




  if(!customerInfo || !customerInfo?.phone || !customerInfo?.name){
      throw new AppError(
        httpStatus.CONFLICT,
        "Data processing error",
      );
  }
 
  if (customerInfo.phone) { 
    const existingEntry = await CourierEntry.findOne({
      userId,
      'customerInfo.phone': customerInfo.phone,
    });
 

    if (existingEntry) {
      // Check if name, phone, and address match
      const isSameCustomer =
        existingEntry.customerInfo.name === customerInfo.name &&
        existingEntry.customerInfo.phone === customerInfo.phone &&
        existingEntry.customerInfo.address === customerInfo.address;

      // If data matches, allow the entry (same customer)
      if (!isSameCustomer) {
        // Data doesn't match - different customer with same phone
        const errorMessage = `Duplicate phone number found. Existing entry: ${existingEntry.customerInfo.name}, ${existingEntry.customerInfo.address}`;
        throw new AppError(
          httpStatus.CONFLICT,
          errorMessage,
        );
      }
    }
  }

  let packzyResponse = null;

  const apiConfig = await APIConfig.findOne({ userId });
  if (!apiConfig) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'API Config not found for Steadfast courier',
    );
  }
  const orderData = {
    invoice: customerInfo.invoice || 'INV' + Date.now(),
    recipient_name: customerInfo.name,
    recipient_phone: customerInfo.phone,
    recipient_address: customerInfo.address,
    cod_amount: customerInfo.codAmount || customerInfo.cod_amount || 0,
    alternative_phone:
      customerInfo.alternative_phone || customerInfo.alternativePhone || '',
    recipient_email:
      customerInfo.recipient_email || customerInfo.recipientEmail || '',
    note: customerInfo.note || '',
    item_description:
      customerInfo.item_description || customerInfo.itemDescription || '',
    total_lot: customerInfo.total_lot || customerInfo.totalLot || undefined,
    delivery_type: customerInfo.delivery_type || customerInfo.deliveryType || 0,
  };
  
  Object.keys(orderData).forEach(
    (key) => (orderData as Record<string, unknown>)[key] === undefined && delete (orderData as Record<string, unknown>)[key],
  );

  

  try {
     
    const response = await axios.post(
      'https://portal.packzy.com/api/v1/create_order',
      orderData,
      {
        headers: {
          'Api-Key': apiConfig.apiKey,
          'Secret-Key': apiConfig.secretKey,
          'Content-Type': 'application/json',
        },
      },
    ); 
    packzyResponse = response.data;
  } catch (err: unknown) {
    const axiosError = err as any; // Type guard for axios errors
    
    if (axiosError?.response) {
      console.error('Packzy API error response:', {
        status: axiosError.response.status,
        statusText: axiosError.response.statusText,
        data: axiosError.response.data,
      });
    } else {
      console.error('Packzy API error (no response):', axiosError?.message || axiosError);
    }
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to add data to Steadfast courier. ' +
        (axiosError?.response?.data?.message || axiosError?.message || 'Unknown error'),
    );
  }

  // Create the courier entry
  const courierData: Partial<TCourierEntry> = {
    userId,
    rawText: payload.rawText,
    customerInfo,
    parsedBy,
    status: 'pending',
  };

  const result = await CourierEntry.create(courierData);

  return { ...result.toObject(), packzyResponse };
};

const getAllCourierEntries = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const courierQuery = new QueryBuilder(CourierEntry.find({ userId }), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courierQuery.modelQuery;

  // Pagination meta
  const meta = await courierQuery.getPaginationMeta();

  return {
    result,
    meta,
  };
};
const clearAllCourierEntries = async (userId: string) => {
  const result = await CourierEntry.deleteMany({ userId });
  return result;
};

/**
 * Get a single courier entry by ID
 */
const getCourierEntryById = async (userId: string, entryId: string) => {
  const result = await CourierEntry.findOne({ _id: entryId, userId });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Courier entry not found');
  }

  return result;
};

/**
 * Update a courier entry
 */
const updateCourierEntry = async (
  userId: string,
  entryId: string,
  payload: Partial<TCourierEntry>,
) => {
  const entry = await CourierEntry.findOne({ _id: entryId, userId });

  if (!entry) {
    throw new AppError(httpStatus.NOT_FOUND, 'Courier entry not found');
  }

  const result = await CourierEntry.findByIdAndUpdate(entryId, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

/**
 * Delete a courier entry
 */
const deleteCourierEntry = async (userId: string, entryId: string) => {
  const entry = await CourierEntry.findOne({ _id: entryId, userId });

  if (!entry) {
    throw new AppError(httpStatus.NOT_FOUND, 'Courier entry not found');
  }

  const result = await CourierEntry.findByIdAndDelete(entryId);
  return result;
};

/**
 * Get statistics for courier entries
 */
const getCourierStats = async (userId: string) => {
  const totalEntries = await CourierEntry.countDocuments({ userId });
  const pendingEntries = await CourierEntry.countDocuments({
    userId,
    status: 'pending',
  });
  const processedEntries = await CourierEntry.countDocuments({
    userId,
    status: 'processed',
  });
  const deliveredEntries = await CourierEntry.countDocuments({
    userId,
    status: 'delivered',
  });
  const cancelledEntries = await CourierEntry.countDocuments({
    userId,
    status: 'cancelled',
  });

  const aiParsedEntries = await CourierEntry.countDocuments({
    userId,
    parsedBy: 'ai',
  });
  const manualParsedEntries = await CourierEntry.countDocuments({
    userId,
    parsedBy: 'manual',
  });

  return {
    total: totalEntries,
    status: {
      pending: pendingEntries,
      processed: processedEntries,
      delivered: deliveredEntries,
      cancelled: cancelledEntries,
    },
    parsedBy: {
      ai: aiParsedEntries,
      manual: manualParsedEntries,
    },
  };
};

/**
 * Bulk delete courier entries by array of IDs
 */
async function deleteMultipleCourierEntries(userId: string, ids: string[]) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No IDs provided for bulk delete',
    );
  }
  // Only delete entries belonging to the user
  const result = await CourierEntry.deleteMany({ _id: { $in: ids }, userId });
  return result;
}

export const CourierService = {
  createCourierEntry,
  getAllCourierEntries,
  clearAllCourierEntries,
  getCourierEntryById,
  updateCourierEntry,
  deleteCourierEntry,
  getCourierStats,
  deleteMultipleCourierEntries,
};
