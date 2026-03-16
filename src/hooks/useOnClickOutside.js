// =====================================================
// FILE: frontend/src/hooks/useOnClickOutside.js
// DESKRIPSI: Click outside hook
// =====================================================

import { useEffect, useRef } from 'react';

export const useOnClickOutside = (ref, handler, enabled = true) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handlerRef.current(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, enabled]);
};

// Multiple refs version
export const useOnClickOutsideMultiple = (refs, handler, enabled = true) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event) => {
      // Check if click is inside any of the refs
      const isInside = refs.some(ref => 
        ref.current && ref.current.contains(event.target)
      );

      if (isInside) return;

      handlerRef.current(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs, enabled]);
};

// Escape key hook
export const useOnEscape = (handler, enabled = true) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event) => {
      if (event.key === 'Escape') {
        handlerRef.current(event);
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [enabled]);
};

// Combined hook
export const useClickOutsideAndEscape = (ref, handler, enabled = true) => {
  useOnClickOutside(ref, handler, enabled);
  useOnEscape(handler, enabled);
};