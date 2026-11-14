// Shared validation rules. Used by react-hook-form on the client; the server re-validates everything.
export const NAME_REGEX = /^[A-Za-z ]+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MOBILE_REGEX = /^[6-9]\d{9}$/;
export const URL_REGEX = /^https?:\/\/[^\s]+$/i;

export const fullNameRules = {
  required: 'Full name is required',
  minLength: { value: 3, message: 'Full name must be at least 3 characters' },
  pattern: { value: NAME_REGEX, message: 'Letters and spaces only' },
};

export const emailRules = {
  required: 'Email is required',
  pattern: { value: EMAIL_REGEX, message: 'Enter a valid email address' },
};

export const passwordRules = {
  required: 'Password is required',
  minLength: { value: 8, message: 'At least 8 characters' },
  validate: {
    letter: (v) => /[A-Za-z]/.test(v) || 'Include at least one letter',
    number: (v) => /\d/.test(v) || 'Include at least one number',
  },
};

export const mobileRules = {
  required: 'Mobile number is required',
  pattern: { value: MOBILE_REGEX, message: 'Enter a valid 10-digit number starting with 6-9' },
};

export const urlRules = (label) => ({
  required: `${label} is required`,
  pattern: { value: URL_REGEX, message: 'Enter a valid http or https link' },
});

// Returns the first error message for the team member list, or null if it is valid.
export const validateTeamMembers = (members, ownEmail) => {
  const seen = new Set();
  for (const member of members) {
    const name = (member.fullName || '').trim();
    const email = (member.email || '').trim().toLowerCase();
    if (name.length < 3 || !NAME_REGEX.test(name)) return 'Each team member needs a name (at least 3 letters)';
    if (!EMAIL_REGEX.test(email)) return 'Enter a valid email for each team member';
    if (email === ownEmail.toLowerCase()) return 'You cannot add yourself as a team member';
    if (seen.has(email)) return 'Team member emails must be unique';
    seen.add(email);
  }
  return null;
};

// 0 to 4 score used by the password strength bar.
export const getPasswordStrength = (pw = '') => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
