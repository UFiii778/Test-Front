// =====================================================
// FILE: frontend/src/hooks/useLanguage.js
// DESKRIPSI: Language hook
// =====================================================

import { useContext, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

// Convenience hooks
export const useTranslation = () => {
  const { t } = useLanguage();
  return t;
};

export const useCurrentLanguage = () => {
  const { language, currentLanguage } = useLanguage();
  return { language, currentLanguage };
};

export const useChangeLanguage = () => {
  const { changeLanguage } = useLanguage();
  return changeLanguage;
};

export const useFormatNumber = () => {
  const { formatNumber } = useLanguage();
  return formatNumber;
};

export const useFormatDate = () => {
  const { formatDate } = useLanguage();
  return formatDate;
};

export const useFormatCurrency = () => {
  const { formatCurrency } = useLanguage();
  return formatCurrency;
};

export const useFormatRelativeTime = () => {
  const { formatRelativeTime } = useLanguage();
  return formatRelativeTime;
};

// Translation helper for components
export const useTranslate = (key, params = {}) => {
  const { t } = useLanguage();
  return t(key, params);
};