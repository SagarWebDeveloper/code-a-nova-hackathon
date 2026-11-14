import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { hackathonApi, getErrorMessage } from '../services/api.js';
import Spinner from '../components/Spinner.jsx';

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-white">{value || '—'}</dd>
    </div>
  );
}

function LinkItem({ label, href }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="break-all text-brand-cyan underline">
            Open link
          </a>
        ) : (
          <span className="text-white">—</span>
        )}
      </dd>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // undefined = loading, null = not registered, object = registration
  const [entry, setEntry] = useState(undefined);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    hackathonApi
      .myEntry()
      .then(setEntry)
      .catch((err) => {
        if (err.response?.status !== 404) toast.error(getErrorMessage(err));
        setEntry(null);
      });
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('Delete your hackathon registration? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await hackathonApi.remove(entry._id);
      setEntry(null);
      toast.success('Registration deleted');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  const firstName = user.fullName.split(' ')[0];

  return (
    <section className="mx-auto max-w-5xl space-y-8 px-4 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {firstName}</h1>
          <p className="mt-1 text-slate-400">Manage your profile and hackathon registration.</p>
        </div>
        <button type="button" onClick={handleLogout} className="btn-ghost self-start sm:self-auto">
          Logout
        </button>
      </div>

      {/* Profile */}
      <div className="card grid gap-6 sm:grid-cols-3">
        <DetailItem label="Full name" value={user.fullName} />
        <DetailItem label="Email" value={user.email} />
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Verification</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Verified
          </p>
        </div>
      </div>

      {/* Registration status */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white">Hackathon registration</h2>

        {entry === undefined && (
          <div className="mt-6 space-y-3 animate-pulse" aria-label="Loading registration">
            <div className="h-4 w-1/3 rounded bg-white/10" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="h-4 w-1/2 rounded bg-white/10" />
          </div>
        )}

        {entry === null && (
          <div className="mt-6 flex flex-col items-start gap-4 rounded-xl border border-dashed border-white/15 p-8 text-slate-400">
            <ShieldAlert className="h-8 w-8 text-brand-cyan" aria-hidden="true" />
            <p>You have not registered for the hackathon yet.</p>
            <Link to="/register" className="btn-primary">Register Now</Link>
          </div>
        )}

        {entry && (
          <>
            <p className="mt-2 text-sm text-slate-400">
              Registration ID: <span className="font-mono text-white">{entry.registrationId}</span>
            </p>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              <DetailItem label="Project name" value={entry.projectName} />
              <DetailItem label="Domain / track" value={entry.domain} />
              <DetailItem label="College" value={entry.collegeName} />
              <DetailItem label="Course and branch" value={`${entry.course}, ${entry.branch}`} />
              <DetailItem label="Year of study" value={entry.yearOfStudy} />
              <DetailItem label="Team size" value={entry.teamSize} />
              <LinkItem label="PPT link" href={entry.pptLink} />
              <LinkItem label="Prototype link" href={entry.prototypeLink} />
              {entry.demoVideoLink && <LinkItem label="Demo video" href={entry.demoVideoLink} />}
            </dl>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-white">Team members</h3>
              {entry.teamMembers.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400">Solo participant.</p>
              ) : (
                <ul className="mt-3 divide-y divide-white/10 rounded-xl border border-white/10">
                  {entry.teamMembers.map((m) => (
                    <li key={m.email} className="flex flex-col gap-1 p-4 text-sm sm:flex-row sm:justify-between">
                      <span className="text-white">{m.fullName}</span>
                      <span className="text-slate-400">{m.email}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button type="button" onClick={handleDelete} disabled={deleting} className="rounded-xl border border-rose-500/40 px-5 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-60">
                {deleting && <Spinner className="mr-2 h-4 w-4" />}
                Delete registration
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
