// =====================================================
// FILE: frontend/src/hooks/useCounter.js
// DESKRIPSI: Counter hook
// =====================================================

import { useState, useCallback } from 'react';

export const useCounter = (initialValue = 0, options = {}) => {
  const { min, max, step = 1 } = options;
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => {
      const newValue = prev + step;
      if (max !== undefined && newValue > max) return prev;
      return newValue;
    });
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount(prev => {
      const newValue = prev - step;
      if (min !== undefined && newValue < min) return prev;
      return newValue;
    });
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback((value) => {
    let newValue = value;
    if (min !== undefined && newValue < min) newValue = min;
    if (max !== undefined && newValue > max) newValue = max;
    setCount(newValue);
  }, [min, max]);

  return [count, { increment, decrement, reset, set }];
};

// Counter with history
export const useCounterWithHistory = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  const [history, setHistory] = useState([initialValue]);

  const increment = useCallback((step = 1) => {
    setCount(prev => {
      const newValue = prev + step;
      setHistory(prevHistory => [...prevHistory, newValue]);
      return newValue;
    });
  }, []);

  const decrement = useCallback((step = 1) => {
    setCount(prev => {
      const newValue = prev - step;
      setHistory(prevHistory => [...prevHistory, newValue]);
      return newValue;
    });
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
    setHistory([initialValue]);
  }, [initialValue]);

  const undo = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCount(newHistory[newHistory.length - 1]);
    }
  }, [history]);

  const redo = useCallback(() => {
    // Implement redo if needed
  }, []);

  return { count, history, increment, decrement, reset, undo };
};

// Countdown timer hook
export const useCountdown = (initialSeconds, options = {}) => {
  const { autoStart = false, onComplete } = options;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      setIsComplete(true);
      onComplete?.();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onComplete]);

  const start = useCallback(() => {
    setIsActive(true);
    setIsComplete(false);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setSeconds(initialSeconds);
    setIsComplete(false);
  }, [initialSeconds]);

  const restart = useCallback(() => {
    setSeconds(initialSeconds);
    setIsActive(true);
    setIsComplete(false);
  }, [initialSeconds]);

  return {
    seconds,
    isActive,
    isComplete,
    start,
    pause,
    reset,
    restart
  };
};

// Progress counter hook
export const useProgress = (total, initial = 0) => {
  const [completed, setCompleted] = useState(initial);

  const increment = useCallback((step = 1) => {
    setCompleted(prev => Math.min(prev + step, total));
  }, [total]);

  const decrement = useCallback((step = 1) => {
    setCompleted(prev => Math.max(prev - step, 0));
  }, []);

  const reset = useCallback(() => {
    setCompleted(0);
  }, []);

  const complete = useCallback(() => {
    setCompleted(total);
  }, [total]);

  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return {
    completed,
    total,
    percentage,
    increment,
    decrement,
    reset,
    complete
  };
};