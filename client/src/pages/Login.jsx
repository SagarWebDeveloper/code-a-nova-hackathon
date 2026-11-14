import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';
import { emailRules } from '../utils/validators.js';
import FormField from '../components/FormField.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const redirectTo = location.state?.from || '/dashboard';

  // Shown after the user verifies their email.
  useEffect(() => {
    if (location.state?.verified) toast.success('Email verified. Please log in.');
  }, [location.state]);

  const onSubmit = async (values) => {
    try {
      await login(values.email.trim(), values.password);
      toast.success('Welcome back!');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      // Unverified account: send the user to the OTP page with their email filled in.
      if (data?.requiresVerification) {
        toast('Please verify your email first.');
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold text-white">Log in</h1>
        <p className="mt-1 text-sm text-slate-400">Access your dashboard and registration.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
          <FormField id="email" label="Email" error={errors.email?.message}>
            <input id="email" type="email" autoComplete="email" className="input" {...register('email', emailRules)} />
          </FormField>

          <FormField id="password" label="Password" error={errors.password?.message}>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="input pr-12"
                {...register('password', { required: 'Password is required' })}
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
          </FormField>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New here? <Link to="/signup" className="text-brand-cyan hover:underline">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
