import httpStatus from 'http-status';
import AppError from '../errors/AppError';

export const notFound = (message: string) => {
  return new AppError(httpStatus.NOT_FOUND, message, [
    {
      path: 'not-found',
      message,
    },
  ]);
};

export const forbidden = (message: string) => {
  return new AppError(httpStatus.FORBIDDEN, message, [
    {
      path: 'forbidden',
      message,
    },
  ]);
};

export const serverError = (message: string) => {
  return new AppError(httpStatus.INTERNAL_SERVER_ERROR, message, [
    {
      path: 'server-error',
      message,
    },
  ]);
};

export const unauthorized = (message: string) => {
  return new AppError(httpStatus.UNAUTHORIZED, message, [
    {
      path: 'unauthorized',
      message,
    },
  ]);
};
