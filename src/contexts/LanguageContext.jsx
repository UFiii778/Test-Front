// =====================================================
// FILE: frontend/src/contexts/LanguageContext.jsx
// DESKRIPSI: Language context provider
// =====================================================

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import storage from '../services/storage';

// Create context
const LanguageContext = createContext(null);

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Provider component
export const LanguageProvider = ({ children }) => {
  // Available languages
  const languages = {
    id: {
      code: 'id',
      name: 'Indonesia',
      flag: '🇮🇩',
      direction: 'ltr'
    },
    en: {
      code: 'en',
      name: 'English',
      flag: '🇬🇧',
      direction: 'ltr'
    }
  };

  // Current language
  const [language, setLanguage] = useState(() => {
    const saved = storage.get('language', 'id');
    return saved;
  });

  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);

  // Load translations
  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  // Load translations from file
  const loadTranslations = async (lang) => {
    setLoading(true);
    try {
      // Import translations dynamically
      const module = await import(`../locales/${lang}.json`);
      setTranslations(module.default);
      
      // Set document direction
      document.documentElement.dir = languages[lang]?.direction || 'ltr';
      document.documentElement.lang = lang;
      
      // Save to storage
      storage.set('language', lang);
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Change language
  const changeLanguage = useCallback((lang) => {
    if (languages[lang]) {
      setLanguage(lang);
    }
  }, []);

  // Translate text
  const t = useCallback((key, params = {}) => {
    let text = translations[key] || key;

    // Replace parameters
    Object.keys(params).forEach(param => {
      text = text.replace(`{{${param}}}`, params[param]);
    });

    return text;
  }, [translations]);

  // Format number based on locale
  const formatNumber = useCallback((number, options = {}) => {
    return new Intl.NumberFormat(language, options).format(number);
  }, [language]);

  // Format date based on locale
  const formatDate = useCallback((date, options = {}) => {
    return new Intl.DateTimeFormat(language, options).format(new Date(date));
  }, [language]);

  // Format currency based on locale
  const formatCurrency = useCallback((amount, currency = 'IDR', options = {}) => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency,
      ...options
    }).format(amount);
  }, [language]);

  // Format relative time
  const formatRelativeTime = useCallback((date, options = {}) => {
    const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto', ...options });
    const now = new Date();
    const target = new Date(date);
    const diffInSeconds = (target - now) / 1000;

    const intervals = {
      year: 60 * 60 * 24 * 365,
      month: 60 * 60 * 24 * 30,
      week: 60 * 60 * 24 * 7,
      day: 60 * 60 * 24,
      hour: 60 * 60,
      minute: 60,
      second: 1
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const diff = Math.round(diffInSeconds / seconds);
      if (Math.abs(diff) >= 1) {
        return rtf.format(diff, unit);
      }
    }

    return rtf.format(0, 'second');
  }, [language]);

  // Get current language info
  const currentLanguage = languages[language] || languages.id;

  // Context value
  const value = {
    language,
    languages,
    currentLanguage,
    loading,
    t,
    changeLanguage,
    formatNumber,
    formatDate,
    formatCurrency,
    formatRelativeTime
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};