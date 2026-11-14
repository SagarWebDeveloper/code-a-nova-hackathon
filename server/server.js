import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { verifyTransporter } from './services/emailService.js';

// Fail fast if a required secret is missing.
const required = ['MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Check SMTP in the background so a slow/blocked mail host cannot delay startup.
  verifyTransporter();
});
