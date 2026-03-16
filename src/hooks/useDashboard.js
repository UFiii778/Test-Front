// =====================================================
// FILE: frontend/src/hooks/useDashboard.js
// DESKRIPSI: Dashboard hook
// =====================================================

import { useContext, useCallback } from 'react';
import { DashboardContext } from '../contexts/DashboardContext';

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
};

// Convenience hooks
export const useDashboardData = () => {
  const { dashboardData, loading } = useDashboard();
  return { data: dashboardData, loading };
};

export const useDashboardStats = () => {
  const { stats } = useDashboard();
  return stats;
};

export const useRecentActivities = () => {
  const { recentActivities } = useDashboard();
  return recentActivities;
};

export const useUpcomingEvents = () => {
  const { upcomingEvents } = useDashboard();
  return upcomingEvents;
};

export const useDashboardNotifications = () => {
  const { notifications } = useDashboard();
  return notifications;
};

export const useWidgets = () => {
  const { widgets, toggleWidget, reorderWidgets, resetWidgets } = useDashboard();
  return { widgets, toggleWidget, reorderWidgets, resetWidgets };
};

export const useWidgetConfig = () => {
  const { widgetConfig } = useDashboard();
  return widgetConfig;
};

export const useRoleDashboard = () => {
  const { getRoleDashboard } = useDashboard();
  return getRoleDashboard;
};

export const useChartData = (chartType) => {
  const { getChartData } = useDashboard();
  
  const fetchChartData = useCallback(async (params = {}) => {
    return await getChartData(chartType, params);
  }, [chartType, getChartData]);

  return fetchChartData;
};

export const usePerformanceMetrics = () => {
  const { getPerformanceMetrics } = useDashboard();
  return getPerformanceMetrics;
};

export const useUserGrowth = () => {
  const { getUserGrowth } = useDashboard();
  return getUserGrowth;
};

export const useDonationTrends = () => {
  const { getDonationTrends } = useDashboard();
  return getDonationTrends;
};

export const useGeoDistribution = () => {
  const { getGeoDistribution } = useDashboard();
  return getGeoDistribution;
};

export const useTopAreas = () => {
  const { getTopAreas } = useDashboard();
  return getTopAreas;
};

export const useWeeklySummary = () => {
  const { getWeeklySummary } = useDashboard();
  return getWeeklySummary;
};

export const useMonthlyReport = () => {
  const { getMonthlyReport } = useDashboard();
  return getMonthlyReport;
};

export const useExportDashboard = () => {
  const { exportDashboard } = useDashboard();
  return exportDashboard;
};

export const useRefreshDashboard = () => {
  const { refresh } = useDashboard();
  return refresh;
};