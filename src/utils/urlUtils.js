// =====================================================
// FILE: frontend/src/utils/urlUtils.js
// DESKRIPSI: URL utilities
// =====================================================

/**
 * Get query parameters from URL
 */
export const getQueryParams = (url = window.location.href) => {
  const params = {};
  const searchParams = new URL(url).searchParams;
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
};

/**
 * Get query parameter by name
 */
export const getQueryParam = (name, url = window.location.href) => {
  const searchParams = new URL(url).searchParams;
  return searchParams.get(name);
};

/**
 * Set query parameter
 */
export const setQueryParam = (name, value, url = window.location.href) => {
  const urlObj = new URL(url);
  urlObj.searchParams.set(name, value);
  return urlObj.toString();
};

/**
 * Remove query parameter
 */
export const removeQueryParam = (name, url = window.location.href) => {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(name);
  return urlObj.toString();
};

/**
 * Build URL with query parameters
 */
export const buildUrl = (base, params = {}) => {
  const url = new URL(base, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

/**
 * Parse URL
 */
export const parseUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return {
      protocol: urlObj.protocol,
      host: urlObj.host,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      origin: urlObj.origin,
      params: getQueryParams(url)
    };
  } catch {
    return null;
  }
};

/**
 * Check if URL is valid
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
 * Check if URL is absolute
 */
export const isAbsoluteUrl = (url) => {
  return /^https?:\/\//i.test(url);
};

/**
 * Get base URL
 */
export const getBaseUrl = (url = window.location.href) => {
  const urlObj = new URL(url);
  return `${urlObj.protocol}//${urlObj.host}`;
};

/**
 * Get path without query parameters
 */
export const getPath = (url = window.location.href) => {
  const urlObj = new URL(url);
  return urlObj.pathname;
};

/**
 * Add trailing slash
 */
export const addTrailingSlash = (url) => {
  return url.endsWith('/') ? url : `${url}/`;
};

/**
 * Remove trailing slash
 */
export const removeTrailingSlash = (url) => {
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

/**
 * Add query parameters to URL
 */
export const addQueryParams = (url, params) => {
  const urlObj = new URL(url);
  
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, value);
  });
  
  return urlObj.toString();
};

/**
 * Replace query parameters
 */
export const replaceQueryParams = (url, params) => {
  const urlObj = new URL(url);
  urlObj.search = '';
  
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, value);
  });
  
  return urlObj.toString();
};

/**
 * Get URL segments
 */
export const getUrlSegments = (url = window.location.href) => {
  const urlObj = new URL(url);
  return urlObj.pathname.split('/').filter(Boolean);
};

/**
 * Get last URL segment
 */
export const getLastUrlSegment = (url = window.location.href) => {
  const segments = getUrlSegments(url);
  return segments[segments.length - 1] || '';
};

/**
 * Check if URL matches pattern
 */
export const urlMatches = (url, pattern) => {
  if (typeof pattern === 'string') {
    return url === pattern;
  }
  
  if (pattern instanceof RegExp) {
    return pattern.test(url);
  }
  
  return false;
};

/**
 * Normalize URL
 */
export const normalizeUrl = (url) => {
  let normalized = url.trim().toLowerCase();
  
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }
  
  try {
    const urlObj = new URL(normalized);
    return urlObj.toString();
  } catch {
    return null;
  }
};

/**
 * Get URL without protocol
 */
export const withoutProtocol = (url) => {
  return url.replace(/^https?:\/\//i, '');
};

/**
 * Get URL without www
 */
export const withoutWww = (url) => {
  return url.replace(/^www\./i, '');
};

/**
 * Get domain from URL
 */
export const getDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./i, '');
  } catch {
    return null;
  }
};

/**
 * Check if URLs are same origin
 */
export const isSameOrigin = (url1, url2) => {
  try {
    const origin1 = new URL(url1).origin;
    const origin2 = new URL(url2).origin;
    return origin1 === origin2;
  } catch {
    return false;
  }
};

/**
 * Encode URL component safely
 */
export const safeEncodeURI = (str) => {
  try {
    return encodeURIComponent(str);
  } catch {
    return str;
  }
};

/**
 * Decode URL component safely
 */
export const safeDecodeURI = (str) => {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
};

/**
 * Get URL hash without #
 */
export const getHash = (url = window.location.href) => {
  const urlObj = new URL(url);
  return urlObj.hash.replace(/^#/, '');
};

/**
 * Set URL hash
 */
export const setHash = (hash, url = window.location.href) => {
  const urlObj = new URL(url);
  urlObj.hash = hash.startsWith('#') ? hash : `#${hash}`;
  return urlObj.toString();
};

/**
 * Redirect to URL
 */
export const redirect = (url, replace = false) => {
  if (replace) {
    window.location.replace(url);
  } else {
    window.location.href = url;
  }
};

/**
 * Open URL in new tab
 */
export const openInNewTab = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Get current URL
 */
export const getCurrentUrl = () => {
  return window.location.href;
};

/**
 * Get current path
 */
export const getCurrentPath = () => {
  return window.location.pathname;
};

/**
 * Reload page
 */
export const reload = (forceGet = false) => {
  window.location.reload(forceGet);
};

/**
 * Go back
 */
export const goBack = () => {
  window.history.back();
};

/**
 * Go forward
 */
export const goForward = () => {
  window.history.forward();
};

/**
 * Push state
 */
export const pushState = (state, title, url) => {
  window.history.pushState(state, title, url);
};

/**
 * Replace state
 */
export const replaceState = (state, title, url) => {
  window.history.replaceState(state, title, url);
};