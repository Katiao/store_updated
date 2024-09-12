import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Error as MongooseError } from 'mongoose';

interface ValidationError extends MongooseError {
  errors: {
    [key: string]: {
      message: string;
    };
  };
}

interface DuplicateKeyError extends MongooseError {
  code: number;
  keyValue: Record<string, any>;
}

interface CastError extends MongooseError {
  value: string;
}

 const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  if (err.name === 'ValidationError') {
    const validationError = err as ValidationError;
    customError.msg = Object.values(validationError.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = 400;
  }

  if ('code' in err && err.code === 11000) {
    const duplicateError = err as DuplicateKeyError;
    customError.msg = `Duplicate value entered for ${Object.keys(
      duplicateError.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  if (err.name === 'CastError') {
    const castError = err as CastError;
    customError.msg = `No item found with id : ${castError.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;