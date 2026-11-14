import User from '../models/User.js';
import { asyncHandler } from '../utils/helpers.js';

// GET /api/user/me
export const getMe = (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/user/update (only the full name can change; email is fixed to the account)
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullName: req.body.fullName.trim() },
    { new: true, runValidators: true }
  );
  res.json({ success: true, message: 'Profile updated', user });
});
