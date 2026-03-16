// =====================================================
// FILE: frontend/src/services/appointment.js
// DESKRIPSI: Appointment service
// =====================================================

import api from './api';

const appointmentService = {
  /**
   * Get all appointments
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/appointments', { params });
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
   * Get appointment by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create new appointment
   */
  create: async (appointmentData) => {
    try {
      const response = await api.post('/appointments', appointmentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update appointment
   */
  update: async (id, appointmentData) => {
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update appointment status
   */
  updateStatus: async (id, status, reason = '') => {
    try {
      const response = await api.put(`/appointments/${id}/status`, { status, reason });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Cancel appointment
   */
  cancel: async (id, reason = '') => {
    try {
      const response = await api.post(`/appointments/${id}/cancel`, { reason });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Reschedule appointment
   */
  reschedule: async (id, newDate, newTime, reason = '') => {
    try {
      const response = await api.put(`/appointments/${id}/reschedule`, {
        new_date: newDate,
        new_time: newTime,
        reason
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get available slots
   */
  getAvailableSlots: async (hospitalId, date) => {
    try {
      const response = await api.get('/appointments/slots', {
        params: { hospital_id: hospitalId, date }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get appointment statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/appointments/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get upcoming appointments
   */
  getUpcoming: async (userId, role = 'patient', limit = 10) => {
    try {
      const response = await api.get('/appointments/upcoming', {
        params: { user_id: userId, role, limit }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get appointments by date
   */
  getByDate: async (date, params = {}) => {
    try {
      const response = await api.get('/appointments/by-date', {
        params: { date, ...params }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get appointments by hospital
   */
  getByHospital: async (hospitalId, params = {}) => {
    try {
      const response = await api.get(`/appointments/hospital/${hospitalId}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get appointments by patient
   */
  getByPatient: async (patientId, params = {}) => {
    try {
      const response = await api.get(`/appointments/patient/${patientId}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get appointment reminders
   */
  getReminders: async () => {
    try {
      const response = await api.get('/appointments/reminders');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Send appointment reminder
   */
  sendReminder: async (id) => {
    try {
      const response = await api.post(`/appointments/${id}/send-reminder`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Check appointment availability
   */
  checkAvailability: async (hospitalId, date, time) => {
    try {
      const response = await api.get('/appointments/check-availability', {
        params: { hospital_id: hospitalId, date, time }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get appointment types
   */
  getTypes: async () => {
    try {
      const response = await api.get('/appointments/types');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get appointment history
   */
  getHistory: async (userId, params = {}) => {
    try {
      const response = await api.get(`/appointments/history/${userId}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Rate appointment
   */
  rate: async (id, rating, feedback = '') => {
    try {
      const response = await api.post(`/appointments/${id}/rate`, { rating, feedback });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export appointments report
   */
  exportReport: async (params = {}, format = 'excel') => {
    try {
      const response = await api.download('/appointments/export', { ...params, format }, `appointments-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default appointmentService;