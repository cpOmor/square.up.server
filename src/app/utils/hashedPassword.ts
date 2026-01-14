import bcrypt from 'bcrypt';
import config from '../config';

export const hashedPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
};
