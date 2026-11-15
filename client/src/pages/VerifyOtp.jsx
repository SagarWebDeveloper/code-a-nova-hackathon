import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi, getErrorMessage } from '../services/api.js';
import useCountdown from '../hooks/useCountdown.js';
import Spinner from '../components/Spinner.jsx';

const LENGTH = 6;

export default function VerifyOtp() {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const navigate = useNavigate();

  const [digits, setDigits] = useState(Array(LENGTH).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);
  const { seconds, start, running } = useCountdown(30);
  const otp = digits.join('');

  // Missing email in the URL: send the user back to signup.
  useEffect(() => {
    if (!email) navigate('/signup', { replace: true });
  }, [email, navigate]);

  // A code was just sent during signup, so start the resend cooldown and focus the first box.
  useEffect(() => {
    start();
    inputs.current[0]?.focus();
  }, [start]);

  const setDigitAt = (index, value) =>
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

  // Fills several boxes from a starting index (used for paste).
  const fillFrom = (startIndex, text) => {
    setDigits((prev) => {
      const next = [...prev];
      text.split('').forEach((char, k) => {
        if (startIndex + k < LENGTH) next[startIndex + k] = char;
      });
      return next;
    });
    inputs.current[Math.min(startIndex + text.length, LENGTH - 1)]?.focus();
  };

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/g, '').slice(-1);
    setDigitAt(index, value);
    if (value && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handlePaste = (index, e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (text) fillFrom(index, text);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== LENGTH) return toast.error('Enter all 6 digits');
    setSubmitting(true);
    try {
      const res = await authApi.verifyOtp({ email, otp });
      toast.success(res.message);
      navigate('/login', { replace: true, state: { verified: true } });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDigits(Array(LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await authApi.resendOtp({ email });
      toast.success(res.message);
      setDigits(Array(LENGTH).fill(''));
      inputs.current[0]?.focus();
      start();
    } catch (err) {
      const retry = err.response?.data?.retryAfterSeconds;
      if (retry) start(retry);
      toast.error(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="card text-center">
        <h1 className="text-2xl font-bold text-white">Verify your email</h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter the 6-digit code sent to <span className="text-white">{email}</span>. It expires in 10 minutes.
        </p>

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          <fieldset className="flex justify-center gap-2 sm:gap-3">
            <legend className="sr-only">One-time verification code</legend>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                aria-label={`Digit ${i + 1}`}
                value={digit}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={(e) => handlePaste(i, e)}
                className="h-14 w-11 rounded-xl border border-white/10 bg-panel text-center text-xl font-semibold text-white focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-purple/50 sm:w-14"
              />
            ))}
          </fieldset>

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting && <Spinner />}
            Verify code
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-400">
          Didn&apos;t get it?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={running || resending}
            className="font-semibold text-brand-cyan hover:underline disabled:cursor-not-allowed disabled:text-slate-500 disabled:no-underline"
          >
            {resending ? 'Sending...' : running ? `Resend in ${seconds}s` : 'Resend code'}
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Wrong address? <Link to="/signup" className="underline">Sign up again</Link>
          {' · '}
          <Link to="/login" className="underline">Back to login</Link>
        </p>
      </div>
    </section>
  );
}
