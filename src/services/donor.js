// =====================================================
// FILE: frontend/src/services/donor.js
// DESKRIPSI: Donor service
// =====================================================

import api from './api';

const donorService = {
  /**
   * Get donor dashboard data
   */
  getDashboard: async () => {
    try {
      const response = await api.get('/donor/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donor history
   */
  getHistory: async (params = {}) => {
    try {
      const response = await api.get('/donor/history', { params });
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
   * Get donor certificate
   */
  getCertificate: async (id) => {
    try {
      const response = await api.get(`/donor/certificate/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Schedule donation
   */
  scheduleDonation: async (scheduleData) => {
    try {
      const response = await api.post('/donor/schedule', scheduleData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donor eligibility
   */
  getEligibility: async () => {
    try {
      const response = await api.get('/donor/eligibility');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update medical info
   */
  updateMedicalInfo: async (medicalData) => {
    try {
      const response = await api.put('/donor/medical-info', medicalData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donor statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/donor/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get upcoming donations
   */
  getUpcomingDonations: async () => {
    try {
      const response = await api.get('/donor/upcoming');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donation timeline
   */
  getTimeline: async () => {
    try {
      const response = await api.get('/donor/timeline');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donor achievements
   */
  getAchievements: async () => {
    try {
      const response = await api.get('/donor/achievements');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donor certificates list
   */
  getCertificates: async (params = {}) => {
    try {
      const response = await api.get('/donor/certificates', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Download certificate
   */
  downloadCertificate: async (id) => {
    try {
      const response = await api.download(`/donor/certificate/${id}/download`, {}, `certificate-${id}.pdf`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Share certificate
   */
  shareCertificate: async (id) => {
    try {
      const response = await api.get(`/donor/certificate/${id}/share`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donor profile
   */
  getProfile: async () => {
    try {
      const response = await api.get('/donor/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update donor profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/donor/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donation reminders
   */
  getReminders: async () => {
    try {
      const response = await api.get('/donor/reminders');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Set donation reminder
   */
  setReminder: async (reminderData) => {
    try {
      const response = await api.post('/donor/reminders', reminderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete reminder
   */
  deleteReminder: async (reminderId) => {
    try {
      const response = await api.delete(`/donor/reminders/${reminderId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donor rewards
   */
  getRewards: async () => {
    try {
      const response = await api.get('/donor/rewards');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Claim reward
   */
  claimReward: async (rewardId) => {
    try {
      const response = await api.post(`/donor/rewards/${rewardId}/claim`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donor level
   */
  getLevel: async () => {
    try {
      const response = await api.get('/donor/level');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get next donation date
   */
  getNextDonationDate: async () => {
    try {
      const response = await api.get('/donor/next-date');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Check if eligible to donate
   */
  checkEligibility: async () => {
    try {
      const response = await api.get('/donor/check-eligibility');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donation tips
   */
  getTips: async () => {
    try {
      const response = await api.get('/donor/tips');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default donorService;