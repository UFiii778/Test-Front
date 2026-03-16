// =====================================================
// FILE: frontend/src/utils/validators.js
// DESKRIPSI: Validation utilities
// =====================================================

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indonesia)
 */
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate NIK (Indonesian ID card)
 */
export const isValidNIK = (nik) => {
  const nikRegex = /^\d{16}$/;
  return nikRegex.test(nik);
};

/**
 * Validate NPWP (Indonesian tax ID)
 */
export const isValidNPWP = (npwp) => {
  const npwpRegex = /^\d{15}$|^\d{2}\.\d{3}\.\d{3}\.\d{1}\.\d{3}\.\d{3}$/;
  return npwpRegex.test(npwp);
};

/**
 * Validate postal code
 */
export const isValidPostalCode = (postalCode) => {
  const postalRegex = /^\d{5}$/;
  return postalRegex.test(postalCode);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Minimal 8 karakter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Harus mengandung huruf besar');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Harus mengandung huruf kecil');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Harus mengandung angka');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Harus mengandung simbol (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate blood type
 */
export const isValidBloodType = (bloodType) => {
  const validTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  return validTypes.includes(bloodType);
};

/**
 * Validate rhesus
 */
export const isValidRhesus = (rhesus) => {
  return ['positif', 'negatif'].includes(rhesus);
};

/**
 * Validate latitude
 */
export const isValidLatitude = (lat) => {
  return lat >= -90 && lat <= 90;
};

/**
 * Validate longitude
 */
export const isValidLongitude = (lng) => {
  return lng >= -180 && lng <= 180;
};

/**
 * Validate date
 */
export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

/**
 * Validate future date
 */
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

/**
 * Validate past date
 */
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
};

/**
 * Validate age
 */
export const isValidAge = (birthDate, minAge = 17, maxAge = 60) => {
  if (!isValidDate(birthDate)) return false;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= minAge && age <= maxAge;
};

/**
 * Validate range
 */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

/**
 * Validate file type
 */
export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 */
export const isValidFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

/**
 * Validate image dimensions
 */
export const isValidImageDimensions = (file, maxWidth, maxHeight) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img.width <= maxWidth && img.height <= maxHeight);
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate UUID
 */
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validate JSON
 */
export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate base64
 */
export const isValidBase64 = (str) => {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};

/**
 * Validate request code
 */
export const isValidRequestCode = (code) => {
  const codeRegex = /^REQ-\d+-[A-Z0-9]{6}$/;
  return codeRegex.test(code);
};

/**
 * Validate appointment code
 */
export const isValidAppointmentCode = (code) => {
  const codeRegex = /^APT-\d+-[A-Z0-9]{6}$/;
  return codeRegex.test(code);
};

/**
 * Validate emergency code
 */
export const isValidEmergencyCode = (code) => {
  const codeRegex = /^EMG-\d+-[A-Z0-9]{6}$/;
  return codeRegex.test(code);
};

/**
 * Validate certificate number
 */
export const isValidCertificateNumber = (number) => {
  const certRegex = /^CERT-\d{6}-\d+-\d{4}$/;
  return certRegex.test(number);
};