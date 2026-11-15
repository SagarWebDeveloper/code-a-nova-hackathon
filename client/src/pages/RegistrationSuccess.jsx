import { Link, Navigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function RegistrationSuccess() {
  const { state } = useLocation();
  const registration = state?.registration;

  // Reloading the page clears router state, so send the user back to the dashboard.
  if (!registration) return <Navigate to="/dashboard" replace />;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-brand-cyan" aria-hidden="true" />
      <h1 className="mt-6 text-3xl font-bold text-white">Registration confirmed</h1>
      <p className="mt-2 text-slate-400">
        A confirmation email has been sent to <span className="text-white">{registration.email}</span>. If you do not
        see it, please check your spam folder.
      </p>

      <div className="card mt-8 text-left">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Registration ID</dt>
            <dd className="mt-1 font-mono text-white">{registration.registrationId}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Project</dt>
            <dd className="mt-1 text-white">{registration.projectName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Domain / track</dt>
            <dd className="mt-1 text-white">{registration.domain}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Team size</dt>
            <dd className="mt-1 text-white">{registration.teamSize}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
        <Link to="/" className="btn-ghost">Back to Home</Link>
      </div>
    </section>
  );
}
