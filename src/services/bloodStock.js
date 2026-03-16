// =====================================================
// FILE: frontend/src/services/bloodStock.js
// DESKRIPSI: Blood stock management service
// =====================================================

import api from './api';

const bloodStockService = {
  /**
   * Get all blood stock
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/blood-stock', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get blood stock summary
   */
  getSummary: async () => {
    try {
      const response = await api.get('/blood-stock/summary');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get critical blood stock
   */
  getCritical: async () => {
    try {
      const response = await api.get('/blood-stock/critical');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get blood stock forecast
   */
  getForecast: async (locationId, bloodType, days = 7) => {
    try {
      const response = await api.get('/blood-stock/forecast', {
        params: { location_id: locationId, blood_type: bloodType, days }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get blood stock by location
   */
  getByLocation: async (locationId, isHospital = true) => {
    try {
      const type = isHospital ? 'hospital' : 'pmi';
      const response = await api.get(`/blood-stock/location/${type}/${locationId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get blood stock by blood type
   */
  getByBloodType: async (bloodType) => {
    try {
      const response = await api.get('/blood-stock/blood-type', { params: { blood_type: bloodType } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update blood stock (PMI/Admin only)
   */
  update: async (id, quantity, notes = '') => {
    try {
      const response = await api.put(`/blood-stock/${id}`, { quantity, notes });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Batch update blood stock (PMI/Admin only)
   */
  batchUpdate: async (updates) => {
    try {
      const response = await api.post('/blood-stock/batch-update', { updates });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Transfer blood stock between locations
   */
  transfer: async (transferData) => {
    try {
      const response = await api.post('/blood-stock/transfer', transferData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get blood stock history
   */
  getHistory: async (stockId, params = {}) => {
    try {
      const response = await api.get(`/blood-stock/${stockId}/history`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Add blood stock (PMI/Admin only)
   */
  add: async (data) => {
    try {
      const response = await api.post('/blood-stock', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete blood stock (Admin only)
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/blood-stock/${id}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get blood stock alerts
   */
  getAlerts: async () => {
    try {
      const response = await api.get('/blood-stock/alerts');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get blood stock statistics
   */
  getStatistics: async (params = {}) => {
    try {
      const response = await api.get('/blood-stock/statistics', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get blood stock by province
   */
  getByProvince: async (province) => {
    try {
      const response = await api.get('/blood-stock/by-province', { params: { province } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get blood stock by city
   */
  getByCity: async (city) => {
    try {
      const response = await api.get('/blood-stock/by-city', { params: { city } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export blood stock report
   */
  exportReport: async (params = {}, format = 'excel') => {
    try {
      const response = await api.download('/blood-stock/export', { ...params, format }, `blood-stock-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get stock movement analytics
   */
  getMovementAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/blood-stock/analytics/movement', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get stock prediction
   */
  getPrediction: async (locationId, bloodType, months = 3) => {
    try {
      const response = await api.get('/blood-stock/prediction', {
        params: { location_id: locationId, blood_type: bloodType, months }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default bloodStockService;