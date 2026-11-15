import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to the top on route changes, except when the URL targets an in-page anchor.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}
