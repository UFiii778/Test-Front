// =====================================================
// FILE: frontend/src/services/notification.js
// DESKRIPSI: Notification service
// =====================================================

import api from './api';

const notificationService = {
  /**
   * Get user notifications
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/notifications', { params });
      return { 
        success: true, 
        data: response.data,
        pagination: response.pagination,
        meta: response.meta
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete notification
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete all notifications
   */
  deleteAll: async () => {
    try {
      const response = await api.delete('/notifications');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get notification settings
   */
  getSettings: async () => {
    try {
      const response = await api.get('/notifications/settings');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update notification settings
   */
  updateSettings: async (settings) => {
    try {
      const response = await api.put('/notifications/settings', settings);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get notification statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/notifications/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create notification (Admin/PMI only)
   */
  create: async (notificationData) => {
    try {
      const response = await api.post('/notifications', notificationData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create bulk notifications (Admin/PMI only)
   */
  createBulk: async (userIds, notificationData) => {
    try {
      const response = await api.post('/notifications/bulk', {
        user_ids: userIds,
        ...notificationData
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get unread count
   */
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get notification preferences
   */
  getPreferences: async () => {
    try {
      const response = await api.get('/notifications/preferences');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/notifications/preferences', preferences);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Subscribe to push notifications
   */
  subscribePush: async (subscription) => {
    try {
      const response = await api.post('/notifications/push/subscribe', subscription);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Unsubscribe from push notifications
   */
  unsubscribePush: async () => {
    try {
      const response = await api.post('/notifications/push/unsubscribe');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get push notification status
   */
  getPushStatus: async () => {
    try {
      const response = await api.get('/notifications/push/status');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Test notification
   */
  sendTest: async () => {
    try {
      const response = await api.post('/notifications/test');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get notification history
   */
  getHistory: async (params = {}) => {
    try {
      const response = await api.get('/notifications/history', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get notification templates
   */
  getTemplates: async () => {
    try {
      const response = await api.get('/notifications/templates');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create notification template (Admin only)
   */
  createTemplate: async (templateData) => {
    try {
      const response = await api.post('/notifications/templates', templateData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update notification template (Admin only)
   */
  updateTemplate: async (id, templateData) => {
    try {
      const response = await api.put(`/notifications/templates/${id}`, templateData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete notification template (Admin only)
   */
  deleteTemplate: async (id) => {
    try {
      const response = await api.delete(`/notifications/templates/${id}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Schedule notification
   */
  schedule: async (scheduleData) => {
    try {
      const response = await api.post('/notifications/schedule', scheduleData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Cancel scheduled notification
   */
  cancelScheduled: async (id) => {
    try {
      const response = await api.delete(`/notifications/schedule/${id}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get scheduled notifications
   */
  getScheduled: async () => {
    try {
      const response = await api.get('/notifications/scheduled');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default notificationService;