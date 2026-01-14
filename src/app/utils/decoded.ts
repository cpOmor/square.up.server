import jwt, { JwtPayload } from 'jsonwebtoken';

export const decoded = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
