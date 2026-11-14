import { Link, Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
];

// Shared shell: navbar, page content, footer.
export default function Layout() {
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
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
                <a key={s.label} href={s.href} aria-label={s.label} className="hover:text-white">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Code-A-Nova. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
