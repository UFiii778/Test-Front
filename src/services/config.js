// =====================================================
// FILE: frontend/src/services/config.js
// DESKRIPSI: Configuration service
// =====================================================

class ConfigService {
  constructor() {
    this.config = {};
    this.loaded = false;
    this.loadingPromise = null;
  }

  /**
   * Load configuration from server
   */
  async load() {
    if (this.loaded) {
      return this.config;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.fetchConfig();
    return this.loadingPromise;
  }

  /**
   * Fetch configuration from server
   */
  async fetchConfig() {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      
      this.config = {
        ...this.getDefaultConfig(),
        ...data,
        ...this.getEnvConfig()
      };
      
      this.loaded = true;
      this.loadingPromise = null;
      
      return this.config;
    } catch (error) {
      console.error('Failed to load config:', error);
      
      // Fallback to default config
      this.config = this.getDefaultConfig();
      this.loaded = true;
      this.loadingPromise = null;
      
      return this.config;
    }
  }

  /**
   * Get default configuration
   */
  getDefaultConfig() {
    return {
      appName: 'DarahKita',
      appVersion: '1.0.0',
      apiUrl: 'http://localhost:5000/api',
      socketUrl: 'http://localhost:5000',
      environment: process.env.NODE_ENV || 'development',
      
      // Feature flags
      features: {
        chatbot: true,
        notifications: true,
        emergencyAlerts: true,
        donorCertificates: true,
        socialShare: true,
        darkMode: false
      },
      
      // Pagination defaults
      pagination: {
        defaultPageSize: 10,
        maxPageSize: 100,
        pageSizeOptions: [10, 25, 50, 100]
      },
      
      // Upload limits
      upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        maxProfileSize: 2 * 1024 * 1024, // 2MB
        maxCertificateSize: 10 * 1024 * 1024, // 10MB
        allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
        allowedDocumentTypes: ['application/pdf']
      },
      
      // Date formats
      dateFormats: {
        default: 'DD/MM/YYYY',
        full: 'DD MMMM YYYY',
        fullWithTime: 'DD MMMM YYYY HH:mm',
        time: 'HH:mm',
        relative: true
      },
      
      // Map configuration
      maps: {
        defaultCenter: { lat: -6.2088, lng: 106.8456 }, // Jakarta
        defaultZoom: 10,
        maxZoom: 18
      },
      
      // Notification defaults
      notifications: {
        defaultDuration: 5000,
        maxStack: 3,
        position: 'top-right'
      },
      
      // Chatbot configuration
      chatbot: {
        enabled: true,
        typingDelay: 1000,
        quickQuestions: [
          'Syarat donor darah',
          'Cek stok darah',
          'Lokasi donor terdekat',
          'Jadwal donor'
        ]
      },
      
      // Blood types
      bloodTypes: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      
      // Urgency levels
      urgencyLevels: ['biasa', 'urgent', 'gawat_darurat'],
      
      // Social media
      socialMedia: {
        facebook: 'https://facebook.com/darahkita',
        twitter: 'https://twitter.com/darahkita',
        instagram: 'https://instagram.com/darahkita',
        youtube: 'https://youtube.com/darahkita'
      },
      
      // Contact info
      contact: {
        email: 'info@darahkita.id',
        phone: '021-1234567',
        emergencyPhone: '119',
        address: 'Jl. Kramat Raya No.47, Jakarta Pusat'
      }
    };
  }

  /**
   * Get environment configuration
   */
  getEnvConfig() {
    return {
      apiUrl: process.env.REACT_APP_API_URL,
      socketUrl: process.env.REACT_APP_SOCKET_URL,
      mapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      sentryDsn: process.env.REACT_APP_SENTRY_DSN,
      analyticsId: process.env.REACT_APP_ANALYTICS_ID
    };
  }

  /**
   * Get configuration value
   */
  get(key, defaultValue = null) {
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      if (value === undefined || value === null) {
        return defaultValue;
      }
      value = value[k];
    }
    
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Set configuration value
   */
  set(key, value) {
    const keys = key.split('.');
    let target = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!target[k] || typeof target[k] !== 'object') {
        target[k] = {};
      }
      target = target[k];
    }
    
    target[keys[keys.length - 1]] = value;
  }

  /**
   * Check if feature is enabled
   */
  isEnabled(feature) {
    return this.get(`features.${feature}`, false);
  }

  /**
   * Get API URL
   */
  getApiUrl(path = '') {
    const baseUrl = this.get('apiUrl', 'http://localhost:5000/api');
    return `${baseUrl}${path}`;
  }

  /**
   * Get socket URL
   */
  getSocketUrl() {
    return this.get('socketUrl', 'http://localhost:5000');
  }

  /**
   * Get environment
   */
  getEnvironment() {
    return this.get('environment', 'development');
  }

  /**
   * Check if development environment
   */
  isDevelopment() {
    return this.getEnvironment() === 'development';
  }

  /**
   * Check if production environment
   */
  isProduction() {
    return this.getEnvironment() === 'production';
  }

  /**
   * Check if testing environment
   */
  isTesting() {
    return this.getEnvironment() === 'test';
  }

  /**
   * Get app version
   */
  getVersion() {
    return this.get('appVersion', '1.0.0');
  }

  /**
   * Get app name
   */
  getAppName() {
    return this.get('appName', 'DarahKita');
  }

  /**
   * Get contact info
   */
  getContact() {
    return this.get('contact', {});
  }

  /**
   * Get social media links
   */
  getSocialMedia() {
    return this.get('socialMedia', {});
  }

  /**
   * Get pagination defaults
   */
  getPaginationDefaults() {
    return this.get('pagination', {});
  }

  /**
   * Get upload limits
   */
  getUploadLimits() {
    return this.get('upload', {});
  }

  /**
   * Get date formats
   */
  getDateFormats() {
    return this.get('dateFormats', {});
  }

  /**
   * Get map configuration
   */
  getMapConfig() {
    return this.get('maps', {});
  }

  /**
   * Get notification defaults
   */
  getNotificationDefaults() {
    return this.get('notifications', {});
  }

  /**
   * Get chatbot configuration
   */
  getChatbotConfig() {
    return this.get('chatbot', {});
  }

  /**
   * Get blood types
   */
  getBloodTypes() {
    return this.get('bloodTypes', []);
  }

  /**
   * Get urgency levels
   */
  getUrgencyLevels() {
    return this.get('urgencyLevels', []);
  }

  /**
   * Reload configuration
   */
  async reload() {
    this.loaded = false;
    return this.load();
  }

  /**
   * Reset to default configuration
   */
  reset() {
    this.config = this.getDefaultConfig();
    this.loaded = true;
  }

  /**
   * Get all configuration
   */
  getAll() {
    return { ...this.config };
  }
}

// Create singleton instance
const configService = new ConfigService();

export default configService;