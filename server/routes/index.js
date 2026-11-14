import { Router } from 'express';
import { asyncHandler } from '../utils/helpers.js';
import { protect } from '../middleware/auth.js';
import {
  handleValidation,
  signupRules,
  loginRules,
  otpRules,
  emailRules,
  profileRules,
  registrationRules,
  contactRules,
} from '../middleware/validators.js';
import { authLimiter, loginLimiter, otpLimiter, resendLimiter, contactLimiter } from '../middleware/rateLimiters.js';
import * as auth from '../controllers/authController.js';
import * as user from '../controllers/userController.js';
import * as hackathon from '../controllers/hackathonController.js';
import * as contact from '../controllers/contactController.js';

const router = Router();

// Auth
router.post('/auth/signup', authLimiter, signupRules, handleValidation, asyncHandler(auth.signup));
router.post('/auth/verifyotp', otpLimiter, otpRules, handleValidation, asyncHandler(auth.verifyOtp));
router.post('/auth/resendotp', resendLimiter, emailRules, handleValidation, asyncHandler(auth.resendOtp));
router.post('/auth/login', loginLimiter, loginRules, handleValidation, asyncHandler(auth.login));
router.post('/auth/logout', auth.logout);

// User
router.get('/user/me', protect, user.getMe);
router.put('/user/update', protect, profileRules, handleValidation, asyncHandler(user.updateProfile));

// Hackathon
router.get('/hackathon/options', hackathon.getOptions);
router.post('/hackathon/register', protect, registrationRules, handleValidation, asyncHandler(hackathon.registerForHackathon));
router.get('/hackathon/myentry', protect, asyncHandler(hackathon.getMyEntry));
router.put('/hackathon/myentry', protect, registrationRules, handleValidation, asyncHandler(hackathon.updateMyEntry));
router.delete('/hackathon/:id', protect, asyncHandler(hackathon.deleteEntry));

// Contact
router.post('/contact', contactLimiter, contactRules, handleValidation, asyncHandler(contact.sendContact));

export default router;
