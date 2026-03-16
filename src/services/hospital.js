// =====================================================
// FILE: frontend/src/services/hospital.js
// DESKRIPSI: Hospital management service
// =====================================================

import api from './api';

const hospitalService = {
  /**
   * Get all hospitals
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/hospitals', { params });
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
   * Get hospital by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/hospitals/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create new hospital (PMI/Admin only)
   */
  create: async (hospitalData) => {
    try {
      const response = await api.post('/hospitals', hospitalData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update hospital (PMI/Admin only)
   */
  update: async (id, hospitalData) => {
    try {
      const response = await api.put(`/hospitals/${id}`, hospitalData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete hospital (Admin only)
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/hospitals/${id}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get nearby hospitals
   */
  getNearby: async (lat, lng, radius = 10) => {
    try {
      const response = await api.get('/hospitals/nearby', { 
        params: { lat, lng, radius } 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Upload hospital image
   */
  uploadImage: async (id, file, onProgress = null) => {
    try {
      const response = await api.upload(`/hospitals/${id}/image`, file, 'hospital_image', {}, onProgress);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospital statistics
   */
  getStats: async (id) => {
    try {
      const response = await api.get(`/hospitals/${id}/stats`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Search hospitals
   */
  search: async (keyword, params = {}) => {
    try {
      const response = await api.get('/hospitals/search', { 
        params: { q: keyword, ...params } 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospitals by city
   */
  getByCity: async (city) => {
    try {
      const response = await api.get('/hospitals/by-city', { params: { city } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospitals by province
   */
  getByProvince: async (province) => {
    try {
      const response = await api.get('/hospitals/by-province', { params: { province } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospital types/facilities
   */
  getFacilities: async () => {
    try {
      const response = await api.get('/hospitals/facilities');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospital operating hours
   */
  getOperatingHours: async (id) => {
    try {
      const response = await api.get(`/hospitals/${id}/operating-hours`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update hospital operating hours
   */
  updateOperatingHours: async (id, hours) => {
    try {
      const response = await api.put(`/hospitals/${id}/operating-hours`, hours);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospital contacts
   */
  getContacts: async (id) => {
    try {
      const response = await api.get(`/hospitals/${id}/contacts`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update hospital contacts
   */
  updateContacts: async (id, contacts) => {
    try {
      const response = await api.put(`/hospitals/${id}/contacts`, contacts);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospital reviews/ratings
   */
  getReviews: async (id, params = {}) => {
    try {
      const response = await api.get(`/hospitals/${id}/reviews`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Add hospital review
   */
  addReview: async (id, reviewData) => {
    try {
      const response = await api.post(`/hospitals/${id}/reviews`, reviewData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospital departments
   */
  getDepartments: async (id) => {
    try {
      const response = await api.get(`/hospitals/${id}/departments`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospital doctors
   */
  getDoctors: async (id, params = {}) => {
    try {
      const response = await api.get(`/hospitals/${id}/doctors`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospital emergency info
   */
  getEmergencyInfo: async (id) => {
    try {
      const response = await api.get(`/hospitals/${id}/emergency`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default hospitalService;