import crypto from 'crypto';

// Error with an HTTP status code. The error middleware sends its message to the client.
export class AppError extends Error {
  constructor(message, statusCode = 500, errors) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
  }
}

// Forwards errors from async route handlers to the error middleware.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Cryptographically secure 6-digit OTP.
export const generateOtp = () => String(crypto.randomInt(100000, 1000000));

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Registration ID format: CNH-YYYYMMDD-XXXXXX
export const generateRegistrationId = () => {
  const d = new Date();
  const datePart = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const randomPart = Array.from(crypto.randomBytes(6), (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join('');
  return `CNH-${datePart}-${randomPart}`;
};

export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Cookie settings. In production the frontend (Vercel) and API (Render) are on different domains,
// so the cookie needs SameSite=None and Secure.
export const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  };
};
