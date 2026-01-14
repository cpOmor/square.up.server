import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { User } from '../modules/Auth/auth.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!', [
        {
          path: 'authorization',
          message: 'You are not authorized!',
        },
      ]);
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized', [
        {
          path: 'authorization',
          message: 'Invalid or expired token',
        },
      ]);
    }

    const { role, email } = decoded;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!', [
        {
          path: 'user',
          message: 'User not found!',
        },
      ]);
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized!',
        [
          {
            path: 'authorization',
            message: 'You are not authorized!',
          },
        ],
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
