import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { CONTACT_EMAIL, EVENT } from '../utils/event.js';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/SagarWebDeveloper' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sagar-web-dev/' },
  { label: 'Portfolio', href: 'https://sagartry.netlify.app/' },
];

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="border-t border-white/10 px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <p className="font-bold text-white">Code-a-Nova</p>
          <p className="mt-2 text-sm text-slate-400">{EVENT.tagline}</p>
          <p className="mt-1 text-sm text-slate-500">{EVENT.mode} student hackathon</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm text-slate-400" aria-label="Footer navigation">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/#about" className="hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          {user ? (
            <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
          ) : (
            <Link to="/signup" className="hover:text-white">Register</Link>
          )}
        </nav>

        <div className="text-sm text-slate-400">
          <p className="text-slate-500">Contact</p>
          {CONTACT_EMAIL ? (
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block hover:text-white">
              {CONTACT_EMAIL}
            </a>
          ) : (
            <Link to="/contact" className="mt-1 block hover:text-white">
              Use the contact form
            </Link>
          )}
          <div className="mt-4 flex gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Code-a-Nova. All rights reserved. Built by{' '}
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
