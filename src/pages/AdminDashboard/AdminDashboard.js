/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/AdminDashboard/AdminDashboard.jsx
// DESKRIPSI: Admin dashboard page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  HeartIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge } from '../../components/atoms';
import { Tabs } from '../../components/molecules';
import { StatsCard } from '../../components/molecules';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
    fetchSystemHealth();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stats');
      setDashboardData(response.data.data);
      
      // Fetch recent activities
      const activitiesResponse = await api.get('/admin/logs', { params: { limit: 10 } });
      setRecentActivities(activitiesResponse.data.data);
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const response = await api.get('/admin/health');
      setSystemHealth(response.data.data);
    } catch (error) {
      console.error('Error fetching system health:', error);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    fetchSystemHealth();
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users' },
    { key: 'system', label: 'System' },
    { key: 'logs', label: 'Logs' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <Typography variant="h4" className="mb-2">
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="secondary">
            Selamat datang, {user?.full_name}
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Refresh
          </Button>
          <Link to="/admin/settings">
            <Button variant="outline">
              <Cog6ToothIcon className="w-5 h-5 mr-2" />
              Pengaturan
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total Users"
          value={dashboardData?.overview?.total_users || 0}
          icon={UserGroupIcon}
          color="primary"
        />
        <StatsCard
          title="Total Donors"
          value={dashboardData?.overview?.total_donors || 0}
          icon={HeartIcon}
          color="success"
        />
        <StatsCard
          title="Total Hospitals"
          value={dashboardData?.overview?.total_hospitals || 0}
          icon={BuildingOfficeIcon}
          color="info"
        />
        <StatsCard
          title="Total Blood Stock"
          value={dashboardData?.overview?.total_blood_stock || 0}
          icon={BeakerIcon}
          color="purple"
        />
      </motion.div>

      {/* System Health Alert */}
      {systemHealth && systemHealth.database?.status !== 'healthy' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="danger" className="border-red-200">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
              <div>
                <Typography variant="body2" weight="bold" className="text-red-800 mb-1">
                  System Alert: Database Connection Issue
                </Typography>
                <Typography variant="caption" className="text-red-700">
                  Database status: {systemHealth.database?.status}. Please check your database connection.
                </Typography>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <Card className="p-2">
        <Tabs
          tabs={tabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          variant="pill"
        />
      </Card>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* User Stats */}
            <Card>
              <Typography variant="h6" className="mb-4">
                User Statistics
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total Pendonor</span>
                  <span className="font-bold text-primary-600">{dashboardData?.overview?.total_donors || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total Pasien</span>
                  <span className="font-bold text-primary-600">{dashboardData?.overview?.total_patients || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total PMI</span>
                  <span className="font-bold text-primary-600">{dashboardData?.overview?.total_pmi || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total Sukarelawan</span>
                  <span className="font-bold text-primary-600">{dashboardData?.overview?.total_volunteers || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Verified Users</span>
                  <span className="font-bold text-green-600">{dashboardData?.overview?.verified_users || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Unverified Users</span>
                  <span className="font-bold text-yellow-600">{dashboardData?.overview?.unverified_users || 0}</span>
                </div>
              </div>
            </Card>

            {/* Request Stats */}
            <Card>
              <Typography variant="h6" className="mb-4">
                Request Statistics
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total Requests</span>
                  <span className="font-bold text-primary-600">{dashboardData?.overview?.total_requests || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Pending Requests</span>
                  <span className="font-bold text-yellow-600">{dashboardData?.overview?.pending_requests || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Emergency Requests</span>
                  <span className="font-bold text-red-600">{dashboardData?.overview?.emergency_requests || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total Donations</span>
                  <span className="font-bold text-primary-600">{dashboardData?.overview?.total_donations || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total Appointments</span>
                  <span className="font-bold text-primary-600">{dashboardData?.overview?.total_appointments || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Upcoming Appointments</span>
                  <span className="font-bold text-primary-600">{dashboardData?.overview?.upcoming_appointments || 0}</span>
                </div>
              </div>
            </Card>

            {/* Daily Activity Chart */}
            <Card className="lg:col-span-2">
              <Typography variant="h6" className="mb-4">
                Daily Activity (Last 30 Days)
              </Typography>
              <div className="h-64 flex items-end space-x-2">
                {dashboardData?.daily_activity?.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary-500 rounded-t"
                      style={{ height: `${Math.min(day.interactions / 10, 200)}px` }}
                      title={`${day.date}: ${day.interactions} interactions`}
                    />
                    <Typography variant="caption" className="mt-2 text-xs rotate-45">
                      {new Date(day.date).getDate()}
                    </Typography>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6">
                  User Management
                </Typography>
                <Link to="/admin/users">
                  <Button variant="primary" size="sm">
                    Manage Users
                  </Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bergabung</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Sample data - in real app, this would come from API */}
                    <tr>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-primary-600">JD</span>
                          </div>
                          <div>
                            <Typography variant="body2" weight="medium">John Doe</Typography>
                            <Typography variant="caption" color="secondary">john@example.com</Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="primary">Pendonor</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="success">Aktif</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">12 Jan 2024</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline">Edit</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Database Info */}
            <Card>
              <Typography variant="h6" className="mb-4">
                Database Information
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Status</span>
                  <Badge variant={systemHealth?.database?.status === 'healthy' ? 'success' : 'danger'}>
                    {systemHealth?.database?.status || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Size</span>
                  <span className="font-medium">{systemHealth?.database?.size_mb || 0} MB</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Active Connections</span>
                  <span className="font-medium">{systemHealth?.database?.active_connections || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total Users</span>
                  <span className="font-medium">{systemHealth?.database?.tables?.users || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total Requests</span>
                  <span className="font-medium">{systemHealth?.database?.tables?.requests || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Total Donations</span>
                  <span className="font-medium">{systemHealth?.database?.tables?.donations || 0}</span>
                </div>
              </div>
            </Card>

            {/* Server Info */}
            <Card>
              <Typography variant="h6" className="mb-4">
                Server Information
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Uptime</span>
                  <span className="font-medium">
                    {Math.floor((systemHealth?.server?.uptime || 0) / 3600)} jam
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Memory Usage</span>
                  <span className="font-medium">
                    {Math.round((systemHealth?.server?.memory?.heapUsed || 0) / 1024 / 1024)} MB
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Node Version</span>
                  <span className="font-medium">{systemHealth?.server?.node_version || '-'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Platform</span>
                  <span className="font-medium">{systemHealth?.server?.platform || '-'}</span>
                </div>
              </div>
            </Card>

            {/* Storage Usage */}
            <Card className="lg:col-span-2">
              <Typography variant="h6" className="mb-4">
                Storage Usage
              </Typography>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Typography variant="body2">Database Records</Typography>
                    <Typography variant="body2" weight="medium">
                      {systemHealth?.storage_usage?.history_records || 0} records
                    </Typography>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Typography variant="body2">Activity Logs</Typography>
                    <Typography variant="body2" weight="medium">
                      {systemHealth?.storage_usage?.activity_logs || 0} logs
                    </Typography>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Typography variant="body2">Notifications</Typography>
                    <Typography variant="body2" weight="medium">
                      {systemHealth?.storage_usage?.notifications || 0} notifications
                    </Typography>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6">
                  Recent Activity Logs
                </Typography>
                <Link to="/admin/logs">
                  <Button variant="outline" size="sm">
                    View All Logs
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {recentActivities.map((log, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <Typography variant="body2" weight="medium" className="mb-1">
                          {log.action}
                        </Typography>
                        <Typography variant="caption" color="secondary">
                          User ID: {log.user_id || 'System'} • {new Date(log.created_at).toLocaleString()}
                        </Typography>
                        {log.details && (
                          <Typography variant="caption" className="mt-1 block">
                            Details: {JSON.stringify(log.details)}
                          </Typography>
                        )}
                      </div>
                      <Badge variant="secondary">Log</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;