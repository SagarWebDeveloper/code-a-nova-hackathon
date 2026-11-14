// Unit tests for the shared helpers. Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { AppError, generateOtp, generateRegistrationId } from '../utils/helpers.js';

test('OTP is always 6 digits', () => {
  for (let i = 0; i < 200; i += 1) {
    assert.match(generateOtp(), /^\d{6}$/);
  }
});

test('registration ID matches CNH-YYYYMMDD-XXXXXX', () => {
  assert.match(generateRegistrationId(), /^CNH-\d{8}-[A-Z2-9]{6}$/);
});

test('AppError carries the HTTP status code', () => {
  const err = new AppError('Not found', 404);
  assert.equal(err.message, 'Not found');
  assert.equal(err.statusCode, 404);
});
