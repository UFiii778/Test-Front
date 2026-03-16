// =====================================================
// FILE: frontend/src/utils/storageUtils.js
// DESKRIPSI: Storage utilities
// =====================================================

// Storage keys
const STORAGE_PREFIX = 'darahkita_';

/**
 * Get storage key with prefix
 */
export const getStorageKey = (key) => {
  return `${STORAGE_PREFIX}${key}`;
};

/**
 * Set item in localStorage
 */
export const setLocal = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(getStorageKey(key), serialized);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Get item from localStorage
 */
export const getLocal = (key, defaultValue = null) => {
  try {
    const serialized = localStorage.getItem(getStorageKey(key));
    if (serialized === null) return defaultValue;
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 */
export const removeLocal = (key) => {
  try {
    localStorage.removeItem(getStorageKey(key));
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

/**
 * Clear all localStorage items with prefix
 */
export const clearLocal = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Set item in sessionStorage
 */
export const setSession = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    sessionStorage.setItem(getStorageKey(key), serialized);
    return true;
  } catch (error) {
    console.error('Error saving to sessionStorage:', error);
    return false;
  }
};

/**
 * Get item from sessionStorage
 */
export const getSession = (key, defaultValue = null) => {
  try {
    const serialized = sessionStorage.getItem(getStorageKey(key));
    if (serialized === null) return defaultValue;
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove item from sessionStorage
 */
export const removeSession = (key) => {
  try {
    sessionStorage.removeItem(getStorageKey(key));
    return true;
  } catch (error) {
    console.error('Error removing from sessionStorage:', error);
    return false;
  }
};

/**
 * Clear all sessionStorage items with prefix
 */
export const clearSession = () => {
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
    return false;
  }
};

/**
 * Set item in cookie
 */
export const setCookie = (name, value, days = 7) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${getStorageKey(name)}=${JSON.stringify(value)};${expires};path=/;SameSite=Strict`;
    return true;
  } catch (error) {
    console.error('Error setting cookie:', error);
    return false;
  }
};

/**
 * Get item from cookie
 */
export const getCookie = (name, defaultValue = null) => {
  try {
    const cookieName = `${getStorageKey(name)}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(cookieName)) {
        const value = cookie.substring(cookieName.length);
        return JSON.parse(value);
      }
    }
    
    return defaultValue;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return defaultValue;
  }
};

/**
 * Remove item from cookie
 */
export const removeCookie = (name) => {
  try {
    document.cookie = `${getStorageKey(name)}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    return true;
  } catch (error) {
    console.error('Error removing cookie:', error);
    return false;
  }
};

/**
 * Clear all cookies with prefix
 */
export const clearCookies = () => {
  try {
    const cookies = document.cookie.split(';');
    
    cookies.forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name.startsWith(STORAGE_PREFIX)) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing cookies:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = () => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if sessionStorage is available
 */
export const isSessionStorageAvailable = () => {
  try {
    const test = '__test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if cookies are enabled
 */
export const areCookiesEnabled = () => {
  try {
    document.cookie = 'testcookie=1';
    const enabled = document.cookie.indexOf('testcookie') !== -1;
    document.cookie = 'testcookie=1; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    return enabled;
  } catch {
    return false;
  }
};

/**
 * Get storage usage info
 */
export const getStorageInfo = () => {
  let localStorageSize = 0;
  let sessionStorageSize = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorageSize += (localStorage.getItem(key)?.length || 0) * 2; // Approximate bytes
  }
  
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    sessionStorageSize += (sessionStorage.getItem(key)?.length || 0) * 2;
  }
  
  return {
    localStorage: {
      items: localStorage.length,
      size: localStorageSize,
      sizeFormatted: formatFileSize(localStorageSize)
    },
    sessionStorage: {
      items: sessionStorage.length,
      size: sessionStorageSize,
      sizeFormatted: formatFileSize(sessionStorageSize)
    }
  };
};

/**
 * Format file size helper
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};