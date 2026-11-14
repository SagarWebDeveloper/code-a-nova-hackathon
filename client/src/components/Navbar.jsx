import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Code2, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const navLinkClass = ({ isActive }) =>
  `text-sm transition hover:text-white ${isActive ? 'text-white' : 'text-slate-400'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    setOpen(false);
    navigate('/');
  };

  const links = (
    <>
      <a href="/#about" className="text-sm text-slate-400 transition hover:text-white" onClick={() => setOpen(false)}>
        About
      </a>
      <NavLink to="/contact" className={navLinkClass} onClick={() => setOpen(false)}>
        Contact
      </NavLink>
      {user ? (
        <>
          <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
          <button type="button" onClick={handleLogout} className="text-left text-sm text-slate-400 transition hover:text-white">
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>
            Login
          </NavLink>
          <Link to="/signup" className="btn-primary !px-4 !py-2" onClick={() => setOpen(false)}>
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
          Code-A-Nova
        </Link>

        <div className="hidden items-center gap-6 md:flex">{links}</div>

        <button
          type="button"
          className="text-white md:hidden"
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
