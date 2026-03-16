// =====================================================
// FILE: frontend/src/hooks/useWindowSize.js
// DESKRIPSI: Window size hook
// =====================================================

import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: window.innerWidth > 1024,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
        isDesktop: window.innerWidth > 1024,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Window dimension hooks
export const useWindowWidth = () => {
  const { width } = useWindowSize();
  return width;
};

export const useWindowHeight = () => {
  const { height } = useWindowSize();
  return height;
};

export const useWindowOrientation = () => {
  const { orientation } = useWindowSize();
  return orientation;
};

// Viewport unit hooks
export const useVW = (value) => {
  const { width } = useWindowSize();
  return (width * value) / 100;
};

export const useVH = (value) => {
  const { height } = useWindowSize();
  return (height * value) / 100;
};

export const useVMin = (value) => {
  const { width, height } = useWindowSize();
  const min = Math.min(width, height);
  return (min * value) / 100;
};

export const useVMax = (value) => {
  const { width, height } = useWindowSize();
  const max = Math.max(width, height);
  return (max * value) / 100;
};

// Responsive number hook
export const useResponsiveNumber = (mobile, tablet, desktop) => {
  const { isMobile, isTablet } = useWindowSize();

  if (isMobile) return mobile;
  if (isTablet) return tablet;
  return desktop;
};

// Element size hook
export const useElementSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      
      const entry = entries[0];
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      });
    });

    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [ref]);

  return size;
};