// =====================================================
// FILE: frontend/src/hooks/useIntersectionObserver.js
// DESKRIPSI: Intersection Observer hook
// =====================================================

import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const element = elementRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options.root, options.rootMargin, options.threshold]);

  return { elementRef, entry, isIntersecting };
};

// Lazy load image hook
export const useLazyLoadImage = (options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [src, setSrc] = useState(null);
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    ...options
  });

  useEffect(() => {
    if (isIntersecting && !isLoaded && elementRef.current?.dataset.src) {
      const img = new Image();
      img.src = elementRef.current.dataset.src;
      img.onload = () => {
        setSrc(elementRef.current.dataset.src);
        setIsLoaded(true);
      };
    }
  }, [isIntersecting, isLoaded]);

  return { elementRef, src, isLoaded };
};

// Infinite scroll hook
export const useInfiniteScroll = (callback, options = {}) => {
  const [isFetching, setIsFetching] = useState(false);
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0,
    rootMargin: '100px',
    ...options
  });

  useEffect(() => {
    if (isIntersecting && !isFetching) {
      setIsFetching(true);
      
      const handleFetch = async () => {
        await callback();
        setIsFetching(false);
      };

      handleFetch();
    }
  }, [isIntersecting, isFetching, callback]);

  return { elementRef, isFetching };
};

// Visibility tracking hook
export const useVisibilityTracker = (options = {}) => {
  const [visibleTime, setVisibleTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const startTimeRef = useRef(null);
  const { elementRef, isIntersecting } = useIntersectionObserver(options);

  useEffect(() => {
    if (isIntersecting && !isVisible) {
      setIsVisible(true);
      startTimeRef.current = Date.now();
    } else if (!isIntersecting && isVisible) {
      setIsVisible(false);
      if (startTimeRef.current) {
        setVisibleTime(prev => prev + (Date.now() - startTimeRef.current));
        startTimeRef.current = null;
      }
    }
  }, [isIntersecting, isVisible]);

  return { elementRef, visibleTime, isVisible };
};