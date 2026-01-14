import { Schema } from 'mongoose';
import { BaseType } from '../../utils/utils.interface';
import { TUserRole, TUserStatus } from './auth.utils';

export type TLoginUser = {
  email: string;
  password: string;
};

export type TRegisterUser = {
  businessName: string;
  phone: string;
  email: string;
  password: string;
  image?: string;
};

export type TVerification = {
  email?: string;
  code?: string;
  verification?: boolean;
  expired?: Date;
};

export type TUser = BaseType & {
  profileId: Schema.Types.ObjectId;
  email: string;
  alterNumber?: string;
  role: TUserRole;
  password: string;
  status: TUserStatus;
  verification?: TVerification;
  rememberPassword: boolean;
};

export type TProfile = BaseType & {
  businessName: string;
  phone: string;
  email: string;
  image?: string;
};
