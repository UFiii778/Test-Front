// =====================================================
// FILE: frontend/src/services/request.js
// DESKRIPSI: Donation request service
// =====================================================

import api from './api';

const requestService = {
  /**
   * Get all donation requests
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/requests', { params });
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
   * Get request by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/requests/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create new donation request
   */
  create: async (requestData) => {
    try {
      const response = await api.post('/requests', requestData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update request
   */
  update: async (id, requestData) => {
    try {
      const response = await api.put(`/requests/${id}`, requestData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update request status
   */
  updateStatus: async (id, status, reason = '') => {
    try {
      const response = await api.put(`/requests/${id}/status`, { status, reason });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Cancel request
   */
  cancel: async (id, reason = '') => {
    try {
      const response = await api.post(`/requests/${id}/cancel`, { reason });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Respond to request (for donors)
   */
  respond: async (id, responseData) => {
    try {
      const response = await api.post(`/requests/${id}/respond`, responseData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get request statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/requests/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get requests by patient
   */
  getByPatient: async (patientId, params = {}) => {
    try {
      const response = await api.get(`/requests/patient/${patientId}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get requests by blood type
   */
  getByBloodType: async (bloodType, params = {}) => {
    try {
      const response = await api.get('/requests/blood-type', { 
        params: { blood_type: bloodType, ...params } 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get emergency requests
   */
  getEmergency: async () => {
    try {
      const response = await api.get('/requests/emergency');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get matching requests for donor
   */
  getMatchingForDonor: async (donorId, params = {}) => {
    try {
      const response = await api.get(`/requests/matching/${donorId}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get request responses
   */
  getResponses: async (requestId) => {
    try {
      const response = await api.get(`/requests/${requestId}/responses`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Accept donor response
   */
  acceptResponse: async (requestId, responseId) => {
    try {
      const response = await api.post(`/requests/${requestId}/responses/${responseId}/accept`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Decline donor response
   */
  declineResponse: async (requestId, responseId, reason = '') => {
    try {
      const response = await api.post(`/requests/${requestId}/responses/${responseId}/decline`, { reason });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get nearby requests
   */
  getNearby: async (lat, lng, radius = 20, params = {}) => {
    try {
      const response = await api.get('/requests/nearby', {
        params: { lat, lng, radius, ...params }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get request timeline
   */
  getTimeline: async (requestId) => {
    try {
      const response = await api.get(`/requests/${requestId}/timeline`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Add note to request
   */
  addNote: async (requestId, note) => {
    try {
      const response = await api.post(`/requests/${requestId}/notes`, { note });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get request analytics
   */
  getAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/requests/analytics', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export requests report
   */
  exportReport: async (params = {}, format = 'excel') => {
    try {
      const response = await api.download('/requests/export', { ...params, format }, `requests-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default requestService;