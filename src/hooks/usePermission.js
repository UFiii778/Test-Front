// =====================================================
// FILE: frontend/src/hooks/usePermission.js
// DESKRIPSI: Permission hook
// =====================================================

import { useState, useEffect, useCallback } from 'react';

export const usePermission = (permissionName) => {
  const [status, setStatus] = useState('prompt');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.permissions) {
      setError('Permissions API tidak didukung oleh browser ini');
      return;
    }

    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: permissionName });
        setStatus(result.state);

        result.addEventListener('change', () => {
          setStatus(result.state);
        });
      } catch (err) {
        setError(err.message);
      }
    };

    checkPermission();
  }, [permissionName]);

  const requestPermission = useCallback(async () => {
    if (!navigator.permissions) {
      setError('Permissions API tidak didukung oleh browser ini');
      return false;
    }

    try {
      const result = await navigator.permissions.query({ name: permissionName });
      setStatus(result.state);
      return result.state === 'granted';
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [permissionName]);

  return {
    status,
    error,
    isGranted: status === 'granted',
    isDenied: status === 'denied',
    isPrompt: status === 'prompt',
    requestPermission
  };
};

// Notification permission hook
export const useNotificationPermission = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = useCallback(async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return false;
    }
  }, []);

  return {
    permission,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
    isPrompt: permission === 'default',
    requestPermission
  };
};

// Geolocation permission hook
export const useGeolocationPermission = () => {
  return usePermission('geolocation');
};

// Camera permission hook
export const useCameraPermission = () => {
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    const checkCamera = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasCamera(videoDevices.length > 0);
    };

    checkCamera();
  }, []);

  const permission = usePermission('camera');

  return {
    ...permission,
    hasCamera
  };
};

// Microphone permission hook
export const useMicrophonePermission = () => {
  const [hasMicrophone, setHasMicrophone] = useState(false);

  useEffect(() => {
    const checkMicrophone = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      setHasMicrophone(audioDevices.length > 0);
    };

    checkMicrophone();
  }, []);

  const permission = usePermission('microphone');

  return {
    ...permission,
    hasMicrophone
  };
};

// Push permission hook
export const usePushPermission = () => {
  return usePermission('push');
};

// Persistent storage permission hook
export const usePersistentStoragePermission = () => {
  const [isPersistent, setIsPersistent] = useState(false);

  useEffect(() => {
    const checkPersistent = async () => {
      if (navigator.storage && navigator.storage.persisted) {
        const persisted = await navigator.storage.persisted();
        setIsPersistent(persisted);
      }
    };

    checkPersistent();
  }, []);

  const requestPersistent = useCallback(async () => {
    if (navigator.storage && navigator.storage.persist) {
      const granted = await navigator.storage.persist();
      setIsPersistent(granted);
      return granted;
    }
    return false;
  }, []);

  return {
    isPersistent,
    requestPersistent
  };
};