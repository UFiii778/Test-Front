// =====================================================
// FILE: frontend/src/hooks/useOnlineStatus.js
// DESKRIPSI: Online status hook
// =====================================================

import { useState, useEffect } from 'react';

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

// Online status with details
export const useOnlineStatusWithDetails = () => {
  const [details, setDetails] = useState({
    online: navigator.onLine,
    lastOnline: navigator.onLine ? new Date() : null,
    lastOffline: !navigator.onLine ? new Date() : null,
    offlineDuration: 0
  });

  useEffect(() => {
    let offlineStart = !navigator.onLine ? Date.now() : null;
    let interval;

    const handleOnline = () => {
      setDetails(prev => ({
        ...prev,
        online: true,
        lastOnline: new Date(),
        offlineDuration: offlineStart ? Date.now() - offlineStart : 0
      }));
      offlineStart = null;
      
      if (interval) {
        clearInterval(interval);
      }
    };

    const handleOffline = () => {
      offlineStart = Date.now();
      
      setDetails(prev => ({
        ...prev,
        online: false,
        lastOffline: new Date()
      }));

      interval = setInterval(() => {
        setDetails(prev => ({
          ...prev,
          offlineDuration: Date.now() - offlineStart
        }));
      }, 1000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return details;
};

// Online status with reconnection
export const useOnlineWithReconnect = (reconnectInterval = 5000) => {
  const online = useOnlineStatus();
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  useEffect(() => {
    let timeout;

    if (!online && !reconnecting) {
      setReconnecting(true);
      
      const attemptReconnect = () => {
        setReconnectAttempt(prev => prev + 1);
        // Ping a reliable endpoint to check connection
        fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' })
          .then(() => {
            // If fetch succeeds, the browser will fire 'online' event
            setReconnecting(false);
            setReconnectAttempt(0);
          })
          .catch(() => {
            timeout = setTimeout(attemptReconnect, reconnectInterval);
          });
      };

      timeout = setTimeout(attemptReconnect, reconnectInterval);
    } else if (online && reconnecting) {
      setReconnecting(false);
      setReconnectAttempt(0);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [online, reconnecting, reconnectInterval]);

  return {
    online,
    reconnecting,
    reconnectAttempt
  };
};

// Online status with queue
export const useOnlineQueue = () => {
  const online = useOnlineStatus();
  const [queue, setQueue] = useState([]);

  const addToQueue = useCallback((item) => {
    setQueue(prev => [...prev, { ...item, id: Date.now() + Math.random() }]);
  }, []);

  const processQueue = useCallback(async (processor) => {
    if (queue.length === 0) return;

    const results = [];
    
    for (const item of queue) {
      try {
        const result = await processor(item);
        results.push({ item, result, success: true });
      } catch (error) {
        results.push({ item, error, success: false });
      }
    }

    setQueue([]);
    return results;
  }, [queue]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    queueLength: queue.length,
    addToQueue,
    processQueue,
    clearQueue
  };
};

// Online status with sync
export const useOnlineSync = (syncFunction, interval = 30000) => {
  const online = useOnlineStatus();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [pendingChanges, setPendingChanges] = useState([]);

  const addChange = useCallback((change) => {
    setPendingChanges(prev => [...prev, { ...change, timestamp: Date.now() }]);
  }, []);

  const sync = useCallback(async () => {
    if (!online || pendingChanges.length === 0 || syncing) return;

    setSyncing(true);

    try {
      await syncFunction([...pendingChanges]);
      setPendingChanges([]);
      setLastSync(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  }, [online, pendingChanges, syncing, syncFunction]);

  useEffect(() => {
    const timer = setInterval(sync, interval);
    
    if (online && pendingChanges.length > 0) {
      sync();
    }

    return () => clearInterval(timer);
  }, [online, pendingChanges, sync, interval]);

  return {
    syncing,
    lastSync,
    pendingChanges,
    pendingCount: pendingChanges.length,
    addChange,
    sync
  };
};