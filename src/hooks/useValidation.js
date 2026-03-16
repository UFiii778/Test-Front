// =====================================================
// FILE: frontend/src/hooks/useValidation.js
// DESKRIPSI: Validation hook
// =====================================================

import { useState, useCallback, useMemo } from 'react';

export const useValidation = (initialState = {}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Common validation rules
  const rules = useMemo(() => ({
    required: (value, message = 'Field ini wajib diisi') => {
      if (value === undefined || value === null || value === '') {
        return message;
      }
      return null;
    },

    minLength: (value, min, message) => {
      if (value && value.length < min) {
        return message || `Minimal ${min} karakter`;
      }
      return null;
    },

    maxLength: (value, max, message) => {
      if (value && value.length > max) {
        return message || `Maksimal ${max} karakter`;
      }
      return null;
    },

    email: (value, message = 'Format email tidak valid') => {
      if (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return message;
        }
      }
      return null;
    },

    phone: (value, message = 'Format nomor telepon tidak valid') => {
      if (value) {
        const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
        if (!phoneRegex.test(value)) {
          return message;
        }
      }
      return null;
    },

    number: (value, message = 'Harus berupa angka') => {
      if (value && isNaN(value)) {
        return message;
      }
      return null;
    },

    min: (value, min, message) => {
      if (value && parseFloat(value) < min) {
        return message || `Minimal ${min}`;
      }
      return null;
    },

    max: (value, max, message) => {
      if (value && parseFloat(value) > max) {
        return message || `Maksimal ${max}`;
      }
      return null;
    },

    pattern: (value, pattern, message = 'Format tidak valid') => {
      if (value && !pattern.test(value)) {
        return message;
      }
      return null;
    },

    match: (value, matchValue, fieldName, message) => {
      if (value !== matchValue) {
        return message || `Harus sama dengan ${fieldName}`;
      }
      return null;
    },

    url: (value, message = 'URL tidak valid') => {
      if (value) {
        try {
          new URL(value);
          return null;
        } catch {
          return message;
        }
      }
      return null;
    },

    date: (value, message = 'Format tanggal tidak valid') => {
      if (value) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return message;
        }
      }
      return null;
    },

    future: (value, message = 'Tanggal harus di masa depan') => {
      if (value) {
        const date = new Date(value);
        const now = new Date();
        if (date <= now) {
          return message;
        }
      }
      return null;
    },

    past: (value, message = 'Tanggal harus di masa lalu') => {
      if (value) {
        const date = new Date(value);
        const now = new Date();
        if (date >= now) {
          return message;
        }
      }
      return null;
    },

    fileSize: (file, maxSize, message) => {
      if (file && file.size > maxSize) {
        return message || `Ukuran file maksimal ${maxSize / (1024 * 1024)}MB`;
      }
      return null;
    },

    fileType: (file, allowedTypes, message) => {
      if (file) {
        const fileType = file.type;
        if (!allowedTypes.includes(fileType)) {
          return message || 'Tipe file tidak didukung';
        }
      }
      return null;
    }
  }), []);

  // Validate a single field
  const validateField = useCallback((name, value, fieldRules) => {
    if (!fieldRules) return null;

    for (const [ruleName, ruleConfig] of Object.entries(fieldRules)) {
      if (rules[ruleName]) {
        const error = rules[ruleName](
          value,
          ...(Array.isArray(ruleConfig) ? ruleConfig : [ruleConfig])
        );
        if (error) {
          setErrors(prev => ({ ...prev, [name]: error }));
          return error;
        }
      }
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return null;
  }, [rules]);

  // Validate all fields
  const validateAll = useCallback((values, validationRules) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const fieldRules = validationRules[fieldName];
      const fieldValue = values[fieldName];

      for (const [ruleName, ruleConfig] of Object.entries(fieldRules)) {
        if (rules[ruleName]) {
          const error = rules[ruleName](
            fieldValue,
            ...(Array.isArray(ruleConfig) ? ruleConfig : [ruleConfig])
          );
          if (error) {
            newErrors[fieldName] = error;
            isValid = false;
            break;
          }
        }
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  }, [rules]);

  // Touch field
  const touchField = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  // Touch all fields
  const touchAll = useCallback((fields) => {
    const allTouched = {};
    fields.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
  }, []);

  // Clear field error
  const clearError = useCallback((name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset validation
  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  // Check if field has error
  const hasError = useCallback((name) => {
    return !!errors[name];
  }, [errors]);

  // Check if field is touched
  const isTouched = useCallback((name) => {
    return !!touched[name];
  }, [touched]);

  // Get field error
  const getError = useCallback((name) => {
    return errors[name];
  }, [errors]);

  return {
    errors,
    touched,
    rules,
    validateField,
    validateAll,
    touchField,
    touchAll,
    clearError,
    clearAllErrors,
    resetValidation,
    hasError,
    isTouched,
    getError
  };
};

// Password validation hook
export const usePasswordValidation = (password) => {
  const checks = useMemo(() => ({
    minLength: password?.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password)
  }), [password]);

  const strength = useMemo(() => {
    const validCount = Object.values(checks).filter(Boolean).length;
    
    if (validCount <= 2) return 'weak';
    if (validCount <= 4) return 'medium';
    if (validCount === 5) return 'strong';
    return 'weak';
  }, [checks]);

  const isValid = Object.values(checks).every(Boolean);

  return {
    checks,
    strength,
    isValid
  };
};