// =====================================================
// FILE: frontend/src/services/admin.js
// DESKRIPSI: Admin service
// =====================================================

import api from './api';

const adminService = {
  /**
   * Get system statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all users
   */
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return { 
        success: true, 
        data: response.data,
        pagination: response.pagination 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user details
   */
  getUserDetails: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create new user
   */
  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update user
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete user
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get system logs
   */
  getLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/logs', { params });
      return { 
        success: true, 
        data: response.data,
        pagination: response.pagination 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get system health
   */
  getSystemHealth: async () => {
    try {
      const response = await api.get('/admin/health');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Clear cache
   */
  clearCache: async (type = 'all') => {
    try {
      const response = await api.post('/admin/clear-cache', { type });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Run maintenance
   */
  runMaintenance: async (action = 'optimize') => {
    try {
      const response = await api.post('/admin/maintenance', { action });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get database backup
   */
  backupDatabase: async () => {
    try {
      const response = await api.download('/admin/backup', {}, `backup-${new Date().toISOString()}.sql`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Restore database
   */
  restoreDatabase: async (file) => {
    try {
      const response = await api.upload('/admin/restore', file, 'backup');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get system configuration
   */
  getConfig: async () => {
    try {
      const response = await api.get('/admin/config');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update system configuration
   */
  updateConfig: async (config) => {
    try {
      const response = await api.put('/admin/config', config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get system updates
   */
  getUpdates: async () => {
    try {
      const response = await api.get('/admin/updates');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Apply system update
   */
  applyUpdate: async (updateId) => {
    try {
      const response = await api.post(`/admin/updates/${updateId}/apply`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get system errors
   */
  getErrors: async (params = {}) => {
    try {
      const response = await api.get('/admin/errors', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Clear error logs
   */
  clearErrors: async () => {
    try {
      const response = await api.delete('/admin/errors');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user activity
   */
  getUserActivity: async (params = {}) => {
    try {
      const response = await api.get('/admin/activity', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export user data
   */
  exportUserData: async (userId) => {
    try {
      const response = await api.download(`/admin/users/${userId}/export`, {}, `user-${userId}-data.json`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Impersonate user
   */
  impersonateUser: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/impersonate`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Stop impersonating
   */
  stopImpersonate: async () => {
    try {
      const response = await api.post('/admin/impersonate/stop');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get audit trail
   */
  getAuditTrail: async (params = {}) => {
    try {
      const response = await api.get('/admin/audit', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get API usage statistics
   */
  getApiUsage: async (params = {}) => {
    try {
      const response = await api.get('/admin/api-usage', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get rate limiting stats
   */
  getRateLimitStats: async () => {
    try {
      const response = await api.get('/admin/rate-limits');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Clear rate limits for user
   */
  clearRateLimit: async (userId) => {
    try {
      const response = await api.delete(`/admin/rate-limits/${userId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get email logs
   */
  getEmailLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/emails', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Retry failed email
   */
  retryEmail: async (emailId) => {
    try {
      const response = await api.post(`/admin/emails/${emailId}/retry`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get SMS logs
   */
  getSmsLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/sms', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get notification logs
   */
  getNotificationLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/notifications', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get cron job status
   */
  getCronJobs: async () => {
    try {
      const response = await api.get('/admin/cron');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Run cron job manually
   */
  runCronJob: async (jobName) => {
    try {
      const response = await api.post(`/admin/cron/${jobName}/run`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Toggle cron job
   */
  toggleCronJob: async (jobName, enabled) => {
    try {
      const response = await api.put(`/admin/cron/${jobName}`, { enabled });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get storage usage
   */
  getStorageUsage: async () => {
    try {
      const response = await api.get('/admin/storage');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Clean temporary files
   */
  cleanTemp: async () => {
    try {
      const response = await api.delete('/admin/storage/temp');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default adminService;