// =====================================================
// FILE: frontend/src/hooks/useNotifications.js
// DESKRIPSI: Notifications hook
// =====================================================

import { useContext, useCallback } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};

// Convenience hooks
export const useUnreadCount = () => {
  const { unreadCount } = useNotifications();
  return unreadCount;
};

export const useMarkAsRead = () => {
  const { markAsRead } = useNotifications();
  return markAsRead;
};

export const useMarkAllAsRead = () => {
  const { markAllAsRead } = useNotifications();
  return markAllAsRead;
};

export const useDeleteNotification = () => {
  const { deleteNotification } = useNotifications();
  return deleteNotification;
};

export const useNotificationSettings = () => {
  const { settings, updateSettings } = useNotifications();
  return { settings, updateSettings };
};

export const useNotificationSound = (enabled = true) => {
  const { onNotification } = useNotifications();
  const audio = new Audio('/sounds/notification.mp3');

  useCallback(() => {
    if (enabled) {
      audio.play().catch(() => {});
    }
  }, [enabled]);

  return { playSound: () => audio.play() };
};