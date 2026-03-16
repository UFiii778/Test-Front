// =====================================================
// FILE: frontend/src/utils/logger.js
// DESKRIPSI: Logging utilities
// =====================================================

// Log levels
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// Current log level (set from environment)
const currentLevel = process.env.NODE_ENV === 'production' 
  ? LOG_LEVELS.INFO 
  : LOG_LEVELS.DEBUG;

/**
 * Check if log level is enabled
 */
const isLevelEnabled = (level) => {
  return level >= currentLevel;
};

/**
 * Format log message
 */
const formatMessage = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  if (data) {
    return `${prefix} ${message}\n${JSON.stringify(data, null, 2)}`;
  }
  
  return `${prefix} ${message}`;
};

/**
 * Logger object
 */
export const logger = {
  debug: (message, data = null) => {
    if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return;
    console.debug(formatMessage('debug', message, data));
  },

  info: (message, data = null) => {
    if (!isLevelEnabled(LOG_LEVELS.INFO)) return;
    console.info(formatMessage('info', message, data));
  },

  warn: (message, data = null) => {
    if (!isLevelEnabled(LOG_LEVELS.WARN)) return;
    console.warn(formatMessage('warn', message, data));
  },

  error: (message, error = null, data = null) => {
    if (!isLevelEnabled(LOG_LEVELS.ERROR)) return;
    
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      code: error.code,
      ...data
    } : data;
    
    console.error(formatMessage('error', message, errorData));
  },

  group: (label) => {
    if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return;
    console.group(label);
  },

  groupEnd: () => {
    if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return;
    console.groupEnd();
  },

  time: (label) => {
    if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return;
    console.time(label);
  },

  timeEnd: (label) => {
    if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return;
    console.timeEnd(label);
  },

  table: (data) => {
    if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return;
    console.table(data);
  },

  trace: (message, data = null) => {
    if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return;
    console.trace(formatMessage('trace', message, data));
  }
};

/**
 * Performance logger
 */
export const perfLogger = {
  start: (label) => {
    if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return;
    performance.mark(`${label}-start`);
  },

  end: (label) => {
    if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return;
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const entries = performance.getEntriesByName(label);
    const duration = entries[entries.length - 1].duration;
    
    logger.debug(`Performance [${label}]: ${duration.toFixed(2)}ms`);
    
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
  },

  measure: async (label, fn) => {
    if (!isLevelEnabled(LOG_LEVELS.DEBUG)) return await fn();
    
    perfLogger.start(label);
    const result = await fn();
    perfLogger.end(label);
    return result;
  }
};

/**
 * Create scoped logger
 */
export const createScopedLogger = (scope) => {
  return {
    debug: (message, data = null) => logger.debug(`[${scope}] ${message}`, data),
    info: (message, data = null) => logger.info(`[${scope}] ${message}`, data),
    warn: (message, data = null) => logger.warn(`[${scope}] ${message}`, data),
    error: (message, error = null, data = null) => logger.error(`[${scope}] ${message}`, error, data)
  };
};

/**
 * Log API request
 */
export const logApiRequest = (method, url, data = null) => {
  logger.debug(`API Request: ${method} ${url}`, data);
};

/**
 * Log API response
 */
export const logApiResponse = (method, url, response, duration) => {
  logger.debug(`API Response: ${method} ${url} (${duration}ms)`, response);
};

/**
 * Log API error
 */
export const logApiError = (method, url, error, duration) => {
  logger.error(`API Error: ${method} ${url} (${duration}ms)`, error);
};

/**
 * Log user action
 */
export const logUserAction = (action, data = null) => {
  logger.info(`User Action: ${action}`, data);
};

/**
 * Log route change
 */
export const logRouteChange = (from, to) => {
  logger.info(`Route Change: ${from} -> ${to}`);
};

/**
 * Log state change
 */
export const logStateChange = (key, oldValue, newValue) => {
  logger.debug(`State Change: ${key}`, { from: oldValue, to: newValue });
};

/**
 * Log component lifecycle
 */
export const logLifecycle = (component, lifecycle, props = null) => {
  logger.debug(`Component [${component}] ${lifecycle}`, props);
};

/**
 * Log web vitals
 */
export const logWebVitals = (metric) => {
  logger.info(`Web Vitals: ${metric.name}`, {
    value: metric.value,
    rating: metric.rating
  });
};

/**
 * Log error to service
 */
export const logErrorToService = (error, context = {}) => {
  // Send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, { extra: context });
  }
  
  logger.error('Error reported to service', error, context);
};