// =====================================================
// FILE: frontend/src/contexts/DashboardContext.jsx
// DESKRIPSI: Dashboard context provider
// =====================================================

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import dashboardService from '../services/dashboard';
import toast from 'react-hot-toast';

// Create context
const DashboardContext = createContext(null);

// Custom hook to use dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Provider component
export const DashboardProvider = ({ children }) => {
  const { user, hasRole } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [widgetConfig, setWidgetConfig] = useState(null);

  // Load dashboard data on mount and when user changes
  useEffect(() => {
    if (user) {
      loadDashboard();
      loadWidgetConfig();
    }
  }, [user]);

  // Load dashboard data
  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getDashboard();
      
      if (response.success) {
        setDashboardData(response.data);
        setStats(response.data.stats);
        setRecentActivities(response.data.recent_activities || []);
        setUpcomingEvents(response.data.upcoming_events || []);
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error('Load dashboard error:', error);
      toast.error('Gagal memuat dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Load widget configuration
  const loadWidgetConfig = async () => {
    try {
      const response = await dashboardService.getWidgetsConfig();
      
      if (response.success) {
        setWidgetConfig(response.data);
        setWidgets(response.data.widgets || getDefaultWidgets());
      }
    } catch (error) {
      console.error('Load widget config error:', error);
    }
  };

  // Get default widgets based on user role
  const getDefaultWidgets = useCallback(() => {
    const commonWidgets = [
      { id: 'welcome', title: 'Selamat Datang', enabled: true, order: 1 },
      { id: 'stats', title: 'Statistik', enabled: true, order: 2 },
      { id: 'activities', title: 'Aktivitas Terbaru', enabled: true, order: 3 }
    ];

    if (hasRole('pendonor')) {
      return [
        ...commonWidgets,
        { id: 'matching_requests', title: 'Permintaan yang Cocok', enabled: true, order: 4 },
        { id: 'upcoming_donations', title: 'Donor Mendatang', enabled: true, order: 5 },
        { id: 'donation_history', title: 'Riwayat Donor', enabled: true, order: 6 }
      ];
    }

    if (hasRole('pasien')) {
      return [
        ...commonWidgets,
        { id: 'active_requests', title: 'Permintaan Aktif', enabled: true, order: 4 },
        { id: 'upcoming_appointments', title: 'Janji Temu', enabled: true, order: 5 },
        { id: 'nearby_hospitals', title: 'RS Terdekat', enabled: true, order: 6 }
      ];
    }

    if (hasRole('pmi')) {
      return [
        ...commonWidgets,
        { id: 'blood_stock', title: 'Stok Darah', enabled: true, order: 4 },
        { id: 'pending_verifications', title: 'Verifikasi Pending', enabled: true, order: 5 },
        { id: 'stock_movement', title: 'Pergerakan Stok', enabled: true, order: 6 },
        { id: 'emergency_requests', title: 'Permintaan Darurat', enabled: true, order: 7 }
      ];
    }

    if (hasRole('sukarelawan')) {
      return [
        ...commonWidgets,
        { id: 'verifications', title: 'Verifikasi Pendonor', enabled: true, order: 4 },
        { id: 'urgent_requests', title: 'Permintaan Urgent', enabled: true, order: 5 },
        { id: 'activities', title: 'Kegiatan', enabled: true, order: 6 }
      ];
    }

    if (hasRole('admin')) {
      return [
        ...commonWidgets,
        { id: 'system_stats', title: 'Statistik Sistem', enabled: true, order: 4 },
        { id: 'user_growth', title: 'Pertumbuhan User', enabled: true, order: 5 },
        { id: 'recent_logs', title: 'Log Terbaru', enabled: true, order: 6 },
        { id: 'system_health', title: 'Kesehatan Sistem', enabled: true, order: 7 }
      ];
    }

    return commonWidgets;
  }, [hasRole]);

  // Get specific dashboard based on role
  const getRoleDashboard = useCallback(async () => {
    if (hasRole('admin')) {
      return await dashboardService.getAdminDashboard();
    }
    if (hasRole('pmi')) {
      return await dashboardService.getPMIDashboard();
    }
    if (hasRole('sukarelawan')) {
      return await dashboardService.getVolunteerDashboard();
    }
    if (hasRole('pendonor')) {
      return await dashboardService.getDonorDashboard();
    }
    if (hasRole('pasien')) {
      return await dashboardService.getPatientDashboard();
    }
    return null;
  }, [hasRole]);

  // Get chart data
  const getChartData = useCallback(async (chartType, params = {}) => {
    try {
      const response = await dashboardService.getChartData(chartType, params);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(async (params = {}) => {
    try {
      const response = await dashboardService.getPerformanceMetrics(params);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get user growth data
  const getUserGrowth = useCallback(async (period = 'month') => {
    try {
      const response = await dashboardService.getUserGrowth(period);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get donation trends
  const getDonationTrends = useCallback(async (params = {}) => {
    try {
      const response = await dashboardService.getDonationTrends(params);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get geographical distribution
  const getGeoDistribution = useCallback(async () => {
    try {
      const response = await dashboardService.getGeoDistribution();
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get top areas
  const getTopAreas = useCallback(async (limit = 5) => {
    try {
      const response = await dashboardService.getTopAreas(limit);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get weekly summary
  const getWeeklySummary = useCallback(async () => {
    try {
      const response = await dashboardService.getWeeklySummary();
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get monthly report
  const getMonthlyReport = useCallback(async (month = null, year = null) => {
    try {
      const response = await dashboardService.getMonthlyReport(month, year);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Update widget configuration
  const updateWidgetConfig = useCallback(async (newWidgets) => {
    setWidgets(newWidgets);
    
    const config = {
      widgets: newWidgets,
      layout: widgetConfig?.layout || 'grid'
    };

    try {
      const response = await dashboardService.updateWidgetsConfig(config);
      
      if (response.success) {
        setWidgetConfig(response.data);
        toast.success('Tampilan dashboard diperbarui');
        return { success: true };
      } else {
        toast.error(response.error || 'Gagal memperbarui tampilan');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      return { success: false, error: error.message };
    }
  }, [widgetConfig]);

  // Toggle widget
  const toggleWidget = useCallback((widgetId) => {
    const newWidgets = widgets.map(w =>
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    );
    updateWidgetConfig(newWidgets);
  }, [widgets, updateWidgetConfig]);

  // Reorder widgets
  const reorderWidgets = useCallback((newOrder) => {
    const newWidgets = newOrder.map((id, index) => {
      const widget = widgets.find(w => w.id === id);
      return { ...widget, order: index + 1 };
    });
    updateWidgetConfig(newWidgets);
  }, [widgets, updateWidgetConfig]);

  // Reset to default widgets
  const resetWidgets = useCallback(async () => {
    const defaultWidgets = getDefaultWidgets();
    await updateWidgetConfig(defaultWidgets);
    toast.success('Widget direset ke default');
  }, [getDefaultWidgets, updateWidgetConfig]);

  // Export dashboard
  const exportDashboard = useCallback(async (format = 'pdf') => {
    try {
      await dashboardService.exportDashboard(format);
      toast.success(`Dashboard berhasil diexport sebagai ${format.toUpperCase()}`);
      return { success: true };
    } catch (error) {
      toast.error('Gagal mengexport dashboard');
      return { success: false, error: error.message };
    }
  }, []);

  // Refresh dashboard
  const refresh = useCallback(() => {
    loadDashboard();
    loadWidgetConfig();
  }, []);

  // Context value
  const value = {
    dashboardData,
    stats,
    recentActivities,
    upcomingEvents,
    notifications,
    loading,
    widgets,
    widgetConfig,
    getRoleDashboard,
    getChartData,
    getPerformanceMetrics,
    getUserGrowth,
    getDonationTrends,
    getGeoDistribution,
    getTopAreas,
    getWeeklySummary,
    getMonthlyReport,
    toggleWidget,
    reorderWidgets,
    resetWidgets,
    exportDashboard,
    refresh
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};