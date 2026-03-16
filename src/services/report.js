// =====================================================
// FILE: frontend/src/services/report.js
// DESKRIPSI: Report service
// =====================================================

import api from './api';

const reportService = {
  /**
   * Get blood stock report
   */
  getBloodStockReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/blood-stock', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donation report
   */
  getDonationReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/donations', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get request report
   */
  getRequestReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/requests', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user report
   */
  getUserReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/users', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get hospital report
   */
  getHospitalReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/hospitals', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get dashboard report
   */
  getDashboardReport: async () => {
    try {
      const response = await api.get('/reports/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export blood stock report
   */
  exportBloodStockReport: async (params = {}, format = 'excel') => {
    try {
      const response = await api.download('/reports/blood-stock/export', { ...params, format }, `blood-stock-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export donation report
   */
  exportDonationReport: async (params = {}, format = 'excel') => {
    try {
      const response = await api.download('/reports/donations/export', { ...params, format }, `donation-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export request report
   */
  exportRequestReport: async (params = {}, format = 'excel') => {
    try {
      const response = await api.download('/reports/requests/export', { ...params, format }, `request-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export user report
   */
  exportUserReport: async (params = {}, format = 'excel') => {
    try {
      const response = await api.download('/reports/users/export', { ...params, format }, `user-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export hospital report
   */
  exportHospitalReport: async (params = {}, format = 'excel') => {
    try {
      const response = await api.download('/reports/hospitals/export', { ...params, format }, `hospital-report.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get report templates
   */
  getTemplates: async () => {
    try {
      const response = await api.get('/reports/templates');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Create custom report
   */
  createCustomReport: async (reportConfig) => {
    try {
      const response = await api.post('/reports/custom', reportConfig);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get saved reports
   */
  getSavedReports: async () => {
    try {
      const response = await api.get('/reports/saved');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get report by ID
   */
  getReportById: async (reportId) => {
    try {
      const response = await api.get(`/reports/saved/${reportId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update saved report
   */
  updateSavedReport: async (reportId, reportData) => {
    try {
      const response = await api.put(`/reports/saved/${reportId}`, reportData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete saved report
   */
  deleteSavedReport: async (reportId) => {
    try {
      const response = await api.delete(`/reports/saved/${reportId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Schedule report
   */
  scheduleReport: async (scheduleData) => {
    try {
      const response = await api.post('/reports/schedule', scheduleData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get scheduled reports
   */
  getScheduledReports: async () => {
    try {
      const response = await api.get('/reports/scheduled');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update scheduled report
   */
  updateScheduledReport: async (scheduleId, scheduleData) => {
    try {
      const response = await api.put(`/reports/scheduled/${scheduleId}`, scheduleData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete scheduled report
   */
  deleteScheduledReport: async (scheduleId) => {
    try {
      const response = await api.delete(`/reports/scheduled/${scheduleId}`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get report formats
   */
  getFormats: async () => {
    try {
      const response = await api.get('/reports/formats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get report data for chart
   */
  getChartData: async (reportType, params = {}) => {
    try {
      const response = await api.get(`/reports/chart/${reportType}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Compare reports
   */
  compareReports: async (reportIds, params = {}) => {
    try {
      const response = await api.post('/reports/compare', { reportIds, ...params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get report summary
   */
  getSummary: async (reportType, params = {}) => {
    try {
      const response = await api.get(`/reports/summary/${reportType}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get report analytics
   */
  getAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/reports/analytics', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Send report via email
   */
  sendEmail: async (reportId, emailData) => {
    try {
      const response = await api.post(`/reports/${reportId}/email`, emailData);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Print report
   */
  printReport: async (reportId, params = {}) => {
    try {
      const response = await api.download(`/reports/${reportId}/print`, params, `report-${reportId}.pdf`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get report history
   */
  getHistory: async (params = {}) => {
    try {
      const response = await api.get('/reports/history', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Archive report
   */
  archiveReport: async (reportId) => {
    try {
      const response = await api.post(`/reports/${reportId}/archive`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Unarchive report
   */
  unarchiveReport: async (reportId) => {
    try {
      const response = await api.post(`/reports/${reportId}/unarchive`);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get archived reports
   */
  getArchived: async (params = {}) => {
    try {
      const response = await api.get('/reports/archived', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default reportService;