// =====================================================
// FILE: frontend/src/utils/validationRules.js
// DESKRIPSI: Form validation rules
// =====================================================

import * as validators from './validators';

/**
 * Required field validation
 */
export const required = (message = 'Field ini wajib diisi') => {
  return (value) => {
    if (value === undefined || value === null || value === '') {
      return message;
    }
    return null;
  };
};

/**
 * Email validation
 */
export const email = (message = 'Format email tidak valid') => {
  return (value) => {
    if (!value) return null;
    if (!validators.isValidEmail(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Phone number validation
 */
export const phone = (message = 'Format nomor telepon tidak valid') => {
  return (value) => {
    if (!value) return null;
    if (!validators.isValidPhoneNumber(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Min length validation
 */
export const minLength = (min, message = `Minimal ${min} karakter`) => {
  return (value) => {
    if (!value) return null;
    if (value.length < min) {
      return message;
    }
    return null;
  };
};

/**
 * Max length validation
 */
export const maxLength = (max, message = `Maksimal ${max} karakter`) => {
  return (value) => {
    if (!value) return null;
    if (value.length > max) {
      return message;
    }
    return null;
  };
};

/**
 * Min value validation
 */
export const min = (min, message = `Minimal ${min}`) => {
  return (value) => {
    if (value === null || value === undefined) return null;
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    if (num < min) {
      return message;
    }
    return null;
  };
};

/**
 * Max value validation
 */
export const max = (max, message = `Maksimal ${max}`) => {
  return (value) => {
    if (value === null || value === undefined) return null;
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    if (num > max) {
      return message;
    }
    return null;
  };
};

/**
 * Number validation
 */
export const number = (message = 'Harus berupa angka') => {
  return (value) => {
    if (!value) return null;
    if (isNaN(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Integer validation
 */
export const integer = (message = 'Harus berupa bilangan bulat') => {
  return (value) => {
    if (!value) return null;
    if (!Number.isInteger(Number(value))) {
      return message;
    }
    return null;
  };
};

/**
 * Positive number validation
 */
export const positive = (message = 'Harus berupa angka positif') => {
  return (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      return message;
    }
    return null;
  };
};

/**
 * Negative number validation
 */
export const negative = (message = 'Harus berupa angka negatif') => {
  return (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num >= 0) {
      return message;
    }
    return null;
  };
};

/**
 * Pattern validation
 */
export const pattern = (regex, message = 'Format tidak valid') => {
  return (value) => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Match validation (compare with another field)
 */
export const match = (field, fieldName, message = `Harus sama dengan ${fieldName}`) => {
  return (value, formValues) => {
    if (!value || !formValues[field]) return null;
    if (value !== formValues[field]) {
      return message;
    }
    return null;
  };
};

/**
 * URL validation
 */
export const url = (message = 'URL tidak valid') => {
  return (value) => {
    if (!value) return null;
    if (!validators.isValidUrl(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Date validation
 */
export const date = (message = 'Format tanggal tidak valid') => {
  return (value) => {
    if (!value) return null;
    if (!validators.isValidDate(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Future date validation
 */
export const future = (message = 'Tanggal harus di masa depan') => {
  return (value) => {
    if (!value) return null;
    if (!validators.isFutureDate(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Past date validation
 */
export const past = (message = 'Tanggal harus di masa lalu') => {
  return (value) => {
    if (!value) return null;
    if (!validators.isPastDate(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Age validation
 */
export const age = (minAge = 17, maxAge = 60, message = `Usia harus ${minAge}-${maxAge} tahun`) => {
  return (value) => {
    if (!value) return null;
    if (!validators.isValidAge(value, minAge, maxAge)) {
      return message;
    }
    return null;
  };
};

/**
 * NIK validation (Indonesian ID card)
 */
export const nik = (message = 'Format NIK tidak valid (16 digit)') => {
  return (value) => {
    if (!value) return null;
    if (!validators.isValidNIK(value)) {
      return message;
    }
    return null;
  };
};

/**
 * NPWP validation (Indonesian tax ID)
 */
export const npwp = (message = 'Format NPWP tidak valid') => {
  return (value) => {
    if (!value) return null;
    if (!validators.isValidNPWP(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Postal code validation
 */
export const postalCode = (message = 'Format kode pos tidak valid (5 digit)') => {
  return (value) => {
    if (!value) return null;
    if (!validators.isValidPostalCode(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Blood type validation
 */
export const bloodType = (message = 'Golongan darah tidak valid') => {
  return (value) => {
    if (!value) return null;
    if (!validators.isValidBloodType(value)) {
      return message;
    }
    return null;
  };
};

/**
 * Latitude validation
 */
export const latitude = (message = 'Latitude tidak valid (-90 sampai 90)') => {
  return (value) => {
    if (value === null || value === undefined) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num < -90 || num > 90) {
      return message;
    }
    return null;
  };
};

/**
 * Longitude validation
 */
export const longitude = (message = 'Longitude tidak valid (-180 sampai 180)') => {
  return (value) => {
    if (value === null || value === undefined) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num < -180 || num > 180) {
      return message;
    }
    return null;
  };
};

/**
 * File type validation
 */
export const fileType = (allowedTypes, message = 'Tipe file tidak didukung') => {
  return (file) => {
    if (!file) return null;
    if (!allowedTypes.includes(file.type)) {
      return message;
    }
    return null;
  };
};

/**
 * File size validation
 */
export const fileSize = (maxSize, message = `Ukuran file maksimal ${maxSize / (1024 * 1024)}MB`) => {
  return (file) => {
    if (!file) return null;
    if (file.size > maxSize) {
      return message;
    }
    return null;
  };
};

/**
 * Multiple validations
 */
export const compose = (...validations) => {
  return (value, formValues) => {
    for (const validation of validations) {
      const error = validation(value, formValues);
      if (error) return error;
    }
    return null;
  };
};

/**
 * Conditional validation
 */
export const when = (condition, validation) => {
  return (value, formValues) => {
    if (condition(formValues)) {
      return validation(value, formValues);
    }
    return null;
  };
};

/**
 * Custom validation
 */
export const custom = (validator, message = 'Validasi gagal') => {
  return (value, formValues) => {
    if (!validator(value, formValues)) {
      return message;
    }
    return null;
  };
};