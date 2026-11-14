import rateLimit from 'express-rate-limit';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const createLimiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message },
  });

export const authLimiter = createLimiter(FIFTEEN_MINUTES, 20, 'Too many requests. Please try again later.');
export const loginLimiter = createLimiter(FIFTEEN_MINUTES, 10, 'Too many login attempts. Please try again later.');
export const otpLimiter = createLimiter(FIFTEEN_MINUTES, 10, 'Too many verification attempts. Please try again later.');
export const resendLimiter = createLimiter(ONE_HOUR, 5, 'Too many code requests. Please try again later.');
export const contactLimiter = createLimiter(ONE_HOUR, 5, 'Too many messages sent. Please try again later.');
