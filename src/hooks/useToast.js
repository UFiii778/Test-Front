// =====================================================
// FILE: frontend/src/hooks/useToast.js
// DESKRIPSI: Toast hook
// =====================================================

import { useContext, useCallback } from 'react';
import { ToastContext } from '../contexts/ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

// Convenience hooks
export const useSuccessToast = () => {
  const { success } = useToast();
  return success;
};

export const useErrorToast = () => {
  const { error } = useToast();
  return error;
};

export const useWarningToast = () => {
  const { warning } = useToast();
  return warning;
};

export const useInfoToast = () => {
  const { info } = useToast();
  return info;
};

export const useAddToast = () => {
  const { addToast } = useToast();
  return addToast;
};

export const useRemoveToast = () => {
  const { removeToast } = useToast();
  return removeToast;
};

export const useClearToasts = () => {
  const { clearToasts } = useToast();
  return clearToasts;
};

// API response toast helpers
export const useApiToast = () => {
  const { success, error, warning } = useToast();

  const handleApiResponse = useCallback((response, successMessage, errorMessage) => {
    if (response.success) {
      success(successMessage || response.message || 'Berhasil');
      return true;
    } else {
      error(errorMessage || response.error || 'Gagal');
      return false;
    }
  }, [success, error]);

  const handleApiError = useCallback((err, defaultMessage = 'Terjadi kesalahan') => {
    error(err?.message || defaultMessage);
  }, [error]);

  return { handleApiResponse, handleApiError };
};

// Form submission toast helper
export const useFormToast = () => {
  const { success, error } = useToast();

  const handleSubmitSuccess = useCallback((message = 'Data berhasil disimpan') => {
    success(message);
  }, [success]);

  const handleSubmitError = useCallback((err, defaultMessage = 'Gagal menyimpan data') => {
    error(err?.message || defaultMessage);
  }, [error]);

  return { handleSubmitSuccess, handleSubmitError };
};

// Copy to clipboard toast helper
export const useCopyToast = () => {
  const { success, error } = useToast();

  const handleCopySuccess = useCallback((message = 'Teks berhasil disalin') => {
    success(message);
  }, [success]);

  const handleCopyError = useCallback(() => {
    error('Gagal menyalin teks');
  }, [error]);

  return { handleCopySuccess, handleCopyError };
};