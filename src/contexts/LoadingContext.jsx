// =====================================================
// FILE: frontend/src/contexts/LoadingContext.jsx
// DESKRIPSI: Loading context provider
// =====================================================

import React, { createContext, useState, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '../components/atoms';

// Create context
const LoadingContext = createContext(null);

// Custom hook to use loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Loading overlay component
const LoadingOverlay = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center">
      <Spinner size="lg" className="mb-4" />
      {message && (
        <p className="text-gray-600">{message}</p>
      )}
    </div>
  </motion.div>
);

// Provider component
export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalMessage, setGlobalMessage] = useState('');

  // Start loading
  const startLoading = useCallback((key = 'global', message = '') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: true
    }));
    if (key === 'global' && message) {
      setGlobalMessage(message);
    }
  }, []);

  // Stop loading
  const stopLoading = useCallback((key = 'global') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: false
    }));
    if (key === 'global') {
      setGlobalMessage('');
    }
  }, []);

  // Toggle loading
  const toggleLoading = useCallback((key = 'global', message = '') => {
    setLoadingStates(prev => {
      const newState = {
        ...prev,
        [key]: !prev[key]
      };
      
      if (key === 'global') {
        setGlobalMessage(newState[key] ? message : '');
      }
      
      return newState;
    });
  }, []);

  // Check if loading
  const isLoading = useCallback((key = 'global') => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  // Check if any loading
  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  // With loading wrapper for async functions
  const withLoading = useCallback(async (fn, key = 'global', message = '') => {
    try {
      startLoading(key, message);
      return await fn();
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  // Create scoped loading
  const createScopedLoading = useCallback((scope) => {
    return {
      start: (message) => startLoading(scope, message),
      stop: () => stopLoading(scope),
      toggle: (message) => toggleLoading(scope, message),
      isLoading: () => isLoading(scope)
    };
  }, [startLoading, stopLoading, toggleLoading, isLoading]);

  // Context value
  const value = {
    startLoading,
    stopLoading,
    toggleLoading,
    isLoading,
    isAnyLoading,
    withLoading,
    createScopedLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isLoading('global') && <LoadingOverlay message={globalMessage} />}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};