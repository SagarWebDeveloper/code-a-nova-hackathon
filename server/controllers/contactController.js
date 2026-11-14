import { sendContactEmail } from '../services/emailService.js';
import { AppError, asyncHandler } from '../utils/helpers.js';

// POST /api/contact (public)
export const sendContact = asyncHandler(async (req, res) => {
  try {
    await sendContactEmail({
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      message: req.body.message.trim(),
    });
  } catch (err) {
    console.error('Contact email failed:', err.message);
    throw new AppError('Could not send your message right now. Please try again later.', 503);
  }
  res.json({ success: true, message: 'Thanks! Your message has been sent.' });
});
