/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/PatientDashboard/PatientDashboard.jsx
// DESKRIPSI: Patient dashboard page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge } from '../../components/atoms';
import { StatsCard, RequestCard, UrgencyBadge } from '../../components/molecules';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeRequests, setActiveRequests] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/patient/dashboard');
      setDashboardData(response.data.data);
      setActiveRequests(response.data.data.active_requests || []);
      setRecentRequests(response.data.data.request_history || []);
      setUpcomingAppointments(response.data.data.upcoming_appointments || []);
      setNearbyHospitals(response.data.data.nearby_hospitals || []);
    } catch (error) {
      console.error('Error fetching patient dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white"
      >
        <Typography variant="h4" className="mb-2">
          Halo, {user?.full_name?.split(' ')[0]}!
        </Typography>
        <Typography variant="body1" className="opacity-90">
          Kami siap membantu Anda menemukan donor darah yang dibutuhkan.
        </Typography>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Permintaan Aktif"
          value={dashboardData?.stats?.active_requests || 0}
          icon={HeartIcon}
          color="primary"
        />
        <StatsCard
          title="Total Permintaan"
          value={dashboardData?.stats?.total_requests || 0}
          icon={ClockIcon}
          color="info"
        />
        <StatsCard
          title="Respon Masuk"
          value={dashboardData?.stats?.total_responses || 0}
          icon={ChatBubbleLeftRightIcon}
          color="success"
        />
        <StatsCard
          title="Janji Temu"
          value={dashboardData?.stats?.upcoming_appointments || 0}
          icon={CalendarIcon}
          color="purple"
        />
      </motion.div>

      {/* Quick Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link to="/requests/create">
          <Card className="bg-primary-50 border-2 border-primary-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" className="text-primary-800 mb-1">
                  Butuh Donor Darah?
                </Typography>
                <Typography variant="body2" color="secondary">
                  Buat permintaan donor sekarang, kami akan mencari pendonor yang cocok
                </Typography>
              </div>
              <Button variant="primary" size="lg">
                <PlusIcon className="w-5 h-5 mr-2" />
                Buat Permintaan
              </Button>
            </div>
          </Card>
        </Link>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Active Requests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Active Requests */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6">
                Permintaan Aktif
              </Typography>
              <Link to="/requests" className="text-primary-600 hover:text-primary-700 text-sm">
                Lihat Semua
              </Link>
            </div>

            {activeRequests.length > 0 ? (
              <div className="space-y-4">
                {activeRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Typography variant="body2" color="secondary">
                  Tidak ada permintaan aktif
                </Typography>
                <Link to="/requests/create" className="mt-4 inline-block">
                  <Button variant="primary" size="sm">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Buat Permintaan
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Recent Responses */}
          <Card>
            <Typography variant="h6" className="mb-4">
              Respon Terbaru dari Pendonor
            </Typography>
            {dashboardData?.recent_responses?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recent_responses.map((response) => (
                  <div key={response.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Typography variant="body2" weight="medium">
                        {response.donor_name}
                      </Typography>
                      <Badge variant={
                        response.response_status === 'tersedia' ? 'success' :
                        response.response_status === 'pertimbangan' ? 'warning' : 'danger'
                      }>
                        {response.response_status}
                      </Badge>
                    </div>
                    <Typography variant="caption" color="secondary">
                      {response.notes || 'Tidak ada catatan'}
                    </Typography>
                    {response.estimated_time && (
                      <Typography variant="caption" color="primary" className="mt-1 block">
                        Estimasi: {new Date(response.estimated_time).toLocaleString()}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant="body2" color="secondary" className="text-center py-4">
                Belum ada respon dari pendonor
              </Typography>
            )}
          </Card>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Upcoming Appointments */}
          <Card>
            <Typography variant="h6" className="mb-4">
              Janji Temu Mendatang
            </Typography>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="p-3 bg-gray-50 rounded-lg">
                    <Typography variant="body2" weight="medium" className="mb-1">
                      {apt.hospital_name}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {new Date(apt.appointment_date).toLocaleDateString('id-ID')} • {apt.appointment_time}
                    </Typography>
                    <Badge variant={apt.status === 'dikonfirmasi' ? 'success' : 'warning'} className="mt-2">
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant="body2" color="secondary" className="text-center py-4">
                Tidak ada janji temu
              </Typography>
            )}
            <Link to="/appointments/create" className="mt-4 block">
              <Button variant="outline" size="sm" fullWidth>
                <CalendarIcon className="w-4 h-4 mr-2" />
                Buat Janji Temu
              </Button>
            </Link>
          </Card>

          {/* Nearby Hospitals */}
          <Card>
            <Typography variant="h6" className="mb-4">
              Rumah Sakit Terdekat
            </Typography>
            {nearbyHospitals.length > 0 ? (
              <div className="space-y-3">
                {nearbyHospitals.map((hospital) => (
                  <div key={hospital.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <BuildingOfficeIcon className="w-4 h-4 text-primary-600 mr-2 mt-0.5" />
                    <div>
                      <Typography variant="body2" weight="medium">
                        {hospital.name}
                      </Typography>
                      <Typography variant="caption" color="secondary">
                        {hospital.distance} km • {hospital.city}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant="body2" color="secondary" className="text-center py-4">
                Aktifkan GPS untuk melihat RS terdekat
              </Typography>
            )}
            <Link to="/hospitals" className="mt-4 block">
              <Button variant="outline" size="sm" fullWidth>
                Lihat Semua RS
              </Button>
            </Link>
          </Card>

          {/* Blood Type Info */}
          <Card variant="info" className="bg-blue-50">
            <Typography variant="body2" weight="bold" className="text-blue-800 mb-2">
              Golongan Darah Anda
            </Typography>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h2" color="primary" className="mb-1">
                  {user?.blood_type || '-'}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {user?.rhesus || 'Tidak diketahui'}
                </Typography>
              </div>
              <HeartIcon className="w-12 h-12 text-primary-400" />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;