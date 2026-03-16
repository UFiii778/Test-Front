// =====================================================
// FILE: frontend/src/hooks/useTheme.js
// DESKRIPSI: Theme hook
// =====================================================

import { useContext, useMemo } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Convenience hooks
export const useIsDark = () => {
  const { isDark } = useTheme();
  return isDark;
};

export const useIsLight = () => {
  const { isLight } = useTheme();
  return isLight;
};

export const useActiveTheme = () => {
  const { activeTheme } = useTheme();
  return activeTheme;
};

export const useThemeColors = () => {
  const { colors } = useTheme();
  return colors;
};

export const useToggleTheme = () => {
  const { toggleTheme } = useTheme();
  return toggleTheme;
};

export const useSetTheme = () => {
  const { setTheme } = useTheme();
  return setTheme;
};

// CSS variable helper
export const useThemeVariable = (variable) => {
  const { colors } = useTheme();
  
  return useMemo(() => {
    return colors[variable] || null;
  }, [colors, variable]);
};

// Theme className helper
export const useThemeClass = (lightClass, darkClass) => {
  const { isDark } = useTheme();
  return isDark ? darkClass : lightClass;
};