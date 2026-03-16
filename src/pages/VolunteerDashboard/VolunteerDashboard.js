/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/VolunteerDashboard/VolunteerDashboard.jsx
// DESKRIPSI: Volunteer dashboard page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  HeartIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge } from '../../components/atoms';
import { Tabs } from '../../components/molecules';
import { StatsCard } from '../../components/molecules';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/volunteer/dashboard');
      setDashboardData(response.data.data);
      setPendingVerifications(response.data.data.pending_verifications || []);
      setUrgentRequests(response.data.data.urgent_requests || []);
      setActivities(response.data.data.activities || []);
    } catch (error) {
      console.error('Error fetching volunteer dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (id) => {
    // Navigate to verification page
    // navigate(`/volunteer/verify/${id}`);
  };

  const handleCoordinate = (id) => {
    // Handle coordinate request
    console.log('Coordinate request:', id);
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'verification', label: 'Verifikasi' },
    { key: 'requests', label: 'Permintaan' },
    { key: 'activities', label: 'Kegiatan' }
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
            Dashboard Sukarelawan
          </Typography>
          <Typography variant="body2" color="secondary">
            Selamat datang, {user?.full_name}
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          <Link to="/volunteer/activities/create">
            <Button variant="primary">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Buat Kegiatan
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Location Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="bg-primary-50 border-primary-200">
          <div className="flex items-center">
            <MapPinIcon className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <Typography variant="body2" weight="medium" className="text-primary-800">
                Area Tugas: {dashboardData?.location?.city}, {dashboardData?.location?.province}
              </Typography>
              <Typography variant="caption" color="secondary">
                {dashboardData?.stats?.total_donors_in_area || 0} pendonor • {dashboardData?.stats?.total_hospitals_in_area || 0} rumah sakit
              </Typography>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Verifikasi Pending"
          value={dashboardData?.stats?.pending_verifications || 0}
          icon={UserGroupIcon}
          color="warning"
        />
        <StatsCard
          title="Permintaan Aktif"
          value={dashboardData?.stats?.active_requests?.total || 0}
          icon={HeartIcon}
          color="primary"
        />
        <StatsCard
          title="Gawat Darurat"
          value={dashboardData?.stats?.active_requests?.emergency || 0}
          icon={ExclamationTriangleIcon}
          color="danger"
        />
        <StatsCard
          title="Kegiatan Aktif"
          value={dashboardData?.stats?.active_activities || 0}
          icon={ClockIcon}
          color="success"
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Pending Verifications */}
            <Card>
              <Typography variant="h6" className="mb-4">
                Verifikasi Pending
              </Typography>
              {pendingVerifications.length > 0 ? (
                <div className="space-y-3">
                  {pendingVerifications.slice(0, 3).map((donor) => (
                    <div key={donor.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <Typography variant="body2" weight="medium" className="mb-1">
                            {donor.full_name}
                          </Typography>
                          <Typography variant="caption" color="secondary">
                            {donor.blood_type} • {donor.city}
                          </Typography>
                        </div>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleVerify(donor.id)}
                        >
                          Verifikasi
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingVerifications.length > 3 && (
                    <div className="text-center">
                      <Link to="/volunteer/verify" className="text-sm text-primary-600 hover:text-primary-700">
                        +{pendingVerifications.length - 3} lainnya
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Typography variant="body2" color="secondary" className="text-center py-4">
                  Tidak ada verifikasi pending
                </Typography>
              )}
            </Card>

            {/* Urgent Requests */}
            <Card>
              <Typography variant="h6" className="mb-4">
                Permintaan Gawat Darurat
              </Typography>
              {urgentRequests.length > 0 ? (
                <div className="space-y-3">
                  {urgentRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <Typography variant="body2" weight="medium" className="mb-1">
                            {request.blood_type} - {request.quantity} kantong
                          </Typography>
                          <Typography variant="caption" color="secondary">
                            {request.patient_city} • {request.patient_name}
                          </Typography>
                        </div>
                        <Badge variant="danger">Darurat</Badge>
                      </div>
                    </div>
                  ))}
                  {urgentRequests.length > 3 && (
                    <div className="text-center">
                      <Link to="/requests?urgency=gawat_darurat" className="text-sm text-primary-600 hover:text-primary-700">
                        Lihat semua
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Typography variant="body2" color="secondary" className="text-center py-4">
                  Tidak ada permintaan darurat
                </Typography>
              )}
            </Card>

            {/* Recent Activities */}
            <Card className="lg:col-span-2">
              <Typography variant="h6" className="mb-4">
                Aktivitas yang Perlu Koordinasi
              </Typography>
              {activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={`${activity.type}-${activity.id}`} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Typography variant="body2" weight="medium" className="mb-1">
                            {activity.title}
                          </Typography>
                          <Typography variant="caption" color="secondary">
                            {activity.user_name} • {new Date(activity.created_at).toLocaleDateString()}
                          </Typography>
                        </div>
                        <Button size="sm" variant="outline">
                          Koordinasi
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="secondary" className="text-center py-4">
                  Tidak ada aktivitas yang perlu koordinasi
                </Typography>
              )}
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
                Daftar Verifikasi Pendonor
              </Typography>
              {pendingVerifications.length > 0 ? (
                <div className="space-y-4">
                  {pendingVerifications.map((donor) => (
                    <div key={donor.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Typography variant="body2" weight="medium" className="mb-2">
                            {donor.full_name}
                          </Typography>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                            <div>
                              <Typography variant="caption" color="secondary">
                                Gol. Darah
                              </Typography>
                              <Typography variant="body2">{donor.blood_type || '-'}</Typography>
                            </div>
                            <div>
                              <Typography variant="caption" color="secondary">
                                Telepon
                              </Typography>
                              <Typography variant="body2">{donor.phone || '-'}</Typography>
                            </div>
                            <div>
                              <Typography variant="caption" color="secondary">
                                Kota
                              </Typography>
                              <Typography variant="body2">{donor.city || '-'}</Typography>
                            </div>
                            <div>
                              <Typography variant="caption" color="secondary">
                                Bergabung
                              </Typography>
                              <Typography variant="body2">
                                {new Date(donor.created_at).toLocaleDateString()}
                              </Typography>
                            </div>
                          </div>
                        </div>
                        <Link to={`/volunteer/verify/${donor.id}`}>
                          <Button size="sm" variant="primary">
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
                Permintaan Donor Aktif
              </Typography>
              {urgentRequests.length > 0 ? (
                <div className="space-y-4">
                  {urgentRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="primary">{request.blood_type}</Badge>
                            <Badge variant="danger">Gawat Darurat</Badge>
                          </div>
                          <Typography variant="body2" className="mb-1">
                            {request.patient_name}
                          </Typography>
                          <Typography variant="caption" color="secondary">
                            {request.patient_city} • {request.quantity} kantong
                          </Typography>
                          {request.notes && (
                            <Typography variant="caption" className="mt-2 block">
                              Catatan: {request.notes}
                            </Typography>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleCoordinate(request.id)}
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                          Koordinasi
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="secondary" className="text-center py-4">
                  Tidak ada permintaan aktif
                </Typography>
              )}
            </Card>
          </motion.div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <Typography variant="h6" className="mb-4">
                Kegiatan Sosialisasi
              </Typography>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <Typography variant="body2" weight="medium" className="mb-2">
                            {activity.title}
                          </Typography>
                          <Typography variant="caption" color="secondary" className="block mb-2">
                            {activity.description}
                          </Typography>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>📍 {activity.location}</span>
                            <span>📅 {new Date(activity.date).toLocaleDateString()}</span>
                            <span>👥 {activity.participants} peserta</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <Typography variant="body2" color="secondary">
                    Belum ada kegiatan
                  </Typography>
                  <Link to="/volunteer/activities/create" className="mt-4 inline-block">
                    <Button variant="primary" size="sm">
                      Buat Kegiatan
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;