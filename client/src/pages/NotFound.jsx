import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-brand-purple/20 blur-3xl" />
      <p className="relative text-sm font-semibold uppercase tracking-widest text-brand-cyan">Error 404</p>
      <h1 className="relative mt-4 bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-7xl font-extrabold text-transparent">
        Lost in the code
      </h1>
      <p className="relative mt-4 max-w-md text-slate-400">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="btn-primary relative mt-8">Back to home</Link>
    </section>
  );
}
