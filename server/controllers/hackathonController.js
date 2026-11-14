import mongoose from 'mongoose';
import HackathonRegistration from '../models/HackathonRegistration.js';
import { sendRegistrationEmail } from '../services/emailService.js';
import { AppError, asyncHandler, generateRegistrationId } from '../utils/helpers.js';
import {
  COLLEGES,
  COURSES,
  BRANCHES,
  YEARS_OF_STUDY,
  DOMAINS,
  TEAM_SIZE_MIN,
  TEAM_SIZE_MAX,
} from '../utils/constants.js';

// Keeps only the registration fields and normalises them. The email always comes from the account.
const buildRegistrationFields = (body) => ({
  fullName: body.fullName.trim(),
  mobileNumber: body.mobileNumber.trim(),
  collegeName: body.collegeName,
  course: body.course,
  branch: body.branch,
  yearOfStudy: body.yearOfStudy,
  domain: body.domain,
  projectName: body.projectName.trim(),
  pptLink: body.pptLink.trim(),
  prototypeLink: body.prototypeLink.trim(),
  demoVideoLink: body.demoVideoLink ? body.demoVideoLink.trim() : '',
  teamSize: body.teamSize,
  teamMembers: body.teamMembers.map((m) => ({
    fullName: m.fullName.trim(),
    email: m.email.trim().toLowerCase(),
  })),
});

// GET /api/hackathon/options (public)
export const getOptions = (req, res) => {
  res.json({
    success: true,
    data: { COLLEGES, COURSES, BRANCHES, YEARS_OF_STUDY, DOMAINS, TEAM_SIZE_MIN, TEAM_SIZE_MAX },
  });
};

// POST /api/hackathon/register
export const registerForHackathon = asyncHandler(async (req, res) => {
  const alreadyRegistered = await HackathonRegistration.exists({ userId: req.user._id });
  if (alreadyRegistered) throw new AppError('You have already registered for the hackathon.', 409);

  const registration = await HackathonRegistration.create({
    ...buildRegistrationFields(req.body),
    userId: req.user._id,
    registrationId: generateRegistrationId(),
    email: req.user.email,
  });

  // Email failure should not fail the registration itself.
  sendRegistrationEmail(registration.email, registration).catch((err) =>
    console.error('Registration email failed:', err.message)
  );

  res.status(201).json({ success: true, message: 'Registration successful', data: registration });
});

// GET /api/hackathon/myentry
export const getMyEntry = asyncHandler(async (req, res) => {
  const entry = await HackathonRegistration.findOne({ userId: req.user._id });
  if (!entry) throw new AppError('No registration found', 404);
  res.json({ success: true, data: entry });
});

// PUT /api/hackathon/myentry
export const updateMyEntry = asyncHandler(async (req, res) => {
  const entry = await HackathonRegistration.findOne({ userId: req.user._id });
  if (!entry) throw new AppError('No registration found', 404);

  Object.assign(entry, buildRegistrationFields(req.body));
  await entry.save();
  res.json({ success: true, message: 'Registration updated', data: entry });
});

// DELETE /api/hackathon/:id (owner only)
export const deleteEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new AppError('Registration not found', 404);

  // Filtering by userId as well means users can never delete someone else's entry.
  const result = await HackathonRegistration.deleteOne({ _id: id, userId: req.user._id });
  if (!result.deletedCount) throw new AppError('Registration not found', 404);

  res.json({ success: true, message: 'Registration deleted' });
});
