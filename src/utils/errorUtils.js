// =====================================================
// FILE: frontend/src/utils/errorUtils.js
// DESKRIPSI: Error handling utilities
// =====================================================

/**
 * Custom error class
 */
export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', status = 500, data = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Network error class
 */
export class NetworkError extends Error {
  constructor(message = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
    this.code = 'NETWORK_ERROR';
    this.status = 0;
  }
}

/**
 * Authentication error class
 */
export class AuthError extends Error {
  constructor(message = 'Authentication failed', code = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.status = 401;
  }
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(errors = {}, message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
    this.status = 422;
    this.errors = errors;
  }
}

/**
 * Format error for display
 */
export const formatError = (error) => {
  if (error instanceof ValidationError) {
    return {
      message: error.message,
      errors: error.errors,
      code: error.code
    };
  }

  if (error instanceof AuthError) {
    return {
      message: error.message,
      code: error.code
    };
  }

  if (error instanceof NetworkError) {
    return {
      message: 'Koneksi internet bermasalah. Silakan cek koneksi Anda.',
      code: 'NETWORK_ERROR'
    };
  }

  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data?.message || 'Terjadi kesalahan pada server',
      code: error.response.data?.code || 'SERVER_ERROR',
      status: error.response.status,
      data: error.response.data
    };
  }

  if (error.request) {
    // Request made but no response
    return {
      message: 'Tidak dapat terhubung ke server. Silakan coba lagi.',
      code: 'CONNECTION_ERROR'
    };
  }

  // Something else happened
  return {
    message: error.message || 'Terjadi kesalahan yang tidak diketahui',
    code: error.code || 'UNKNOWN_ERROR'
  };
};

/**
 * Log error to console (development) or service (production)
 */
export const logError = (error, context = {}) => {
  const formattedError = formatError(error);

  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Details');
    console.error('Error:', error);
    console.error('Formatted:', formattedError);
    console.error('Context:', context);
    console.groupEnd();
  } else {
    // Send to error tracking service (Sentry, etc.)
    // Sentry.captureException(error, { extra: context });
  }
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error) => {
  const formatted = formatError(error);

  const messages = {
    'NETWORK_ERROR': 'Koneksi internet bermasalah. Silakan periksa koneksi Anda.',
    'CONNECTION_ERROR': 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.',
    'AUTH_ERROR': 'Sesi Anda telah berakhir. Silakan login kembali.',
    'UNAUTHORIZED': 'Anda tidak memiliki akses ke resource ini.',
    'FORBIDDEN': 'Akses ditolak.',
    'NOT_FOUND': 'Data yang Anda cari tidak ditemukan.',
    'VALIDATION_ERROR': 'Data yang Anda masukkan tidak valid.',
    'DUPLICATE_ENTRY': 'Data sudah ada.',
    'INTERNAL_ERROR': 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
    'TIMEOUT_ERROR': 'Waktu permintaan habis. Silakan coba lagi.',
    'RATE_LIMIT_EXCEEDED': 'Terlalu banyak permintaan. Silakan coba lagi nanti.'
  };

  return messages[formatted.code] || formatted.message || 'Terjadi kesalahan. Silakan coba lagi.';
};

/**
 * Handle API error
 */
export const handleApiError = (error, defaultMessage = 'Terjadi kesalahan') => {
  logError(error);
  return {
    success: false,
    error: getUserFriendlyMessage(error),
    code: error.code || 'UNKNOWN_ERROR'
  };
};

/**
 * Create validation error from validation errors
 */
export const createValidationError = (errors) => {
  return new ValidationError(errors);
};

/**
 * Check if error is of specific type
 */
export const isErrorType = (error, type) => {
  return error?.name === type || error?.code === type;
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error) => {
  return isErrorType(error, 'NetworkError') || !navigator.onLine;
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error) => {
  return isErrorType(error, 'AuthError') || error?.status === 401 || error?.status === 403;
};

/**
 * Check if error is validation error
 */
export const isValidationError = (error) => {
  return isErrorType(error, 'ValidationError') || error?.status === 422;
};

/**
 * Check if error is not found error
 */
export const isNotFoundError = (error) => {
  return error?.status === 404;
};

/**
 * Check if error is server error
 */
export const isServerError = (error) => {
  return error?.status >= 500;
};

/**
 * Retry function on error
 */
export const retryOnError = async (fn, maxAttempts = 3, delay = 1000) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      if (isNetworkError(error)) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      } else {
        throw error;
      }
    }
  }
};

/**
 * Fallback on error
 */
export const fallbackOnError = async (fn, fallbackValue) => {
  try {
    return await fn();
  } catch {
    return fallbackValue;
  }
};

/**
 * Create error boundary fallback component
 */
export const createErrorFallback = (error, resetError) => {
  return {
    error: getUserFriendlyMessage(error),
    reset: resetError
  };
};

/**
 * Parse error stack trace
 */
export const parseStackTrace = (error) => {
  if (!error.stack) return [];

  return error.stack
    .split('\n')
    .slice(1)
    .map(line => line.trim())
    .filter(line => line);
};

/**
 * Get error status code
 */
export const getErrorStatus = (error) => {
  return error?.status || error?.response?.status || 500;
};

/**
 * Get error code
 */
export const getErrorCode = (error) => {
  return error?.code || error?.response?.data?.code || 'UNKNOWN_ERROR';
};

/**
 * Get error data
 */
export const getErrorData = (error) => {
  return error?.data || error?.response?.data || null;
};

/**
 * Check if error should be reported
 */
export const shouldReportError = (error) => {
  const status = getErrorStatus(error);
  // Don't report client errors (4xx) except validation errors
  if (status >= 400 && status < 500 && status !== 422) {
    return false;
  }
  return true;
};

/**
 * Report error to service
 */
export const reportError = (error, context = {}) => {
  if (!shouldReportError(error)) return;

  logError(error, context);
  // Send to error tracking service
};

/**
 * Clear error
 */
export const clearError = () => {
  return null;
};