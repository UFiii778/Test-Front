/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/DonorDashboard/DonorDashboard.jsx
// DESKRIPSI: Donor dashboard page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge } from '../../components/atoms';
import { StatsCard, RequestCard, DonorCard } from '../../components/molecules';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [matchingRequests, setMatchingRequests] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/donor/dashboard');
      setDashboardData(response.data.data);
      setMatchingRequests(response.data.data.matching_requests || []);
      setUpcomingAppointments(response.data.data.upcoming_appointments || []);
      setRecentDonations(response.data.data.recent_donations || []);
    } catch (error) {
      console.error('Error fetching donor dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (requestId) => {
    // Handle respond to request
    console.log('Respond to request:', requestId);
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
          Terima kasih atas kepedulian Anda. {dashboardData?.stats?.total_donations || 0} donor telah Anda lakukan.
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
          title="Total Donor"
          value={dashboardData?.stats?.total_donations || 0}
          icon={HeartIcon}
          color="primary"
        />
        <StatsCard
          title="Total Respon"
          value={dashboardData?.stats?.total_responses || 0}
          icon={CheckCircleIcon}
          color="success"
        />
        <StatsCard
          title="Terakhir Donor"
          value={dashboardData?.stats?.last_donation || 'Belum pernah'}
          icon={ClockIcon}
          color="info"
        />
        <StatsCard
          title="Donor Tahun Ini"
          value={dashboardData?.stats?.donations_this_year || 0}
          icon={CalendarIcon}
          color="purple"
        />
      </motion.div>

      {/* Eligibility Status */}
      {dashboardData?.eligibility && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant={dashboardData.eligibility.can_donate ? 'success' : 'warning'}>
            <div className="flex items-start">
              {dashboardData.eligibility.can_donate ? (
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
              ) : (
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" />
              )}
              <div>
                <Typography variant="h6" className="mb-1">
                  {dashboardData.eligibility.can_donate 
                    ? 'Anda Siap Donor' 
                    : 'Belum Waktunya Donor'
                  }
                </Typography>
                {dashboardData.eligibility.reasons.map((reason, index) => (
                  <Typography key={index} variant="body2" color="secondary">
                    {reason}
                  </Typography>
                ))}
                {dashboardData.eligibility.next_eligible && (
                  <Typography variant="caption" className="mt-2 block">
                    Dapat donor lagi setelah:{' '}
                    {new Date(dashboardData.eligibility.next_eligible).toLocaleDateString('id-ID')}
                  </Typography>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Matching Requests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6">
                Permintaan yang Cocok
              </Typography>
              <Link to="/requests" className="text-primary-600 hover:text-primary-700 text-sm">
                Lihat Semua
              </Link>
            </div>

            {matchingRequests.length > 0 ? (
              <div className="space-y-4">
                {matchingRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onRespond={handleRespond}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Typography variant="body2" color="secondary">
                  Belum ada permintaan yang cocok
                </Typography>
              </div>
            )}
          </Card>

          {/* Recent Donations */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6">
                Riwayat Donor Terbaru
              </Typography>
              <Link to="/donor/history" className="text-primary-600 hover:text-primary-700 text-sm">
                Lihat Semua
              </Link>
            </div>

            {recentDonations.length > 0 ? (
              <div className="space-y-3">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Typography variant="body2" weight="medium">
                        {donation.blood_type} - {donation.quantity} kantong
                      </Typography>
                      <Typography variant="caption" color="secondary">
                        {donation.hospital_name} • {new Date(donation.donation_date).toLocaleDateString('id-ID')}
                      </Typography>
                    </div>
                    <Badge variant="success">Selesai</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant="body2" color="secondary" className="text-center py-4">
                Belum ada riwayat donor
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
                    <div className="flex items-center justify-between mb-2">
                      <Typography variant="body2" weight="medium">
                        {apt.hospital_name}
                      </Typography>
                      <Badge variant={
                        apt.status === 'dikonfirmasi' ? 'success' : 'warning'
                      }>
                        {apt.status}
                      </Badge>
                    </div>
                    <Typography variant="caption" color="secondary">
                      {new Date(apt.appointment_date).toLocaleDateString('id-ID')} • {apt.appointment_time}
                    </Typography>
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant="body2" color="secondary" className="text-center py-4">
                Tidak ada janji temu
              </Typography>
            )}
            <Link to="/appointments/create">
              <Button variant="outline" size="sm" fullWidth className="mt-4">
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
            <div className="space-y-3">
              {dashboardData?.nearby_hospitals?.map((hospital) => (
                <div key={hospital.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <MapPinIcon className="w-4 h-4 text-primary-600 mr-2 mt-0.5" />
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
          </Card>

          {/* Quick Actions */}
          <Card>
            <Typography variant="h6" className="mb-4">
              Aksi Cepat
            </Typography>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/requests">
                <Button variant="outline" size="sm" fullWidth>
                  Cari Permintaan
                </Button>
              </Link>
              <Link to="/donor/history">
                <Button variant="outline" size="sm" fullWidth>
                  Riwayat
                </Button>
              </Link>
              <Link to="/appointments/create">
                <Button variant="outline" size="sm" fullWidth>
                  Jadwal
                </Button>
              </Link>
              <Link to="/donor/certificates">
                <Button variant="outline" size="sm" fullWidth>
                  Sertifikat
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DonorDashboard;