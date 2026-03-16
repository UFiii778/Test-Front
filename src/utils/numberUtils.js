// =====================================================
// FILE: frontend/src/utils/numberUtils.js
// DESKRIPSI: Number utilities
// =====================================================

/**
 * Format number with thousand separator
 */
export const formatNumber = (number, locale = 'id-ID') => {
  if (number === null || number === undefined) return '-';
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Parse number from string
 */
export const parseNumber = (string) => {
  if (!string) return null;
  
  // Remove non-digits except dot and minus
  const cleaned = string.replace(/[^\d.-]/g, '');
  const number = parseFloat(cleaned);
  
  return isNaN(number) ? null : number;
};

/**
 * Round number to specified decimals
 */
export const round = (number, decimals = 0) => {
  if (number === null || number === undefined) return null;
  const factor = Math.pow(10, decimals);
  return Math.round(number * factor) / factor;
};

/**
 * Floor number to specified decimals
 */
export const floor = (number, decimals = 0) => {
  if (number === null || number === undefined) return null;
  const factor = Math.pow(10, decimals);
  return Math.floor(number * factor) / factor;
};

/**
 * Ceil number to specified decimals
 */
export const ceil = (number, decimals = 0) => {
  if (number === null || number === undefined) return null;
  const factor = Math.pow(10, decimals);
  return Math.ceil(number * factor) / factor;
};

/**
 * Clamp number between min and max
 */
export const clamp = (number, min, max) => {
  return Math.min(Math.max(number, min), max);
};

/**
 * Check if number is within range
 */
export const inRange = (number, min, max) => {
  return number >= min && number <= max;
};

/**
 * Generate range of numbers
 */
export const range = (start, end, step = 1) => {
  const result = [];
  
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  
  return result;
};

/**
 * Get random number between min and max
 */
export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get random float between min and max
 */
export const randomFloat = (min, max, decimals = 2) => {
  const value = Math.random() * (max - min) + min;
  return round(value, decimals);
};

/**
 * Check if number is even
 */
export const isEven = (number) => {
  return number % 2 === 0;
};

/**
 * Check if number is odd
 */
export const isOdd = (number) => {
  return number % 2 !== 0;
};

/**
 * Check if number is integer
 */
export const isInteger = (number) => {
  return Number.isInteger(number);
};

/**
 * Check if number is float
 */
export const isFloat = (number) => {
  return Number(number) === number && number % 1 !== 0;
};

/**
 * Get percentage
 */
export const percentage = (value, total, decimals = 1) => {
  if (total === 0) return 0;
  return round((value / total) * 100, decimals);
};

/**
 * Get percentage change
 */
export const percentageChange = (oldValue, newValue, decimals = 1) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return round(((newValue - oldValue) / oldValue) * 100, decimals);
};

/**
 * Format as percentage
 */
export const toPercentage = (value, decimals = 1) => {
  return `${round(value, decimals)}%`;
};

/**
 * Format as currency (IDR)
 */
export const toCurrency = (value, currency = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format as ordinal (1st, 2nd, 3rd)
 */
export const toOrdinal = (number) => {
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
 * Format as abbreviated (1K, 1M, 1B)
 */
export const toAbbreviated = (number, decimals = 1) => {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(decimals) + 'B';
  }
  if (number >= 1e6) {
    return (number / 1e6).toFixed(decimals) + 'M';
  }
  if (number >= 1e3) {
    return (number / 1e3).toFixed(decimals) + 'K';
  }
  
  return number.toString();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format as distance (km)
 */
export const formatDistance = (km) => {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} m`;
  }
  return `${km.toFixed(1)} km`;
};

/**
 * Format as duration (minutes)
 */
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}j ${mins}m`;
  }
  if (hours > 0) {
    return `${hours}j`;
  }
  return `${mins}m`;
};

/**
 * Sum array of numbers
 */
export const sum = (numbers) => {
  return numbers.reduce((acc, num) => acc + num, 0);
};

/**
 * Average of numbers
 */
export const average = (numbers) => {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
};

/**
 * Min of numbers
 */
export const min = (numbers) => {
  return Math.min(...numbers);
};

/**
 * Max of numbers
 */
export const max = (numbers) => {
  return Math.max(...numbers);
};

/**
 * Factorial
 */
export const factorial = (n) => {
  if (n < 0) return undefined;
  if (n === 0) return 1;
  return n * factorial(n - 1);
};

/**
 * Fibonacci
 */
export const fibonacci = (n) => {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

/**
 * Check if prime
 */
export const isPrime = (n) => {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  
  return true;
};

/**
 * Get prime factors
 */
export const primeFactors = (n) => {
  const factors = [];
  let num = n;
  
  for (let i = 2; i <= num; i++) {
    while (num % i === 0) {
      factors.push(i);
      num /= i;
    }
  }
  
  return factors;
};

/**
 * Greatest Common Divisor
 */
export const gcd = (a, b) => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

/**
 * Least Common Multiple
 */
export const lcm = (a, b) => {
  return (a * b) / gcd(a, b);
};