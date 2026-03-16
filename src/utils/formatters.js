// =====================================================
// FILE: frontend/src/utils/formatters.js
// DESKRIPSI: Formatting utilities
// =====================================================

/**
 * Format number with thousand separator
 */
export const formatNumber = (number, locale = 'id-ID') => {
  if (number === null || number === undefined) return '-';
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Format currency (IDR)
 */
export const formatCurrency = (amount, locale = 'id-ID', currency = 'IDR') => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format decimal with fixed decimals
 */
export const formatDecimal = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  return value.toFixed(decimals);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '-';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format phone number to Indonesia format
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  
  // Remove non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // Check if it's Indonesian number
  if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.substring(2);
  } else if (!cleaned.startsWith('0')) {
    cleaned = '0' + cleaned;
  }
  
  // Format: 0812-3456-7890
  if (cleaned.length >= 10) {
    return cleaned.replace(/(\d{4})(\d{4})(\d{0,4})/, '$1-$2-$3');
  }
  
  return cleaned;
};

/**
 * Format latitude/longitude
 */
export const formatCoordinate = (coordinate, decimals = 6) => {
  if (coordinate === null || coordinate === undefined) return '-';
  return coordinate.toFixed(decimals);
};

/**
 * Format as distance (km)
 */
export const formatDistance = (km) => {
  if (km === null || km === undefined) return '-';
  
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} m`;
  }
  
  return `${km.toFixed(1)} km`;
};

/**
 * Format as duration (minutes to hours)
 */
export const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) return '-';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}j ${mins}m`;
  }
  
  return `${mins}m`;
};

/**
 * Format with abbreviation (K, M, B)
 */
export const formatAbbreviated = (number) => {
  if (number === null || number === undefined) return '-';
  
  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + 'B';
  }
  if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + 'M';
  }
  if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + 'K';
  }
  
  return number.toString();
};

/**
 * Format as ordinal (1st, 2nd, 3rd)
 */
export const formatOrdinal = (number) => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = number % 100;
  
  if (value >= 11 && value <= 13) {
    return number + 'th';
  }
  
  const lastDigit = number % 10;
  const suffix = suffixes[lastDigit] || suffixes[0];
  
  return number + suffix;
};

/**
 * Format as percentage change
 */
export const formatChange = (oldValue, newValue) => {
  if (!oldValue || !newValue) return null;
  
  const change = ((newValue - oldValue) / oldValue) * 100;
  const sign = change >= 0 ? '+' : '';
  
  return {
    value: change,
    formatted: `${sign}${change.toFixed(1)}%`,
    isPositive: change > 0,
    isNegative: change < 0
  };
};

/**
 * Format full name
 */
export const formatFullName = (firstName, lastName) => {
  if (!firstName) return lastName || '';
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
};

/**
 * Format initials
 */
export const formatInitials = (name, max = 2) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, max);
};

/**
 * Format address
 */
export const formatAddress = (address, city, province, postalCode) => {
  const parts = [];
  if (address) parts.push(address);
  if (city) parts.push(city);
  if (province) parts.push(province);
  if (postalCode) parts.push(postalCode);
  
  return parts.join(', ');
};

/**
 * Format blood type with rhesus
 */
export const formatBloodType = (type, rhesus) => {
  if (!type) return '-';
  if (!rhesus) return type;
  return `${type}${rhesus === 'positif' ? '+' : '-'}`;
};