import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  // FIX: The `useRef` hook was called without an initial value but with a non-nullable generic type.
  // This is invalid. Initializing with `null` and making the type nullable fixes the issue.
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
}
