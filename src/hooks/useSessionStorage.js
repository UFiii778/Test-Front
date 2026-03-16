// =====================================================
// FILE: frontend/src/hooks/useSessionStorage.js
// DESKRIPSI: Session storage hook
// =====================================================

import { useState, useEffect, useCallback } from 'react';

export const useSessionStorage = (key, initialValue) => {
  // Get from session storage then parse
  const readValue = useCallback(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // State to store value
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to sessionStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to session storage
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from storage
  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Specialized hooks (similar to localStorage but for session)
export const useSessionStorageObject = (key, initialValue = {}) => {
  const [value, setValue] = useSessionStorage(key, initialValue);

  const updateValue = useCallback((newValue) => {
    setValue((prev) => ({ ...prev, ...newValue }));
  }, [setValue]);

  const removeKey = useCallback((keyToRemove) => {
    setValue((prev) => {
      const newObj = { ...prev };
      delete newObj[keyToRemove];
      return newObj;
    });
  }, [setValue]);

  return [value, updateValue, removeKey];
};

export const useSessionStorageArray = (key, initialValue = []) => {
  const [value, setValue] = useSessionStorage(key, initialValue);

  const push = useCallback((item) => {
    setValue((prev) => [...prev, item]);
  }, [setValue]);

  const remove = useCallback((index) => {
    setValue((prev) => prev.filter((_, i) => i !== index));
  }, [setValue]);

  const update = useCallback((index, newValue) => {
    setValue((prev) => prev.map((item, i) => i === index ? newValue : item));
  }, [setValue]);

  const clear = useCallback(() => {
    setValue([]);
  }, [setValue]);

  return [value, { push, remove, update, clear }];
};

export const useSessionStorageBoolean = (key, initialValue = false) => {
  return useSessionStorage(key, initialValue);
};

export const useSessionStorageNumber = (key, initialValue = 0) => {
  return useSessionStorage(key, initialValue);
};

export const useSessionStorageString = (key, initialValue = '') => {
  return useSessionStorage(key, initialValue);
};