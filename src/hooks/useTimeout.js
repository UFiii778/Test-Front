// =====================================================
// FILE: frontend/src/hooks/useTimeout.js
// DESKRIPSI: Timeout hook
// =====================================================

import { useEffect, useRef, useCallback } from 'react';

export const useTimeout = (callback, delay, enabled = true) => {
  const savedCallback = useRef(callback);
  const timeoutRef = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout
  useEffect(() => {
    if (!enabled || delay === null) return;

    timeoutRef.current = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, enabled]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      savedCallback.current();
    }, delay);
  }, [delay]);

  return { clear, reset };
};

// Debounce hook using timeout
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef();

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Throttle hook using timeout
export const useThrottle = (callback, delay) => {
  const timeoutRef = useRef();
  const lastRan = useRef(Date.now());

  const throttledCallback = useCallback((...args) => {
    const now = Date.now();

    if (now - lastRan.current >= delay) {
      callback(...args);
      lastRan.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRan.current = Date.now();
      }, delay - (now - lastRan.current));
    }
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

// Delay hook (async sleep)
export const useDelay = () => {
  const delay = useCallback((ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }, []);

  return delay;
};

// Timeout with retry
export const useRetry = (callback, maxAttempts = 3, delay = 1000) => {
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const result = await callback(...args);
        setIsLoading(false);
        setAttempts(0);
        return result;
      } catch (error) {
        setAttempts(i + 1);
        if (i === maxAttempts - 1) {
          setIsLoading(false);
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }, [callback, maxAttempts, delay]);

  return { execute, attempts, isLoading };
};