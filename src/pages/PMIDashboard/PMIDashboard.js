/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/PMIDashboard/PMIDashboard.jsx
// DESKRIPSI: PMI dashboard page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge } from '../../components/atoms';
import { StatsCard, Tabs } from '../../components/molecules';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const PMIDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [bloodStock, setBloodStock] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [stockMovement, setStockMovement] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pmi/dashboard');
      setDashboardData(response.data.data);
      setBloodStock(response.data.data.blood_stock || []);
      setPendingVerifications(response.data.data.pending_verifications || []);
      setRecentRequests(response.data.data.recent_requests || []);
      setStockMovement(response.data.data.stock_movement || []);
    } catch (error) {
      console.error('Error fetching PMI dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatusColor = (quantity) => {
    if (quantity < 10) return 'danger';
    if (quantity < 20) return 'warning';
    return 'success';
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'stock', label: 'Stok Darah' },
    { key: 'verification', label: 'Verifikasi' },
    { key: 'requests', label: 'Permintaan' }
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
            Dashboard PMI
          </Typography>
          <Typography variant="body2" color="secondary">
            Selamat datang, {user?.full_name} • {dashboardData?.branch_info?.branch_name}
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchDashboardData}>
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Refresh
          </Button>
          <Link to="/pmi/stock">
            <Button variant="primary">
              <BeakerIcon className="w-5 h-5 mr-2" />
              Kelola Stok
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
          title="Total Stok"
          value={dashboardData?.stats?.total_stock || 0}
          icon={BeakerIcon}
          color="primary"
        />
        <StatsCard
          title="Stok Kritis"
          value={dashboardData?.stats?.critical_stock || 0}
          icon={ExclamationTriangleIcon}
          color="danger"
        />
        <StatsCard
          title="Verifikasi Pending"
          value={dashboardData?.stats?.pending_verifications || 0}
          icon={UserGroupIcon}
          color="warning"
        />
        <StatsCard
          title="Permintaan Darurat"
          value={dashboardData?.stats?.emergency_requests || 0}
          icon={ClockIcon}
          color="purple"
        />
      </motion.div>

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
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Branch Info */}
            <Card className="lg:col-span-1">
              <Typography variant="h6" className="mb-4">
                Informasi Cabang
              </Typography>
              <div className="space-y-3">
                <div>
                  <Typography variant="caption" color="secondary">
                    Nama Cabang
                  </Typography>
                  <Typography variant="body2" weight="medium">
                    {dashboardData?.branch_info?.branch_name}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="secondary">
                    Alamat
                  </Typography>
                  <Typography variant="body2">
                    {dashboardData?.branch_info?.address}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="secondary">
                    Kontak
                  </Typography>
                  <Typography variant="body2">
                    {dashboardData?.branch_info?.phone}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="secondary">
                    Email
                  </Typography>
                  <Typography variant="body2">
                    {dashboardData?.branch_info?.email}
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Stock Summary */}
            <Card className="lg:col-span-2">
              <Typography variant="h6" className="mb-4">
                Ringkasan Stok Darah
              </Typography>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bloodStock.map((stock) => (
                  <div key={stock.blood_type} className="text-center p-3 bg-gray-50 rounded-lg">
                    <Typography variant="h5" weight="bold" className="mb-1">
                      {stock.blood_type}
                    </Typography>
                    <Typography variant="h4" className="mb-2">
                      {stock.total_quantity}
                    </Typography>
                    <Badge variant={getStockStatusColor(stock.total_quantity)}>
                      {stock.critical > 0 ? `${stock.critical} kritis` : 'Aman'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stock Movement Chart */}
            <Card className="lg:col-span-3">
              <Typography variant="h6" className="mb-4">
              Pergerakan Stok 7 Hari Terakhir
              </Typography>
              <div className="h-64 flex items-end space-x-4">
                {stockMovement.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex justify-center space-x-1">
                      <div 
                        className="w-4 bg-green-500 rounded-t"
                        style={{ height: `${day.additions}px` }}
                        title={`Penambahan: ${day.additions}`}
                      />
                      <div 
                        className="w-4 bg-red-500 rounded-t"
                        style={{ height: `${day.reductions}px` }}
                        title={`Pengurangan: ${day.reductions}`}
                      />
                    </div>
                    <Typography variant="caption" className="mt-2">
                      {new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                    </Typography>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stock Tab */}
        {activeTab === 'stock' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Critical Stock Alert */}
            {dashboardData?.stats?.critical_stock > 0 && (
              <Card variant="danger" className="border-red-200">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
                  <div>
                    <Typography variant="body2" weight="bold" className="text-red-800 mb-1">
                      Stok Kritis!
                    </Typography>
                    <Typography variant="caption" className="text-red-700">
                      Terdapat {dashboardData.stats.critical_stock} jenis golongan darah dengan stok kritis.
                      Segera lakukan himbauan donor.
                    </Typography>
                  </div>
                </div>
              </Card>
            )}

            {/* Blood Stock Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Gol. Darah</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jumlah</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Lokasi</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Update Terakhir</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bloodStock.flatMap(stock => 
                      stock.locations?.map((location, idx) => (
                        <tr key={`${stock.blood_type}-${idx}`}>
                          <td className="px-4 py-3">
                            <Badge variant="primary">{stock.blood_type}</Badge>
                          </td>
                          <td className="px-4 py-3 font-medium">{location.quantity}</td>
                          <td className="px-4 py-3">
                            <Badge variant={getStockStatusColor(location.quantity)}>
                              {location.quantity < 10 ? 'Kritis' : location.quantity < 20 ? 'Waspada' : 'Aman'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">{location.location_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(location.last_updated).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <Button size="sm" variant="outline">
                              Update
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Verification Tab */}
        {activeTab === 'verification' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <Typography variant="h6" className="mb-4">
                Verifikasi Pendonor ({pendingVerifications.length})
              </Typography>

              {pendingVerifications.length > 0 ? (
                <div className="space-y-4">
                  {pendingVerifications.map((donor) => (
                    <div key={donor.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <Typography variant="body2" weight="medium" className="mb-1">
                            {donor.full_name}
                          </Typography>
                          <Typography variant="caption" color="secondary" className="block mb-2">
                            {donor.email} • {donor.phone}
                          </Typography>
                          <div className="flex items-center space-x-2">
                            <Badge variant="primary">{donor.blood_type}</Badge>
                            <Badge variant="secondary">{donor.city}</Badge>
                          </div>
                          <Typography variant="caption" color="secondary" className="mt-2 block">
                            Mendaftar: {new Date(donor.created_at).toLocaleDateString()}
                          </Typography>
                        </div>
                        <Link to={`/pmi/verify/${donor.id}`}>
                          <Button size="sm" variant="primary">
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Verifikasi
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <Typography variant="body2" color="secondary">
                    Tidak ada pendonor yang perlu diverifikasi
                  </Typography>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <Typography variant="h6" className="mb-4">
                Permintaan Terbaru
              </Typography>

              {recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="primary">{request.blood_type}</Badge>
                            <Badge variant={
                              request.urgency === 'gawat_darurat' ? 'danger' :
                              request.urgency === 'urgent' ? 'warning' : 'info'
                            }>
                              {request.urgency}
                            </Badge>
                          </div>
                          <Typography variant="body2" weight="medium" className="mb-1">
                            {request.patient_name}
                          </Typography>
                          <Typography variant="caption" color="secondary" className="block mb-2">
                            {request.patient_city} • {request.quantity} kantong
                          </Typography>
                          {request.hospital_name && (
                            <Typography variant="caption" color="secondary">
                              RS: {request.hospital_name}
                            </Typography>
                          )}
                        </div>
                        <Link to={`/requests/${request.id}`}>
                          <Button size="sm" variant="outline">
                            Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="secondary" className="text-center py-4">
                  Belum ada permintaan
                </Typography>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PMIDashboard;