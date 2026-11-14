import { AppError } from '../utils/helpers.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

// Central error handler. Returns one JSON shape and never sends stack traces.
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Something went wrong. Please try again.';

  if (err.code === 11000) {
    statusCode = 409;
    message = 'This record already exists.';
  }
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON body.';
  }
  if (statusCode >= 500) console.error('Server error:', err.message);
  if (res.headersSent) return next(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors ? { errors: err.errors } : {}),
  });
};
