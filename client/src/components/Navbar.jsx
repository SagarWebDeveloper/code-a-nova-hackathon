import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const navLinkClass = ({ isActive }) =>
  `text-sm transition hover:text-white ${isActive ? 'font-semibold text-white' : 'text-slate-400'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  const links = (
    <>
      <NavLink to="/" end className={navLinkClass}>
        Home
      </NavLink>
      <Link to="/#about" className="text-sm text-slate-400 transition hover:text-white">
        About
      </Link>
      <NavLink to="/contact" className={navLinkClass}>
        Contact
      </NavLink>
      {user ? (
        <>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <button type="button" onClick={handleLogout} className="text-left text-sm text-slate-400 transition hover:text-white">
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={navLinkClass}>
            Login
          </NavLink>
          <Link to="/signup" className="btn-primary !px-4 !py-2">
            Signup
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2 font-bold text-white">
          <Code2 className="h-6 w-6 text-brand-cyan" aria-hidden="true" />
          Code-a-Nova
        </Link>

        <div className="hidden items-center gap-6 md:flex">{links}</div>

        <button
          type="button"
          className="rounded-lg p-2 text-white transition hover:bg-white/5 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 md:hidden">{links}</div>
      )}
    </header>
  );
}
