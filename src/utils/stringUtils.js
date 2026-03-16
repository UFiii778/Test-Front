// =====================================================
// FILE: frontend/src/utils/stringUtils.js
// DESKRIPSI: String utilities
// =====================================================

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

/**
 * Capitalize each word
 */
export const capitalizeWords = (string) => {
  if (!string) return '';
  return string.split(' ').map(word => capitalizeFirst(word)).join(' ');
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (string, length = 100, ellipsis = '...') => {
  if (!string) return '';
  if (string.length <= length) return string;
  return string.substring(0, length) + ellipsis;
};

/**
 * Generate slug from string
 */
export const slugify = (string) => {
  if (!string) return '';
  
  return string
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Strip HTML tags
 */
export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Truncate HTML safely
 */
export const truncateHtml = (html, length = 100) => {
  if (!html) return '';
  
  const text = stripHtml(html);
  return truncate(text, length);
};

/**
 * Generate random string
 */
export const randomString = (length = 8, options = {}) => {
  const {
    uppercase = true,
    lowercase = true,
    numbers = true,
    special = false
  } = options;
  
  let chars = '';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) chars += '0123456789';
  if (special) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return result;
};

/**
 * Mask email address
 */
export const maskEmail = (email) => {
  if (!email) return '';
  
  const [local, domain] = email.split('@');
  if (!domain) return email;
  
  const maskedLocal = local.length > 2
    ? local.substring(0, 2) + '*'.repeat(local.length - 2)
    : local + '*'.repeat(2 - local.length);
  
  return `${maskedLocal}@${domain}`;
};

/**
 * Mask phone number
 */
export const maskPhone = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 8) return phone;
  
  const visible = 4;
  const masked = cleaned.substring(0, cleaned.length - visible).replace(/./g, '*');
  const last = cleaned.substring(cleaned.length - visible);
  
  return masked + last;
};

/**
 * Extract initials
 */
export const getInitials = (name, max = 2) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word[0])
    .filter(char => char && char.match(/[A-Za-z]/))
    .join('')
    .toUpperCase()
    .substring(0, max);
};

/**
 * Generate username from email
 */
export const usernameFromEmail = (email) => {
  if (!email) return '';
  
  const [local] = email.split('@');
  return local.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

/**
 * Check if string is email
 */
export const isEmail = (string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(string);
};

/**
 * Check if string is phone number (Indonesia)
 */
export const isPhoneNumber = (string) => {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
  return phoneRegex.test(string);
};

/**
 * Check if string is URL
 */
export const isUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

/**
 * Normalize whitespace
 */
export const normalizeWhitespace = (string) => {
  if (!string) return '';
  return string.replace(/\s+/g, ' ').trim();
};

/**
 * Escape HTML special characters
 */
export const escapeHtml = (string) => {
  if (!string) return '';
  
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return string.replace(/[&<>"']/g, char => htmlEscapes[char]);
};

/**
 * Unescape HTML special characters
 */
export const unescapeHtml = (string) => {
  if (!string) return '';
  
  const htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };
  
  return string.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, match => htmlUnescapes[match]);
};

/**
 * Pad string to length
 */
export const pad = (string, length, char = ' ', position = 'right') => {
  if (!string) string = '';
  
  const str = String(string);
  if (str.length >= length) return str;
  
  const padding = char.repeat(length - str.length);
  
  if (position === 'left') return padding + str;
  if (position === 'right') return str + padding;
  if (position === 'both') {
    const leftPad = Math.floor(padding.length / 2);
    const rightPad = padding.length - leftPad;
    return char.repeat(leftPad) + str + char.repeat(rightPad);
  }
  
  return str;
};

/**
 * Convert to camelCase
 */
export const toCamelCase = (string) => {
  if (!string) return '';
  
  return string
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^[A-Z]/, c => c.toLowerCase());
};

/**
 * Convert to snake_case
 */
export const toSnakeCase = (string) => {
  if (!string) return '';
  
  return string
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[-_\s]+/g, '_');
};

/**
 * Convert to kebab-case
 */
export const toKebabCase = (string) => {
  if (!string) return '';
  
  return string
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/[-_\s]+/g, '-');
};

/**
 * Pluralize word
 */
export const pluralize = (count, singular, plural = null) => {
  if (count === 1) return singular;
  return plural || singular + 's';
};

/**
 * Format list with comma and 'and'
 */
export const formatList = (items, conjunction = 'and') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const last = items.pop();
  return `${items.join(', ')}, ${conjunction} ${last}`;
};

/**
 * Reverse string
 */
export const reverse = (string) => {
  return string.split('').reverse().join('');
};

/**
 * Count occurrences
 */
export const countOccurrences = (string, substring) => {
  return (string.match(new RegExp(substring, 'g')) || []).length;
};

/**
 * Remove accents/diacritics
 */
export const removeAccents = (string) => {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Check if string contains only letters
 */
export const isAlpha = (string) => {
  return /^[a-zA-Z]+$/.test(string);
};

/**
 * Check if string contains only numbers
 */
export const isNumeric = (string) => {
  return /^\d+$/.test(string);
};

/**
 * Check if string contains only alphanumeric
 */
export const isAlphanumeric = (string) => {
  return /^[a-zA-Z0-9]+$/.test(string);
};