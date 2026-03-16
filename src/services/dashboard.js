// =====================================================
// FILE: frontend/src/services/dashboard.js
// DESKRIPSI: Dashboard service
// =====================================================

import api from './api';

const dashboardService = {
  /**
   * Get dashboard data based on user role
   */
  getDashboard: async () => {
    try {
      const response = await api.get('/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get admin dashboard data
   */
  getAdminDashboard: async () => {
    try {
      const response = await api.get('/dashboard/admin');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get PMI dashboard data
   */
  getPMIDashboard: async () => {
    try {
      const response = await api.get('/dashboard/pmi');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get volunteer dashboard data
   */
  getVolunteerDashboard: async () => {
    try {
      const response = await api.get('/dashboard/volunteer');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donor dashboard data
   */
  getDonorDashboard: async () => {
    try {
      const response = await api.get('/dashboard/donor');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get patient dashboard data
   */
  getPatientDashboard: async () => {
    try {
      const response = await api.get('/dashboard/patient');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get dashboard statistics
   */
  getStats: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/stats', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get('/dashboard/activities', { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get upcoming events
   */
  getUpcomingEvents: async (limit = 5) => {
    try {
      const response = await api.get('/dashboard/events', { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get notifications summary
   */
  getNotificationsSummary: async () => {
    try {
      const response = await api.get('/dashboard/notifications');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get chart data for dashboard
   */
  getChartData: async (chartType, params = {}) => {
    try {
      const response = await api.get(`/dashboard/charts/${chartType}`, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get performance metrics
   */
  getPerformanceMetrics: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/performance', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get quick actions
   */
  getQuickActions: async () => {
    try {
      const response = await api.get('/dashboard/quick-actions');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get todo list
   */
  getTodoList: async () => {
    try {
      const response = await api.get('/dashboard/todo');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Mark todo as complete
   */
  markTodoComplete: async (todoId) => {
    try {
      const response = await api.put(`/dashboard/todo/${todoId}/complete`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get system health status (Admin only)
   */
  getSystemHealth: async () => {
    try {
      const response = await api.get('/dashboard/system-health');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get user growth data
   */
  getUserGrowth: async (period = 'month') => {
    try {
      const response = await api.get('/dashboard/user-growth', { params: { period } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get donation trends
   */
  getDonationTrends: async (params = {}) => {
    try {
      const response = await api.get('/dashboard/donation-trends', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get geographical distribution
   */
  getGeoDistribution: async () => {
    try {
      const response = await api.get('/dashboard/geo-distribution');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get top performing areas
   */
  getTopAreas: async (limit = 5) => {
    try {
      const response = await api.get('/dashboard/top-areas', { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get weekly summary
   */
  getWeeklySummary: async () => {
    try {
      const response = await api.get('/dashboard/weekly-summary');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get monthly report summary
   */
  getMonthlyReport: async (month = null, year = null) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      
      const response = await api.get('/dashboard/monthly-report', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get anniversary stats
   */
  getAnniversaryStats: async () => {
    try {
      const response = await api.get('/dashboard/anniversary');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get achievement badges
   */
  getAchievements: async () => {
    try {
      const response = await api.get('/dashboard/achievements');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get welcome message
   */
  getWelcomeMessage: async () => {
    try {
      const response = await api.get('/dashboard/welcome');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Dismiss welcome message
   */
  dismissWelcome: async () => {
    try {
      const response = await api.post('/dashboard/welcome/dismiss');
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get dashboard widgets configuration
   */
  getWidgetsConfig: async () => {
    try {
      const response = await api.get('/dashboard/widgets');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update dashboard widgets configuration
   */
  updateWidgetsConfig: async (config) => {
    try {
      const response = await api.put('/dashboard/widgets', config);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Reset dashboard widgets to default
   */
  resetWidgets: async () => {
    try {
      const response = await api.post('/dashboard/widgets/reset');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Export dashboard data
   */
  exportDashboard: async (format = 'pdf') => {
    try {
      const response = await api.download('/dashboard/export', { format }, `dashboard-report.${format}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default dashboardService;