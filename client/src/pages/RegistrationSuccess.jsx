import { Link, Navigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function RegistrationSuccess() {
  const { state } = useLocation();
  const reg = state?.registration;

  // Reloading the page clears router state, so send the user back to the dashboard.
  if (!reg) return <Navigate to="/dashboard" replace />;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-brand-cyan" aria-hidden="true" />
      <h1 className="mt-6 text-3xl font-bold text-white">Registration confirmed</h1>
      <p className="mt-2 text-slate-400">
        A confirmation email has been sent to <span className="text-white">{reg.email}</span>.
      </p>

      <div className="card mt-8 text-left">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Registration ID</dt>
            <dd className="mt-1 font-mono text-white">{reg.registrationId}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Project</dt>
            <dd className="mt-1 text-white">{reg.projectName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Domain / track</dt>
            <dd className="mt-1 text-white">{reg.domain}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Team size</dt>
            <dd className="mt-1 text-white">{reg.teamSize}</dd>
          </div>
        </dl>
      </div>

      <Link to="/dashboard" className="btn-primary mt-8">Go to Dashboard</Link>
    </section>
  );
}
