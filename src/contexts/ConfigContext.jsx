// =====================================================
// FILE: frontend/src/contexts/ConfigContext.jsx
// DESKRIPSI: Configuration context provider
// =====================================================

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import configService from '../services/config';

// Create context
const ConfigContext = createContext(null);

// Custom hook to use config context
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

// Provider component
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load configuration
  useEffect(() => {
    loadConfig();
  }, []);

  // Load config from service
  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedConfig = await configService.load();
      setConfig(loadedConfig);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load config:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get config value
  const get = useCallback((key, defaultValue = null) => {
    return configService.get(key, defaultValue);
  }, []);

  // Check if feature is enabled
  const isEnabled = useCallback((feature) => {
    return configService.isEnabled(feature);
  }, []);

  // Get API URL
  const getApiUrl = useCallback((path = '') => {
    return configService.getApiUrl(path);
  }, []);

  // Get socket URL
  const getSocketUrl = useCallback(() => {
    return configService.getSocketUrl();
  }, []);

  // Get environment info
  const getEnvironment = useCallback(() => {
    return configService.getEnvironment();
  }, []);

  const isDevelopment = useCallback(() => {
    return configService.isDevelopment();
  }, []);

  const isProduction = useCallback(() => {
    return configService.isProduction();
  }, []);

  const isTesting = useCallback(() => {
    return configService.isTesting();
  }, []);

  // Get app info
  const getAppName = useCallback(() => {
    return configService.getAppName();
  }, []);

  const getVersion = useCallback(() => {
    return configService.getVersion();
  }, []);

  // Get contact info
  const getContact = useCallback(() => {
    return configService.getContact();
  }, []);

  // Get social media links
  const getSocialMedia = useCallback(() => {
    return configService.getSocialMedia();
  }, []);

  // Get pagination defaults
  const getPaginationDefaults = useCallback(() => {
    return configService.getPaginationDefaults();
  }, []);

  // Get upload limits
  const getUploadLimits = useCallback(() => {
    return configService.getUploadLimits();
  }, []);

  // Get date formats
  const getDateFormats = useCallback(() => {
    return configService.getDateFormats();
  }, []);

  // Get map configuration
  const getMapConfig = useCallback(() => {
    return configService.getMapConfig();
  }, []);

  // Get notification defaults
  const getNotificationDefaults = useCallback(() => {
    return configService.getNotificationDefaults();
  }, []);

  // Get chatbot config
  const getChatbotConfig = useCallback(() => {
    return configService.getChatbotConfig();
  }, []);

  // Get blood types
  const getBloodTypes = useCallback(() => {
    return configService.getBloodTypes();
  }, []);

  // Get urgency levels
  const getUrgencyLevels = useCallback(() => {
    return configService.getUrgencyLevels();
  }, []);

  // Reload configuration
  const reload = useCallback(async () => {
    await configService.reload();
    await loadConfig();
  }, []);

  // Context value
  const value = {
    config,
    loading,
    error,
    get,
    isEnabled,
    getApiUrl,
    getSocketUrl,
    getEnvironment,
    isDevelopment,
    isProduction,
    isTesting,
    getAppName,
    getVersion,
    getContact,
    getSocialMedia,
    getPaginationDefaults,
    getUploadLimits,
    getDateFormats,
    getMapConfig,
    getNotificationDefaults,
    getChatbotConfig,
    getBloodTypes,
    getUrgencyLevels,
    reload
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};