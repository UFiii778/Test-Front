// =====================================================
// FILE: frontend/src/services/user.js
// DESKRIPSI: User management service
// =====================================================

import api from './api';

const userService = {
  /**
   * Get all users (admin only)
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (file, onProgress = null) => {
    try {
      const response = await api.upload('/users/upload-photo', file, 'profile_picture', {}, onProgress);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete user account
   */
  deleteAccount: async (password) => {
    try {
      const response = await api.delete('/users/account', { data: { password } });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donors list
   */
  getDonors: async (params = {}) => {
    try {
      const response = await api.get('/users/donors', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Verify donor (PMI/Sukarelawan only)
   */
  verifyDonor: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/verify`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Search users
   */
  search: async (keyword, role = null) => {
    try {
      const params = { q: keyword };
      if (role) params.role = role;
      
      const response = await api.get('/users/search', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user statistics
   */
  getStats: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/stats`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user activity log
   */
  getActivityLog: async (userId, params = {}) => {
    try {
      const response = await api.get(`/users/${userId}/activities`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put('/users/notification-settings', settings);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get notification settings
   */
  getNotificationSettings: async () => {
    try {
      const response = await api.get('/users/notification-settings');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update privacy settings
   */
  updatePrivacySettings: async (settings) => {
    try {
      const response = await api.put('/users/privacy-settings', settings);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get privacy settings
   */
  getPrivacySettings: async () => {
    try {
      const response = await api.get('/users/privacy-settings');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user addresses
   */
  getAddresses: async () => {
    try {
      const response = await api.get('/users/addresses');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Add new address
   */
  addAddress: async (addressData) => {
    try {
      const response = await api.post('/users/addresses', addressData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update address
   */
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/users/addresses/${addressId}`, addressData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete address
   */
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/users/addresses/${addressId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Set default address
   */
  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.put(`/users/addresses/${addressId}/default`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default userService;