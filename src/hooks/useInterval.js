// =====================================================
// FILE: frontend/src/hooks/useInterval.js
// DESKRIPSI: Interval hook
// =====================================================

import { useEffect, useRef } from 'react';

export const useInterval = (callback, delay, enabled = true) => {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (!enabled || delay === null) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay, enabled]);
};

// Polling hook
export const usePolling = (callback, interval = 5000, enabled = true) => {
  const [isPolling, setIsPolling] = useState(enabled);

  useInterval(() => {
    if (isPolling) {
      callback();
    }
  }, interval, isPolling);

  const start = useCallback(() => setIsPolling(true), []);
  const stop = useCallback(() => setIsPolling(false), []);
  const toggle = useCallback(() => setIsPolling(prev => !prev), []);

  return { isPolling, start, stop, toggle };
};

// Countdown timer with interval
export const useTimer = (initialSeconds, onComplete) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(() => {
    if (seconds > 0) {
      setSeconds(prev => prev - 1);
    } else {
      setIsRunning(false);
      onComplete?.();
    }
  }, 1000, isRunning && seconds > 0);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);
  const restart = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  return { seconds, isRunning, start, pause, reset, restart };
};

// Animation frame hook
export const useAnimationFrame = (callback, enabled = true) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [enabled, animate]);
};

// Debounced interval hook
export const useDebouncedInterval = (callback, delay, deps = []) => {
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...deps, callback, delay]);
};