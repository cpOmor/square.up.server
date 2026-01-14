import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { email: string; role?: string; id?: string; purpose?: string; businessName?: string; phone?: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
