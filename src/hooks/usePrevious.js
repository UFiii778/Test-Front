// =====================================================
// FILE: frontend/src/hooks/usePrevious.js
// DESKRIPSI: Previous value hook
// =====================================================

import { useRef, useEffect } from 'react';

export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// Previous state hook (with setter)
export const usePreviousState = (initialValue) => {
  const [current, setCurrent] = useState(initialValue);
  const previous = usePrevious(current);

  return [current, setCurrent, previous];
};

// Previous and current value hook
export const usePreviousAndCurrent = (value) => {
  const previous = usePrevious(value);
  return { previous, current: value };
};

// Change detection hook
export const useDidChange = (value) => {
  const previous = usePrevious(value);
  return previous !== value;
};

// Increased/decreased detection hook
export const useIncreaseDecrease = (value) => {
  const previous = usePrevious(value);
  
  if (previous === undefined) return 'initial';
  if (value > previous) return 'increased';
  if (value < previous) return 'decreased';
  return 'unchanged';
};

// First render detection hook
export const useIsFirstRender = () => {
  const isFirst = useRef(true);

  useEffect(() => {
    isFirst.current = false;
  }, []);

  return isFirst.current;
};

// Mounted state hook
export const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

// Update count hook
export const useUpdateCount = () => {
  const count = useRef(0);

  useEffect(() => {
    count.current++;
  });

  return count.current;
};