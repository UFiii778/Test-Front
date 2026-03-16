// =====================================================
// FILE: frontend/src/hooks/useLoading.js
// DESKRIPSI: Loading hook
// =====================================================

import { useContext, useCallback } from 'react';
import { LoadingContext } from '../contexts/LoadingContext';

export const useLoading = () => {
  const context = useContext(LoadingContext);
  
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  
  return context;
};

// Convenience hooks
export const useStartLoading = () => {
  const { startLoading } = useLoading();
  return startLoading;
};

export const useStopLoading = () => {
  const { stopLoading } = useLoading();
  return stopLoading;
};

export const useToggleLoading = () => {
  const { toggleLoading } = useLoading();
  return toggleLoading;
};

export const useIsLoading = (key = 'global') => {
  const { isLoading } = useLoading();
  return isLoading(key);
};

export const useIsAnyLoading = () => {
  const { isAnyLoading } = useLoading();
  return isAnyLoading();
};

export const useWithLoading = () => {
  const { withLoading } = useLoading();
  return withLoading;
};

// Scoped loading hooks
export const useScopedLoading = (scope) => {
  const { startLoading, stopLoading, toggleLoading, isLoading } = useLoading();
  
  const start = useCallback((message) => startLoading(scope, message), [scope, startLoading]);
  const stop = useCallback(() => stopLoading(scope), [scope, stopLoading]);
  const toggle = useCallback((message) => toggleLoading(scope, message), [scope, toggleLoading]);
  const loading = isLoading(scope);

  return {
    start,
    stop,
    toggle,
    loading
  };
};

// API request loading helper
export const useApiLoading = () => {
  const { withLoading } = useLoading();

  const callApi = useCallback(async (apiFunction, ...args) => {
    return await withLoading(async () => {
      return await apiFunction(...args);
    }, 'api', 'Memuat data...');
  }, [withLoading]);

  return callApi;
};

// Form submission loading helper
export const useFormLoading = () => {
  const { withLoading } = useLoading();

  const submitForm = useCallback(async (submitFunction, data) => {
    return await withLoading(async () => {
      return await submitFunction(data);
    }, 'form', 'Menyimpan data...');
  }, [withLoading]);

  return submitForm;
};

// Page loading helper
export const usePageLoading = () => {
  const { withLoading } = useLoading();

  const loadPage = useCallback(async (loadFunction) => {
    return await withLoading(loadFunction, 'page', 'Memuat halaman...');
  }, [withLoading]);

  return loadPage;
};