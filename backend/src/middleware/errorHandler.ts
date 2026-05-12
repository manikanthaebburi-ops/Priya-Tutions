import { Request, Response, NextFunction } from 'express';

interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = `Invalid Data`;
    err.statusCode = 400;
    return res.status(err.statusCode).json({
      success: false,
      message,
      errors: (err as any).errors
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = `Duplicate Field Value`;
    err.statusCode = 400;
    return res.status(err.statusCode).json({
      success: false,
      message,
      field: (err as any).errors?.[0]?.path
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = `Invalid Token`;
    err.statusCode = 401;
    return res.status(err.statusCode).json({
      success: false,
      message
    });
  }

  if (err.name === 'TokenExpiredError') {
    const message = `Token Expired`;
    err.statusCode = 401;
    return res.status(err.statusCode).json({
      success: false,
      message
    });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
