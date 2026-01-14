import { BaseType } from '../../utils/utils.interface';

export type TUserProfile = BaseType & {
  businessName: string;
  phone: string;
  email: string;
  password: string;
  image?: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};
