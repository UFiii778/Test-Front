// =====================================================
// FILE: frontend/src/hooks/useNetworkState.js
// DESKRIPSI: Network state hook
// =====================================================

import { useState, useEffect, useCallback } from 'react';

export const useNetworkState = () => {
  const [networkState, setNetworkState] = useState({
    online: navigator.onLine,
    downlink: null,
    downlinkMax: null,
    effectiveType: null,
    rtt: null,
    saveData: false,
    type: null
  });

  useEffect(() => {
    const updateNetworkState = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      setNetworkState({
        online: navigator.onLine,
        downlink: connection?.downlink || null,
        downlinkMax: connection?.downlinkMax || null,
        effectiveType: connection?.effectiveType || null,
        rtt: connection?.rtt || null,
        saveData: connection?.saveData || false,
        type: connection?.type || null
      });
    };

    const handleOnline = () => {
      setNetworkState(prev => ({ ...prev, online: true }));
    };

    const handleOffline = () => {
      setNetworkState(prev => ({ ...prev, online: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateNetworkState);
      updateNetworkState();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', updateNetworkState);
      }
    };
  }, []);

  const isSlowConnection = useCallback(() => {
    const { effectiveType, downlink } = networkState;
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return true;
    if (downlink && downlink < 0.5) return true;
    
    return false;
  }, [networkState]);

  const isMobileConnection = useCallback(() => {
    const { type } = networkState;
    return type === 'cellular' || type === 'bluetooth' || type === 'wimax';
  }, [networkState]);

  return {
    ...networkState,
    isSlow: isSlowConnection(),
    isMobile: isMobileConnection(),
    isSlowConnection,
    isMobileConnection
  };
};

// Online status hook
export const useOnlineStatus = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
};

// Network speed hook
export const useNetworkSpeed = () => {
  const [speed, setSpeed] = useState(null);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) return;

    const updateSpeed = () => {
      setSpeed({
        downlink: connection.downlink,
        effectiveType: connection.effectiveType,
        rtt: connection.rtt
      });
    };

    connection.addEventListener('change', updateSpeed);
    updateSpeed();

    return () => {
      connection.removeEventListener('change', updateSpeed);
    };
  }, []);

  return speed;
};

// Network type hook
export const useNetworkType = () => {
  const [type, setType] = useState(null);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) return;

    const updateType = () => {
      setType(connection.type);
    };

    connection.addEventListener('change', updateType);
    updateType();

    return () => {
      connection.removeEventListener('change', updateType);
    };
  }, []);

  return type;
};

// Data saver hook
export const useDataSaver = () => {
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) return;

    const updateSaveData = () => {
      setSaveData(connection.saveData);
    };

    connection.addEventListener('change', updateSaveData);
    updateSaveData();

    return () => {
      connection.removeEventListener('change', updateSaveData);
    };
  }, []);

  return saveData;
};

// Connection quality hook
export const useConnectionQuality = () => {
  const networkState = useNetworkState();

  const quality = useCallback(() => {
    if (!networkState.online) return 'offline';
    
    const { effectiveType, downlink } = networkState;
    
    if (effectiveType === '4g' && downlink > 5) return 'excellent';
    if (effectiveType === '4g') return 'good';
    if (effectiveType === '3g') return 'fair';
    if (effectiveType === '2g') return 'poor';
    
    return 'unknown';
  }, [networkState]);

  return {
    ...networkState,
    quality: quality()
  };
};