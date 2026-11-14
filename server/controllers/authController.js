import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpEmail } from '../services/emailService.js';
import { AppError, asyncHandler, generateOtp, cookieOptions, SESSION_MAX_AGE_MS } from '../utils/helpers.js';

const OTP_TTL_MS = Number(process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 30 * 1000;

// Generates a new OTP, stores only its bcrypt hash (which invalidates any previous code),
// and emails the plain code. Returns false if the email could not be sent.
const issueOtp = async (userId, email) => {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  await User.updateOne(
    { _id: userId },
    { $set: { otpHash, otpExpiresAt: new Date(Date.now() + OTP_TTL_MS), otpAttempts: 0, otpLastSentAt: new Date() } }
  );
  try {
    await sendOtpEmail(email, otp);
    console.log(`OTP sent to ${email.replace(/^(.).*(@.*)$/, '$1***$2')}`);
    return true;
  } catch (err) {
    console.error('OTP email failed:', err.message);
    return false;
  }
};

// POST /api/auth/signup
export const signup = asyncHandler(async (req, res) => {
  const fullName = req.body.fullName.trim();
  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password;

  const existing = await User.findOne({ email });

  // Already verified: give the same generic reply so attackers cannot discover registered emails.
  if (existing?.isVerified) {
    return res.status(201).json({
      success: true,
      email,
      message: 'If this email is eligible, a verification code has been sent.',
    });
  }

  let user = existing;
  if (user) {
    // Unverified account: refresh the details and send a new code.
    user.fullName = fullName;
    user.password = password;
    await user.save();
  } else {
    user = await User.create({ fullName, email, password });
  }

  const sent = await issueOtp(user._id, email);
  res.status(201).json({
    success: true,
    email,
    message: sent
      ? 'Verification code sent to your email.'
      : 'We could not send the code right now. Please click Resend.',
  });
});

// POST /api/auth/verifyotp
export const verifyOtp = asyncHandler(async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ email }).select('+otpHash +otpExpiresAt +otpAttempts');

  if (!user || user.isVerified || !user.otpHash) {
    throw new AppError('Invalid or expired code. Please request a new one.', 400);
  }
  if (user.otpExpiresAt < Date.now()) {
    throw new AppError('This code has expired. Please request a new one.', 400);
  }
  if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
    throw new AppError('Too many attempts. Please request a new code.', 429);
  }

  const matches = await bcrypt.compare(req.body.otp, user.otpHash);
  if (!matches) {
    await User.updateOne({ _id: user._id }, { $inc: { otpAttempts: 1 } });
    const left = Math.max(OTP_MAX_ATTEMPTS - (user.otpAttempts + 1), 0);
    throw new AppError(`Incorrect code. ${left} attempt(s) left.`, 400);
  }

  // One-time use: mark verified and remove the stored OTP.
  await User.updateOne(
    { _id: user._id },
    { $set: { isVerified: true, otpAttempts: 0 }, $unset: { otpHash: 1, otpExpiresAt: 1 } }
  );

  res.json({ success: true, message: 'Email verified. You can now log in.' });
});

// POST /api/auth/resendotp
export const resendOtp = asyncHandler(async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ email }).select('+otpLastSentAt');
  const generic = { success: true, message: 'If this account needs verification, a new code has been sent.' };

  if (!user || user.isVerified) return res.json(generic);

  const elapsed = Date.now() - (user.otpLastSentAt?.getTime() || 0);
  if (elapsed < RESEND_COOLDOWN_MS) {
    const retryAfterSeconds = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
    return res.status(429).json({
      success: false,
      message: `Please wait ${retryAfterSeconds} seconds before requesting another code.`,
      retryAfterSeconds,
    });
  }

  const sent = await issueOtp(user._id, email);
  res.json({
    success: true,
    message: sent ? 'A new code has been sent.' : 'Could not send the code. Please try again.',
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const user = await User.findOne({ email }).select('+password');

  const passwordOk = user && (await bcrypt.compare(req.body.password, user.password));
  if (!passwordOk) throw new AppError('Invalid email or password', 401);

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email first.',
      requiresVerification: true,
      email: user.email,
    });
  }

  const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('token', token, { ...cookieOptions(), maxAge: SESSION_MAX_AGE_MS });
  res.json({
    success: true,
    user: { id: user._id, fullName: user.fullName, email: user.email, isVerified: user.isVerified },
  });
});

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ success: true, message: 'Logged out' });
};
