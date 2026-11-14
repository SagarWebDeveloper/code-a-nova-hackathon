import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
const contactEmailNote = 'Send us a message through the contact form and we will get back to you.';

// EDIT THESE PLACEHOLDERS once official details are confirmed. Dates, prizes and venue are not final.
const TIMELINE = [
  { title: 'Registration opens', date: 'TBA' },
  { title: 'Registration closes', date: 'TBA' },
  { title: 'Hackathon kick-off', date: 'TBA' },
  { title: 'Final submission', date: 'TBA' },
  { title: 'Results and awards', date: 'TBA' },
];

const PRIZES = [
  { place: '1st Place', amount: 'TBA' },
  { place: '2nd Place', amount: 'TBA' },
  { place: '3rd Place', amount: 'TBA' },
];

const DOMAINS = ['AI/ML', 'Web Development', 'IoT', 'Cyber Security', 'Blockchain', 'Other'];

const HIGHLIGHTS = [
  { title: 'Build', text: 'Turn your idea into a working prototype in a team of up to five.' },
  { title: 'Innovate', text: 'Solve real problems with the domain or track that excites you.' },
  { title: 'Compete', text: 'Present to judges and compete for the prize pool.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-purple/30 blur-3xl" />
        <p className="relative text-sm font-semibold uppercase tracking-widest text-brand-cyan">Code-A-Nova Hackathon</p>
        <h1 className="relative mt-4 bg-gradient-to-r from-white via-brand-cyan to-brand-purple bg-clip-text text-4xl font-extrabold text-transparent sm:text-6xl">
          Build. Innovate. Compete.
        </h1>
        <p className="relative mx-auto mt-6 max-w-2xl text-slate-400">
          A team hackathon for students who love building. Register your team, submit your project and show what you can ship.
        </p>
        <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {user ? (
            <Link to="/register" className="btn-primary">Register Now</Link>
          ) : (
            <Link to="/signup" className="btn-primary">Register Now</Link>
          )}
          <Link to="/login" className="btn-ghost">Login</Link>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
        {HIGHLIGHTS.map((h) => (
          <article key={h.title} className="card">
            <h2 className="text-xl font-semibold text-white">{h.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{h.text}</p>
          </article>
        ))}
      </section>

      {/* Domains */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-white">Domains and tracks</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {DOMAINS.map((d) => (
            <span key={d} className="rounded-full border border-white/10 bg-panel px-4 py-2 text-sm text-slate-200">
              {d}
            </span>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-white">Timeline</h2>
        <ol className="mt-6 space-y-4 border-l border-white/10 pl-6">
          {TIMELINE.map((t) => (
            <li key={t.title} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-brand-cyan" aria-hidden="true" />
              <p className="font-semibold text-white">{t.title}</p>
              <p className="text-sm text-slate-400">{t.date}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Prizes */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-white">Prizes</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {PRIZES.map((p) => (
            <div key={p.place} className="card text-center">
              <p className="text-sm text-slate-400">{p.place}</p>
              <p className="mt-2 text-2xl font-bold text-white">{p.amount}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
        <h2 className="text-2xl font-bold text-white">About Code-A-Nova</h2>
        <p className="mt-4 max-w-3xl text-slate-400">
          Code-A-Nova is a student hackathon platform focused on practical building. Share your project links, bring your
          team, and get a registration confirmation straight to your inbox.
        </p>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="card flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Have a question?</h2>
            <p className="mt-1 text-sm text-slate-400">{contactEmailNote}</p>
          </div>
          <Link to="/contact" className="btn-ghost">Contact us</Link>
        </div>
      </section>
    </div>
  );
}
