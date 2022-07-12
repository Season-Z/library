import { useCallback, useRef } from 'react';

type Fn = (...args: any) => any;

function useDebounceFn<T extends Fn>(fn: T, ms = 1000) {
  const fnRef = useRef<T>(fn);
  const timer = useRef<NodeJS.Timeout | null>(null);

  fnRef.current = fn;

  const debounceFn = (...args: any[]) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      fnRef.current(...args);
    }, ms);
  };

  return debounceFn;
}

export default useDebounceFn;
