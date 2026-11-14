import nodemailer from 'nodemailer';
import { otpEmailTemplate, registrationEmailTemplate } from '../templates/emailTemplates.js';

const port = Number(process.env.EMAIL_PORT || 465);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port,
  secure: port === 465,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  // Keep a stuck SMTP connection from hanging requests on free hosts.
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

// Every email uses the Code-a-Nova project identity. No participant name is ever used as the sender.
const FROM = process.env.EMAIL_FROM || `"Code-a-Nova" <${process.env.EMAIL_USER}>`;
// Contact-form messages go to the project inbox, not necessarily the SMTP login.
const CONTACT_TO = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;

export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('Email transporter ready');
  } catch (err) {
    console.error('Email transporter check failed:', err.message);
  }
};

export const sendOtpEmail = (to, otp) =>
  transporter.sendMail({
    from: FROM,
    to,
    subject: 'Your Code-a-Nova verification code',
    html: otpEmailTemplate({ otp, expiryMinutes: process.env.OTP_EXPIRY_MINUTES || 10 }),
  });

export const sendRegistrationEmail = (to, registration) =>
  transporter.sendMail({
    from: FROM,
    to,
    subject: 'Code-a-Nova Hackathon Registration Confirmed',
    html: registrationEmailTemplate(registration),
  });

export const sendContactEmail = ({ name, email, message }) =>
  transporter.sendMail({
    from: FROM,
    to: CONTACT_TO,
    replyTo: email,
    subject: `Contact form message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
