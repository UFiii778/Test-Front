// =====================================================
// FILE: frontend/src/hooks/useMediaQuery.js
// DESKRIPSI: Media query hook
// =====================================================

import { useState, useEffect, useCallback } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (e) => setMatches(e.matches);
    
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Predefined media queries
export const useIsMobile = () => {
  return useMediaQuery('(max-width: 640px)');
};

export const useIsTablet = () => {
  return useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
};

export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 1025px)');
};

export const useIsLargeDesktop = () => {
  return useMediaQuery('(min-width: 1440px)');
};

export const useIsPortrait = () => {
  return useMediaQuery('(orientation: portrait)');
};

export const useIsLandscape = () => {
  return useMediaQuery('(orientation: landscape)');
};

export const usePrefersDarkMode = () => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};

export const usePrefersLightMode = () => {
  return useMediaQuery('(prefers-color-scheme: light)');
};

export const usePrefersReducedMotion = () => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

export const usePrefersHighContrast = () => {
  return useMediaQuery('(prefers-contrast: high)');
};

// Responsive value hook
export const useResponsiveValue = (values) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  if (isMobile && values.mobile !== undefined) return values.mobile;
  if (isTablet && values.tablet !== undefined) return values.tablet;
  if (isDesktop && values.desktop !== undefined) return values.desktop;
  
  return values.default || null;
};

// Breakpoint hook
export const useBreakpoint = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isLargeDesktop = useIsLargeDesktop();

  if (isLargeDesktop) return 'lg';
  if (isDesktop) return 'md';
  if (isTablet) return 'sm';
  if (isMobile) return 'xs';
  
  return 'xs';
};

// Responsive style hook
export const useResponsiveStyle = (baseStyle, mobileStyle, tabletStyle, desktopStyle) => {
  const breakpoint = useBreakpoint();

  const styles = {
    xs: { ...baseStyle, ...mobileStyle },
    sm: { ...baseStyle, ...tabletStyle },
    md: { ...baseStyle, ...desktopStyle },
    lg: { ...baseStyle, ...desktopStyle }
  };

  return styles[breakpoint] || baseStyle;
};