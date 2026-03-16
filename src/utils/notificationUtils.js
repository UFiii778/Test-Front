// =====================================================
// FILE: frontend/src/utils/notificationUtils.js
// DESKRIPSI: Notification utilities
// =====================================================

import { NOTIFICATION_TYPES, NOTIFICATION_TYPE_LABELS } from './constants';

/**
 * Check if browser supports notifications
 */
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

/**
 * Check if notification permission is granted
 */
export const isNotificationPermissionGranted = () => {
  return isNotificationSupported() && Notification.permission === 'granted';
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return { success: false, error: 'Notifications not supported' };
  }

  try {
    const permission = await Notification.requestPermission();
    return {
      success: permission === 'granted',
      permission
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Show browser notification
 */
export const showBrowserNotification = (title, options = {}) => {
  if (!isNotificationPermissionGranted()) {
    return false;
  }

  try {
    const notification = new Notification(title, {
      icon: '/logo192.png',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      ...options
    });

    notification.onclick = (event) => {
      event.preventDefault();
      if (options.onClick) {
        options.onClick(notification);
      } else if (options.url) {
        window.focus();
        window.location.href = options.url;
      }
    };

    return true;
  } catch (error) {
    console.error('Error showing notification:', error);
    return false;
  }
};

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type) => {
  const icons = {
    [NOTIFICATION_TYPES.PERMINTAAN]: '🩸',
    [NOTIFICATION_TYPES.RESPON]: '💬',
    [NOTIFICATION_TYPES.PENGINGAT]: '⏰',
    [NOTIFICATION_TYPES.INFO]: 'ℹ️',
    [NOTIFICATION_TYPES.DARURAT]: '🚨',
    [NOTIFICATION_TYPES.SISTEM]: '⚙️'
  };
  
  return icons[type] || '🔔';
};

/**
 * Get notification color based on type
 */
export const getNotificationColor = (type) => {
  const colors = {
    [NOTIFICATION_TYPES.PERMINTAAN]: 'blue',
    [NOTIFICATION_TYPES.RESPON]: 'green',
    [NOTIFICATION_TYPES.PENGINGAT]: 'yellow',
    [NOTIFICATION_TYPES.INFO]: 'gray',
    [NOTIFICATION_TYPES.DARURAT]: 'red',
    [NOTIFICATION_TYPES.SISTEM]: 'purple'
  };
  
  return colors[type] || 'gray';
};

/**
 * Format notification message
 */
export const formatNotificationMessage = (notification) => {
  const { type, title, message, data } = notification;
  
  switch (type) {
    case NOTIFICATION_TYPES.PERMINTAAN:
      return `Permintaan donor ${data?.bloodType} di ${data?.location}`;
    case NOTIFICATION_TYPES.RESPON:
      return `${data?.donorName} merespon permintaan Anda`;
    case NOTIFICATION_TYPES.PENGINGAT:
      return `Donor besok pukul ${data?.time} di ${data?.hospital}`;
    case NOTIFICATION_TYPES.DARURAT:
      return `🚨 DARURAT: ${message}`;
    default:
      return message;
  }
};

/**
 * Group notifications by date
 */
export const groupNotificationsByDate = (notifications) => {
  const groups = {};
  
  notifications.forEach(notification => {
    const date = new Date(notification.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
  });
  
  return groups;
};

/**
 * Filter notifications by type
 */
export const filterNotificationsByType = (notifications, types) => {
  if (!types || types.length === 0) return notifications;
  return notifications.filter(n => types.includes(n.type));
};

/**
 * Mark notifications as read
 */
export const markNotificationsAsRead = (notifications, ids) => {
  return notifications.map(n => ({
    ...n,
    is_read: ids.includes(n.id) ? true : n.is_read
  }));
};

/**
 * Get unread count
 */
export const getUnreadCount = (notifications) => {
  return notifications.filter(n => !n.is_read).length;
};

/**
 * Sort notifications by date
 */
export const sortNotificationsByDate = (notifications, order = 'desc') => {
  return [...notifications].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

/**
 * Create push notification subscription
 */
export const createPushSubscription = async (vapidPublicKey) => {
  if (!isNotificationSupported() || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });
    
    return subscription;
  } catch (error) {
    console.error('Error creating push subscription:', error);
    return null;
  }
};

/**
 * Convert base64 string to Uint8Array (for VAPID keys)
 */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

/**
 * Show toast notification
 */
export const showToast = (message, options = {}) => {
  // This would integrate with a toast library like react-hot-toast
  console.log('Toast:', message, options);
};

/**
 * Show alert notification
 */
export const showAlert = (message, type = 'info') => {
  // This would integrate with an alert component
  console.log('Alert:', type, message);
};

/**
 * Play notification sound
 */
export const playNotificationSound = (type = 'default') => {
  const sounds = {
    default: '/sounds/notification.mp3',
    emergency: '/sounds/emergency.mp3',
    success: '/sounds/success.mp3'
  };

  const audio = new Audio(sounds[type] || sounds.default);
  audio.play().catch(() => {});
};

/**
 * Vibrate device
 */
export const vibrate = (pattern = [200, 100, 200]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/**
 * Schedule notification
 */
export const scheduleNotification = (title, options, delay) => {
  setTimeout(() => {
    showBrowserNotification(title, options);
  }, delay);
};