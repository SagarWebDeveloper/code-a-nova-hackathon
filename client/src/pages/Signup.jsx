import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { authApi, getErrorMessage } from '../services/api.js';
import { fullNameRules, emailRules, passwordRules, getPasswordStrength } from '../utils/validators.js';
import FormField from '../components/FormField.jsx';
import Spinner from '../components/Spinner.jsx';

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

export default function Signup() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' } });

  const password = watch('password');
  const strength = getPasswordStrength(password);

  // Already logged in: no need to show the signup form.
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (values) => {
    const email = values.email.trim();
    try {
      const res = await authApi.signup({
        fullName: values.fullName.trim(),
        email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      toast.success(res.message);
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-slate-400">We will email you a 6-digit code to verify your address.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
          <FormField id="fullName" label="Full name" error={errors.fullName?.message}>
            <input id="fullName" autoComplete="name" className="input" {...register('fullName', fullNameRules)} />
          </FormField>

          <FormField id="email" label="Email" error={errors.email?.message}>
            <input id="email" type="email" autoComplete="email" className="input" {...register('email', emailRules)} />
          </FormField>

          <FormField id="password" label="Password" error={errors.password?.message}>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="input pr-12"
                {...register('password', passwordRules)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="mt-2 flex gap-1" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`h-1 flex-1 rounded-full ${i < strength ? 'bg-brand-cyan' : 'bg-white/10'}`} />
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-400">{password ? STRENGTH_LABELS[strength] : 'At least 8 characters, with a letter and a number'}</p>
          </FormField>

          <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="input"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
          </FormField>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already verified? <Link to="/login" className="text-brand-cyan hover:underline">Log in</Link>
        </p>
      </div>
    </section>
  );
}
