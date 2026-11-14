import { useCallback, useEffect, useState } from 'react';

// Simple seconds countdown. Call start() to begin (optionally with a custom duration).
export default function useCountdown(defaultSeconds = 30) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const start = useCallback((duration = defaultSeconds) => setSeconds(duration), [defaultSeconds]);

  return { seconds, start, running: seconds > 0 };
}
