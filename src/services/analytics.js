// =====================================================
// FILE: frontend/src/services/analytics.js
// DESKRIPSI: Analytics service
// =====================================================

class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.userId = null;
    this.properties = {};
    this.queue = [];
  }

  /**
   * Initialize analytics
   */
  init(userId = null, properties = {}) {
    this.userId = userId;
    this.properties = properties;
    this.initialized = true;

    // Process queued events
    this.processQueue();

    // Track initial page view
    this.trackPageView();
  }

  /**
   * Process queued events
   */
  processQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      this.track(event.name, event.properties);
    }
  }

  /**
   * Track event
   */
  track(eventName, properties = {}) {
    if (!this.initialized) {
      // Queue event for later
      this.queue.push({ name: eventName, properties });
      return;
    }

    const event = {
      event: eventName,
      userId: this.userId,
      properties: {
        ...this.properties,
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language
      }
    };

    // Send to analytics endpoint
    this.sendToServer(event);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics event:', event);
    }
  }

  /**
   * Track page view
   */
  trackPageView(properties = {}) {
    this.track('page_view', {
      title: document.title,
      ...properties
    });
  }

  /**
   * Track user action
   */
  trackAction(action, properties = {}) {
    this.track('user_action', {
      action,
      ...properties
    });
  }

  /**
   * Track donation
   */
  trackDonation(donationData) {
    this.track('donation', donationData);
  }

  /**
   * Track request
   */
  trackRequest(requestData) {
    this.track('request', requestData);
  }

  /**
   * Track appointment
   */
  trackAppointment(appointmentData) {
    this.track('appointment', appointmentData);
  }

  /**
   * Track search
   */
  trackSearch(searchTerm, results) {
    this.track('search', {
      term: searchTerm,
      resultsCount: results?.length || 0
    });
  }

  /**
   * Track error
   */
  trackError(error, context = {}) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }

  /**
   * Track performance
   */
  trackPerformance(metric, value, context = {}) {
    this.track('performance', {
      metric,
      value,
      ...context
    });
  }

  /**
   * Track feature usage
   */
  trackFeature(feature, action, properties = {}) {
    this.track('feature_usage', {
      feature,
      action,
      ...properties
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties) {
    this.properties = {
      ...this.properties,
      ...properties
    };

    this.track('identify', properties);
  }

  /**
   * Set user ID
   */
  setUserId(userId) {
    this.userId = userId;
    this.track('identify', { userId });
  }

  /**
   * Clear user data
   */
  clearUser() {
    this.userId = null;
    this.properties = {};
    this.track('logout');
  }

  /**
   * Send event to server
   */
  sendToServer(event) {
    // Use fetch with keepalive to ensure delivery
    if (navigator.sendBeacon) {
      // Use Beacon API for reliable delivery
      const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    } else {
      // Fallback to fetch
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event),
        keepalive: true
      }).catch(error => {
        console.error('Failed to send analytics:', error);
      });
    }
  }

  /**
   * Start timing an operation
   */
  startTimer(name) {
    if (!this.timers) this.timers = {};
    this.timers[name] = performance.now();
  }

  /**
   * End timing an operation
   */
  endTimer(name, properties = {}) {
    if (this.timers && this.timers[name]) {
      const duration = performance.now() - this.timers[name];
      this.trackPerformance(name, duration, properties);
      delete this.timers[name];
      return duration;
    }
    return null;
  }

  /**
   * Track click
   */
  trackClick(elementId, elementClass, elementText, properties = {}) {
    this.trackAction('click', {
      elementId,
      elementClass,
      elementText,
      ...properties
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formId, formName, success = true, properties = {}) {
    this.trackAction('form_submit', {
      formId,
      formName,
      success,
      ...properties
    });
  }

  /**
   * Track login
   */
  trackLogin(method, success, properties = {}) {
    this.trackAction('login', {
      method,
      success,
      ...properties
    });
  }

  /**
   * Track signup
   */
  trackSignup(method, properties = {}) {
    this.trackAction('signup', {
      method,
      ...properties
    });
  }

  /**
   * Track share
   */
  trackShare(platform, contentId, contentType, properties = {}) {
    this.trackAction('share', {
      platform,
      contentId,
      contentType,
      ...properties
    });
  }

  /**
   * Track download
   */
  trackDownload(fileName, fileType, fileSize, properties = {}) {
    this.trackAction('download', {
      fileName,
      fileType,
      fileSize,
      ...properties
    });
  }

  /**
   * Track outbound link
   */
  trackOutboundLink(url, linkText, properties = {}) {
    this.trackAction('outbound_link', {
      url,
      linkText,
      ...properties
    });
  }

  /**
   * Track video interaction
   */
  trackVideo(videoId, action, properties = {}) {
    this.trackAction('video', {
      videoId,
      action,
      ...properties
    });
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(depth, properties = {}) {
    this.trackAction('scroll_depth', {
      depth,
      ...properties
    });
  }

  /**
   * Track time on page
   */
  trackTimeOnPage(seconds, properties = {}) {
    this.trackAction('time_on_page', {
      seconds,
      ...properties
    });
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;