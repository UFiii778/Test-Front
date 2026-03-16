// =====================================================
// FILE: frontend/src/hooks/useLocalStorage.js
// DESKRIPSI: Local storage hook
// =====================================================

import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse
  const readValue = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // State to store value
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from storage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen to changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

// Specialized hooks
export const useLocalStorageObject = (key, initialValue = {}) => {
  const [value, setValue] = useLocalStorage(key, initialValue);

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

export const useLocalStorageArray = (key, initialValue = []) => {
  const [value, setValue] = useLocalStorage(key, initialValue);

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

export const useLocalStorageBoolean = (key, initialValue = false) => {
  return useLocalStorage(key, initialValue);
};

export const useLocalStorageNumber = (key, initialValue = 0) => {
  return useLocalStorage(key, initialValue);
};

export const useLocalStorageString = (key, initialValue = '') => {
  return useLocalStorage(key, initialValue);
};