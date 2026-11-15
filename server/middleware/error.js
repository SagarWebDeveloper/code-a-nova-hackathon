import { AppError } from '../utils/helpers.js';

export const notFound = (req, res, next) => next(new AppError(`Route not found: ${req.originalUrl}`, 404));

// Central error handler. Always returns the same JSON shape and never leaks stack traces.
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Something went wrong. Please try again.';
  let errors = err.errors;

  if (err.name === 'ValidationError' && err.errors) {
    // Mongoose schema validation (for example a bad enum value or a missing field).
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = errors[0]?.message || 'Please check the submitted details.';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid request value.';
  } else if (err.code === 11000) {
    // Unique index violation. Friendly text for the fields users can actually trigger.
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0];
    const duplicateMessages = {
      email: 'An account with this email already exists.',
      userId: 'You have already registered for the hackathon.',
      registrationId: 'A registration with this ID already exists. Please try again.',
    };
    message = duplicateMessages[field] || 'This record already exists.';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON body.';
  }

  if (statusCode >= 500) console.error('Server error:', err.message);
  if (res.headersSent) return next(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};
