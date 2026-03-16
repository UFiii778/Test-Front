// =====================================================
// FILE: frontend/src/hooks/useBoolean.js
// DESKRIPSI: Boolean state hook
// =====================================================

import { useState, useCallback } from 'react';

export const useBoolean = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const set = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return [value, { setTrue, setFalse, toggle, set }];
};

// Loading state hook
export const useLoading = (initialValue = false) => {
  const [isLoading, setIsLoading] = useBoolean(initialValue);

  const startLoading = useCallback(() => {
    setIsLoading.setTrue();
  }, [setIsLoading]);

  const stopLoading = useCallback(() => {
    setIsLoading.setFalse();
  }, [setIsLoading]);

  const withLoading = useCallback(async (callback) => {
    try {
      startLoading();
      return await callback();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return { isLoading, startLoading, stopLoading, withLoading };
};

// Error state hook
export const useError = () => {
  const [error, setError] = useState(null);

  const setErrorMessage = useCallback((message) => {
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, setError: setErrorMessage, clearError };
};

// Success state hook
export const useSuccess = () => {
  const [success, setSuccess] = useState(null);

  const setSuccessMessage = useCallback((message) => {
    setSuccess(message);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  return { success, setSuccess: setSuccessMessage, clearSuccess };
};

// Visibility state hook
export const useVisibility = (initialValue = false) => {
  const [isVisible, setIsVisible] = useBoolean(initialValue);

  const show = useCallback(() => {
    setIsVisible.setTrue();
  }, [setIsVisible]);

  const hide = useCallback(() => {
    setIsVisible.setFalse();
  }, [setIsVisible]);

  const toggleVisibility = useCallback(() => {
    setIsVisible.toggle();
  }, [setIsVisible]);

  return { isVisible, show, hide, toggle: toggleVisibility };
};

// Edit mode hook
export const useEditMode = (initialValue = false) => {
  const [isEditing, setIsEditing] = useBoolean(initialValue);

  const startEditing = useCallback(() => {
    setIsEditing.setTrue();
  }, [setIsEditing]);

  const stopEditing = useCallback(() => {
    setIsEditing.setFalse();
  }, [setIsEditing]);

  const toggleEditing = useCallback(() => {
    setIsEditing.toggle();
  }, [setIsEditing]);

  return { isEditing, startEditing, stopEditing, toggle: toggleEditing };
};

// Selected state hook
export const useSelected = (initialValue = null) => {
  const [selected, setSelected] = useState(initialValue);

  const select = useCallback((item) => {
    setSelected(item);
  }, []);

  const deselect = useCallback(() => {
    setSelected(null);
  }, []);

  const toggleSelect = useCallback((item) => {
    setSelected(prev => prev === item ? null : item);
  }, []);

  const isSelected = useCallback((item) => {
    return selected === item;
  }, [selected]);

  return { selected, select, deselect, toggleSelect, isSelected };
};