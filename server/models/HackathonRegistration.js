import mongoose from 'mongoose';
import {
  COURSES,
  BRANCHES,
  YEARS_OF_STUDY,
  DOMAINS,
  TEAM_SIZE_MIN,
  TEAM_SIZE_MAX,
} from '../utils/constants.js';

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    // One registration per user, enforced by the unique index.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    registrationId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobileNumber: { type: String, required: true, match: /^[6-9]\d{9}$/ },
    collegeName: { type: String, required: true },
    course: { type: String, enum: COURSES, required: true },
    branch: { type: String, enum: BRANCHES, required: true },
    yearOfStudy: { type: String, enum: YEARS_OF_STUDY, required: true },
    domain: { type: String, enum: DOMAINS, required: true },
    projectName: { type: String, required: true, trim: true, minlength: 5 },
    pptLink: { type: String, required: true },
    prototypeLink: { type: String, required: true },
    demoVideoLink: { type: String, default: '' },
    teamSize: { type: Number, required: true, min: TEAM_SIZE_MIN, max: TEAM_SIZE_MAX },
    teamMembers: { type: [memberSchema], default: [] },
  },
  { timestamps: true }
);

// A team of N has exactly N - 1 additional members.
registrationSchema.pre('validate', function checkTeamMembers(next) {
  if (this.teamMembers.length !== this.teamSize - 1) {
    this.invalidate(
      'teamMembers',
      `A team of ${this.teamSize} needs ${this.teamSize - 1} additional member(s)`
    );
  }
  next();
});

export default mongoose.model('HackathonRegistration', registrationSchema);
