// =====================================================
// FILE: frontend/src/utils/analytics.js
// DESKRIPSI: Analytics utilities
// =====================================================

import { logger } from './logger';

// Analytics providers
const providers = {
  google: process.env.REACT_APP_GA_ID,
  facebook: process.env.REACT_APP_FB_PIXEL_ID
};

/**
 * Track page view
 */
export const trackPageView = (path) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Analytics: Page View', { path });
    return;
  }

  // Google Analytics
  if (providers.google && window.gtag) {
    window.gtag('config', providers.google, {
      page_path: path
    });
  }

  // Facebook Pixel
  if (providers.facebook && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Track event
 */
export const trackEvent = (category, action, label = null, value = null) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Analytics: Event', { category, action, label, value });
    return;
  }

  // Google Analytics
  if (providers.google && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }

  // Facebook Pixel
  if (providers.facebook && window.fbq) {
    window.fbq('track', action, {
      content_category: category,
      content_name: label,
      value: value
    });
  }
};

/**
 * Track user action
 */
export const trackUserAction = (action, data = {}) => {
  trackEvent('User Action', action, null, data);
};

/**
 * Track donation
 */
export const trackDonation = (donationData) => {
  trackEvent('Donation', 'Donate', donationData.bloodType, donationData.quantity);
};

/**
 * Track request
 */
export const trackRequest = (requestData) => {
  trackEvent('Request', 'Create Request', requestData.bloodType, requestData.quantity);
};

/**
 * Track appointment
 */
export const trackAppointment = (appointmentData) => {
  trackEvent('Appointment', 'Schedule', appointmentData.hospitalName);
};

/**
 * Track search
 */
export const trackSearch = (searchTerm, results) => {
  trackEvent('Search', 'Search', searchTerm, results?.length || 0);
};

/**
 * Track error
 */
export const trackError = (error, context = {}) => {
  trackEvent('Error', 'Error', error.message, error.code);
};

/**
 * Track performance
 */
export const trackPerformance = (metric, value, context = {}) => {
  trackEvent('Performance', metric, null, value);
};

/**
 * Track feature usage
 */
export const trackFeature = (feature, action, data = {}) => {
  trackEvent('Feature', `${feature}_${action}`, null, data);
};

/**
 * Track login
 */
export const trackLogin = (method, success) => {
  trackEvent('Auth', success ? 'Login Success' : 'Login Failed', method);
};

/**
 * Track signup
 */
export const trackSignup = (method) => {
  trackEvent('Auth', 'Signup', method);
};

/**
 * Track share
 */
export const trackShare = (platform, contentType, contentId) => {
  trackEvent('Share', 'Share', platform, { contentType, contentId });
};

/**
 * Track download
 */
export const trackDownload = (fileName, fileType) => {
  trackEvent('Download', 'Download', fileName, fileType);
};

/**
 * Track outbound link
 */
export const trackOutboundLink = (url, linkText) => {
  trackEvent('Outbound Link', 'Click', url, linkText);
};

/**
 * Track video
 */
export const trackVideo = (videoId, action, currentTime) => {
  trackEvent('Video', action, videoId, currentTime);
};

/**
 * Set user properties
 */
export const setUserProperties = (properties) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Analytics: Set User Properties', properties);
    return;
  }

  // Google Analytics
  if (providers.google && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};

/**
 * Set user ID
 */
export const setUserId = (userId) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Analytics: Set User ID', { userId });
    return;
  }

  // Google Analytics
  if (providers.google && window.gtag) {
    window.gtag('config', providers.google, {
      user_id: userId
    });
  }
};

/**
 * Track ecommerce
 */
export const trackEcommerce = (action, data) => {
  trackEvent('Ecommerce', action, null, data);
};

/**
 * Track purchase
 */
export const trackPurchase = (transactionId, value, currency = 'IDR') => {
  trackEvent('Ecommerce', 'Purchase', transactionId, value);
};

/**
 * Track refund
 */
export const trackRefund = (transactionId, value) => {
  trackEvent('Ecommerce', 'Refund', transactionId, value);
};

/**
 * Track add to cart
 */
export const trackAddToCart = (productId, quantity, price) => {
  trackEvent('Ecommerce', 'AddToCart', productId, { quantity, price });
};

/**
 * Track remove from cart
 */
export const trackRemoveFromCart = (productId, quantity) => {
  trackEvent('Ecommerce', 'RemoveFromCart', productId, quantity);
};

/**
 * Track checkout
 */
export const trackCheckout = (step, option) => {
  trackEvent('Ecommerce', 'Checkout', step, option);
};

/**
 * Track form submission
 */
export const trackFormSubmit = (formId, success) => {
  trackEvent('Form', success ? 'Submit Success' : 'Submit Failed', formId);
};

/**
 * Track file upload
 */
export const trackFileUpload = (fileName, fileSize, success) => {
  trackEvent('File', success ? 'Upload Success' : 'Upload Failed', fileName, fileSize);
};