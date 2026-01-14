import { BaseType } from '../../utils/utils.interface';

export type TCustomerInfo = {
  name?: string;
  phone?: string;
  address?: string;
  quantity?: number;
  codAmount?: number;
  [key: string]: any; // Allow additional parsed fields
};

export type TCourierEntry = BaseType & {
  userId: string;
  rawText: string;
  customerInfo: TCustomerInfo;
  parsedBy: 'ai' | 'manual';
  status: 'pending' | 'processed' | 'delivered' | 'cancelled';
};

export type TCreateCourierEntry = {
  rawText: string;
};
