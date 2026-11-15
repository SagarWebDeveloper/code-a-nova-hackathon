import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/SagarWebDeveloper' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sagar-web-dev/' },
  { label: 'Portfolio', href: 'https://sagartry.netlify.app/' },
];

export default function Footer() {
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;

  return (
    <footer className="border-t border-white/10 px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <p className="font-bold text-white">Code-A-Nova</p>
          <p className="mt-2 text-sm text-slate-400">Build. Innovate. Compete.</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm text-slate-400" aria-label="Footer navigation">
          <Link to="/" className="hover:text-white">Home</Link>
          <a href="/#about" className="hover:text-white">About</a>
          <Link to="/contact" className="hover:text-white">Contact</Link>
        </nav>
        <div className="text-sm text-slate-400">
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="hover:text-white">
              {contactEmail}
            </a>
          )}
          <div className="mt-4 flex gap-4">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Code-A-Nova. All rights reserved. Built by{' '}
        <a
          href="https://github.com/SagarWebDeveloper"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white"
        >
          Sagar Rathor
        </a>
        .
      </p>
    </footer>
  );
}
