import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lightbulb, Rocket, Trophy, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { EVENT } from '../utils/event.js';

const HIGHLIGHT_ICONS = [Rocket, Lightbulb, Trophy];

export default function Home() {
  const { user } = useAuth();
  const { hash } = useLocation();

  // Scroll to in-page anchors such as /#about when the hash changes.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-purple/30 blur-3xl" />
        <p className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-panel/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-cyan">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          Registrations open
        </p>
        <h1 className="relative mt-6 bg-gradient-to-r from-white via-brand-cyan to-brand-purple bg-clip-text text-4xl font-extrabold text-transparent sm:text-6xl">
          {EVENT.tagline}
        </h1>
        <p className="relative mx-auto mt-6 max-w-2xl text-slate-400">
          {EVENT.name} is a team hackathon for students who love building. Register your team, submit your project and
          show what you can ship.
        </p>
        <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to={user ? '/register' : '/signup'} className="btn-primary">
            Register Now
          </Link>
          {user ? (
            <Link to="/dashboard" className="btn-ghost">Go to Dashboard</Link>
          ) : (
            <Link to="/login" className="btn-ghost">Login</Link>
          )}
        </div>
        <dl className="relative mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Rocket className="h-4 w-4 text-brand-cyan" aria-hidden="true" /> {EVENT.mode}
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Users className="h-4 w-4 text-brand-cyan" aria-hidden="true" /> Teams of 1 to 5
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Trophy className="h-4 w-4 text-brand-cyan" aria-hidden="true" /> Prizes and certificates
          </div>
        </dl>
      </section>

      {/* Highlights */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
        {EVENT.highlights.map((highlight, index) => {
          const Icon = HIGHLIGHT_ICONS[index];
          return (
            <article key={highlight.title} className="card">
              <Icon className="h-8 w-8 text-brand-cyan" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold text-white">{highlight.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{highlight.text}</p>
            </article>
          );
        })}
      </section>

      {/* Domains */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-white">Domains and tracks</h2>
        <p className="mt-2 text-sm text-slate-400">Choose the track that best fits your project.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {EVENT.domains.map((domain) => (
            <span key={domain} className="rounded-full border border-white/10 bg-panel px-4 py-2 text-sm text-slate-200">
              {domain}
            </span>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-white">Timeline</h2>
        <ol className="mt-6 space-y-5 border-l border-white/10 pl-6">
          {EVENT.timeline.map((item) => (
            <li key={item.title} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-brand-cyan" aria-hidden="true" />
              <p className="font-semibold text-white">{item.title}</p>
              <p className="text-sm text-slate-400">{item.date}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Prizes */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-white">Prizes</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {EVENT.prizes.map((prize) => (
            <div key={prize.place} className="card text-center">
              <Trophy className="mx-auto h-7 w-7 text-brand-cyan" aria-hidden="true" />
              <p className="mt-3 text-sm text-slate-400">{prize.place}</p>
              <p className="mt-1 text-2xl font-bold text-white">{prize.amount}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">Prize amounts are per team. All participants receive certificates.</p>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
        <h2 className="text-2xl font-bold text-white">About Code-a-Nova</h2>
        <p className="mt-4 max-w-3xl text-slate-400">
          Code-a-Nova is a student hackathon platform focused on practical building. Share your project links, bring your
          team, and get a registration confirmation straight to your inbox.
        </p>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="card flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Have a question?</h2>
            <p className="mt-1 text-sm text-slate-400">
              Send us a message through the contact form and we will get back to you.
            </p>
          </div>
          <Link to="/contact" className="btn-ghost">Contact us</Link>
        </div>
      </section>
    </div>
  );
}
