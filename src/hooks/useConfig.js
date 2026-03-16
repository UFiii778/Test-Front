// =====================================================
// FILE: frontend/src/hooks/useConfig.js
// DESKRIPSI: Configuration hook
// =====================================================

import { useContext, useCallback } from 'react';
import { ConfigContext } from '../contexts/ConfigContext';

export const useConfig = () => {
  const context = useContext(ConfigContext);
  
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  
  return context;
};

// Convenience hooks
export const useConfigValue = (key, defaultValue = null) => {
  const { get } = useConfig();
  return get(key, defaultValue);
};

export const useFeatureEnabled = (feature) => {
  const { isEnabled } = useConfig();
  return isEnabled(feature);
};

export const useApiUrl = () => {
  const { getApiUrl } = useConfig();
  return getApiUrl;
};

export const useSocketUrl = () => {
  const { getSocketUrl } = useConfig();
  return getSocketUrl;
};

export const useEnvironment = () => {
  const { getEnvironment, isDevelopment, isProduction, isTesting } = useConfig();
  return { 
    environment: getEnvironment(), 
    isDev: isDevelopment(), 
    isProd: isProduction(), 
    isTest: isTesting() 
  };
};

export const useAppInfo = () => {
  const { getAppName, getVersion } = useConfig();
  return { name: getAppName(), version: getVersion() };
};

export const useContactInfo = () => {
  const { getContact } = useConfig();
  return getContact();
};

export const useSocialMedia = () => {
  const { getSocialMedia } = useConfig();
  return getSocialMedia();
};

export const usePaginationDefaults = () => {
  const { getPaginationDefaults } = useConfig();
  return getPaginationDefaults();
};

export const useUploadLimits = () => {
  const { getUploadLimits } = useConfig();
  return getUploadLimits();
};

export const useDateFormats = () => {
  const { getDateFormats } = useConfig();
  return getDateFormats();
};

export const useMapConfig = () => {
  const { getMapConfig } = useConfig();
  return getMapConfig();
};

export const useBloodTypes = () => {
  const { getBloodTypes } = useConfig();
  return getBloodTypes();
};

export const useUrgencyLevels = () => {
  const { getUrgencyLevels } = useConfig();
  return getUrgencyLevels();
};