import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError, asyncHandler } from '../utils/helpers.js';

// Reads the JWT from the httpOnly "token" cookie and attaches the verified user to req.user.
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new AppError('Not authenticated', 401);

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Session expired. Please log in again.', 401);
  }

  const user = await User.findById(payload.id);
  if (!user || !user.isVerified) throw new AppError('Not authenticated', 401);

  req.user = user;
  next();
});
