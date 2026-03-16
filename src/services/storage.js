// =====================================================
// FILE: frontend/src/services/storage.js
// DESKRIPSI: Local storage service
// =====================================================

class StorageService {
  constructor() {
    this.prefix = 'darahkita_';
  }

  /**
   * Set item in storage
   */
  set(key, value, expiresIn = null) {
    try {
      const data = {
        value,
        timestamp: Date.now()
      };

      if (expiresIn) {
        data.expiresAt = Date.now() + expiresIn * 1000;
      }

      localStorage.setItem(this.prefix + key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  /**
   * Get item from storage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      
      if (!item) return defaultValue;

      const data = JSON.parse(item);

      // Check expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.remove(key);
        return defaultValue;
      }

      return data.value;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  /**
   * Clear all items with prefix
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * Get all keys with prefix
   */
  keys() {
    try {
      const keys = Object.keys(localStorage);
      return keys.filter(key => key.startsWith(this.prefix))
                 .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.error('Storage keys error:', error);
      return [];
    }
  }

  /**
   * Check if key exists
   */
  has(key) {
    return localStorage.getItem(this.prefix + key) !== null;
  }

  /**
   * Get item size in bytes
   */
  size(key) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? new Blob([item]).size : 0;
    } catch (error) {
      console.error('Storage size error:', error);
      return 0;
    }
  }

  /**
   * Get total storage used
   */
  totalSize() {
    try {
      let total = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        total += new Blob([localStorage.getItem(key)]).size;
      }
      
      return total;
    } catch (error) {
      console.error('Storage total size error:', error);
      return 0;
    }
  }

  /**
   * Set session item (cleared when browser closes)
   */
  setSession(key, value) {
    try {
      sessionStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Session storage set error:', error);
      return false;
    }
  }

  /**
   * Get session item
   */
  getSession(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Session storage get error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove session item
   */
  removeSession(key) {
    try {
      sessionStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Session storage remove error:', error);
      return false;
    }
  }

  /**
   * Clear all session items
   */
  clearSession() {
    try {
      const keys = Object.keys(sessionStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Session storage clear error:', error);
      return false;
    }
  }

  /**
   * Set cookie
   */
  setCookie(key, value, days = 7) {
    try {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      
      document.cookie = `${this.prefix}${key}=${JSON.stringify(value)}; expires=${date.toUTCString()}; path=/; SameSite=Strict`;
      return true;
    } catch (error) {
      console.error('Cookie set error:', error);
      return false;
    }
  }

  /**
   * Get cookie
   */
  getCookie(key, defaultValue = null) {
    try {
      const name = `${this.prefix}${key}=`;
      const cookies = document.cookie.split(';');
      
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name)) {
          const value = cookie.substring(name.length);
          return JSON.parse(value);
        }
      }
      
      return defaultValue;
    } catch (error) {
      console.error('Cookie get error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove cookie
   */
  removeCookie(key) {
    try {
      document.cookie = `${this.prefix}${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      return true;
    } catch (error) {
      console.error('Cookie remove error:', error);
      return false;
    }
  }

  /**
   * Clear all cookies with prefix
   */
  clearCookies() {
    try {
      const cookies = document.cookie.split(';');
      
      cookies.forEach(cookie => {
        const [name] = cookie.trim().split('=');
        
        if (name.startsWith(this.prefix)) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
      
      return true;
    } catch (error) {
      console.error('Cookies clear error:', error);
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  getUsageInfo() {
    try {
      const localStorageSize = this.totalSize();
      const localStorageCount = localStorage.length;
      
      const sessionStorageSize = new Blob([JSON.stringify(sessionStorage)]).size;
      const sessionStorageCount = sessionStorage.length;
      
      return {
        localStorage: {
          count: localStorageCount,
          size: localStorageSize,
          sizeFormatted: this.formatSize(localStorageSize)
        },
        sessionStorage: {
          count: sessionStorageCount,
          size: sessionStorageSize,
          sizeFormatted: this.formatSize(sessionStorageSize)
        },
        cookies: {
          count: document.cookie.split(';').length,
          size: new Blob([document.cookie]).size,
          sizeFormatted: this.formatSize(new Blob([document.cookie]).size)
        }
      };
    } catch (error) {
      console.error('Storage usage error:', error);
      return null;
    }
  }

  /**
   * Format file size
   */
  formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if storage is available
   */
  isAvailable() {
    try {
      const testKey = this.prefix + 'test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const storageService = new StorageService();

export default storageService;