import { body, validationResult } from 'express-validator';
import {
  COLLEGES,
  COURSES,
  BRANCHES,
  YEARS_OF_STUDY,
  DOMAINS,
  TEAM_SIZE_MIN,
  TEAM_SIZE_MAX,
} from '../utils/constants.js';

const NAME_RULE = /^[A-Za-z ]+$/;
const MOBILE_RULE = /^[6-9]\d{9}$/;
const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_OPTIONS = { protocols: ['http', 'https'], require_protocol: true };

// Turns express-validator errors into the API error shape.
export const handleValidation = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return res.status(400).json({ success: false, message: errors[0].message, errors });
};

const passwordChecks = [
  body('password')
    .isString().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Za-z]/).withMessage('Password must contain a letter')
    .matches(/\d/).withMessage('Password must contain a number'),
];

export const signupRules = [
  body('fullName').trim()
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters')
    .matches(NAME_RULE).withMessage('Full name can contain only letters and spaces'),
  body('email').trim().isEmail().withMessage('Enter a valid email address'),
  ...passwordChecks,
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

export const loginRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email address'),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

export const otpRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email address'),
  body('otp').isString().matches(/^\d{6}$/).withMessage('Enter the 6-digit code'),
];

export const emailRules = [body('email').trim().isEmail().withMessage('Enter a valid email address')];

export const profileRules = [
  body('fullName').trim()
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters')
    .matches(NAME_RULE).withMessage('Full name can contain only letters and spaces'),
];

// Team members: count must equal teamSize - 1, names and emails valid, no duplicates,
// and the registrant cannot be added again. Runs after protect(), so req.user is set.
function validateTeamMembers(members, { req }) {
  const teamSize = Number(req.body.teamSize);
  const expected = teamSize - 1;
  if (members.length !== expected) {
    throw new Error(`A team of ${teamSize} needs exactly ${expected} additional member(s)`);
  }
  const seen = new Set();
  for (const member of members) {
    const name = String(member?.fullName ?? '').trim();
    const email = String(member?.email ?? '').trim().toLowerCase();
    if (name.length < 3 || !NAME_RULE.test(name)) {
      throw new Error('Each team member needs a valid name (at least 3 letters)');
    }
    if (!EMAIL_RULE.test(email)) throw new Error('Each team member needs a valid email');
    if (email === req.user.email) throw new Error('You cannot add yourself as a team member');
    if (seen.has(email)) throw new Error('Team member emails must be unique');
    seen.add(email);
  }
  return true;
}

export const registrationRules = [
  body('fullName').trim()
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters')
    .matches(NAME_RULE).withMessage('Full name can contain only letters and spaces'),
  body('mobileNumber').trim().matches(MOBILE_RULE).withMessage('Enter a valid 10-digit Indian mobile number'),
  body('collegeName').isIn(COLLEGES).withMessage('Select a valid college'),
  body('course').isIn(COURSES).withMessage('Select a valid course'),
  body('branch').isIn(BRANCHES).withMessage('Select a valid branch'),
  body('yearOfStudy').isIn(YEARS_OF_STUDY).withMessage('Select a valid year of study'),
  body('domain').isIn(DOMAINS).withMessage('Select a valid domain'),
  body('projectName').trim().isLength({ min: 5 }).withMessage('Project name must be at least 5 characters'),
  body('pptLink').trim().isURL(URL_OPTIONS).withMessage('Enter a valid PPT link (http or https)'),
  body('prototypeLink').trim().isURL(URL_OPTIONS).withMessage('Enter a valid prototype link (http or https)'),
  body('demoVideoLink')
    .optional({ values: 'falsy' })
    .trim()
    .isURL(URL_OPTIONS)
    .withMessage('Enter a valid demo video link (http or https)'),
  body('teamSize')
    .isInt({ min: TEAM_SIZE_MIN, max: TEAM_SIZE_MAX })
    .withMessage(`Team size must be between ${TEAM_SIZE_MIN} and ${TEAM_SIZE_MAX}`)
    .toInt(),
  body('teamMembers').isArray({ max: TEAM_SIZE_MAX - 1 }).withMessage('Team members must be a list').bail()
    .custom(validateTeamMembers),
];

export const contactRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2 to 80 characters'),
  body('email').trim().isEmail().withMessage('Enter a valid email address'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10 to 2000 characters'),
];
