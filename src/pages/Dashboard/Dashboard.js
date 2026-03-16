/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Dashboard/Dashboard.jsx
// DESKRIPSI: Main dashboard page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  BeakerIcon,
  CalendarIcon,
  ArrowRightIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Spinner, Button } from '../../components/atoms';
import { StatsCard, RequestCard, HospitalCard, UrgencyBadge } from '../../components/molecules';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchDashboardData();
    fetchRecentRequests();
    fetchNearbyHospitals();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data.data);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentRequests = async () => {
    try {
      const response = await api.get('/requests', {
        params: { limit: 3, sort: 'created_at', order: 'DESC' }
      });
      setRecentRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching recent requests:', error);
    }
  };

  const fetchNearbyHospitals = async () => {
    try {
      // Get user location from browser
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await api.get('/hospitals/nearby', {
            params: { lat: latitude, lng: longitude, radius: 10 }
          });
          setNearbyHospitals(response.data.data.slice(0, 3));
        });
      }
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
    }
  };

  // Get welcome message based on time
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 18) return 'Selamat Siang';
    return 'Selamat Malam';
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
          {getWelcomeMessage()}, {user?.full_name?.split(' ')[0]}!
        </Typography>
        <Typography variant="body1" className="opacity-90">
          {user?.role === 'pendonor' && 'Terima kasih atas kepedulian Anda untuk membantu sesama melalui donor darah.'}
          {user?.role === 'pasien' && 'Kami siap membantu Anda menemukan donor darah yang dibutuhkan.'}
          {user?.role === 'sukarelawan' && 'Bantu koordinasikan donor darah di sekitar Anda.'}
          {user?.role === 'pmi' && 'Kelola stok darah dan layanan donor dengan efisien.'}
          {user?.role === 'admin' && 'Selamat datang di panel admin DarahKita.'}
        </Typography>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {user?.role === 'pendonor' && (
          <>
            <StatsCard
              title="Total Donor"
              value={stats.total_donations || 0}
              icon={HeartIcon}
              color="primary"
            />
            <StatsCard
              title="Respon"
              value={stats.total_responses || 0}
              icon={UserGroupIcon}
              color="success"
            />
            <StatsCard
              title="Terakhir Donor"
              value={stats.last_donation || 'Belum pernah'}
              icon={ClockIcon}
              color="info"
            />
            <StatsCard
              title="Matching Requests"
              value={stats.matching_requests || 0}
              icon={BeakerIcon}
              color="warning"
            />
          </>
        )}

        {user?.role === 'pasien' && (
          <>
            <StatsCard
              title="Permintaan Aktif"
              value={stats.active_requests || 0}
              icon={HeartIcon}
              color="primary"
            />
            <StatsCard
              title="Total Permintaan"
              value={stats.total_requests || 0}
              icon={UserGroupIcon}
              color="success"
            />
            <StatsCard
              title="Janji Temu"
              value={stats.upcoming_appointments || 0}
              icon={CalendarIcon}
              color="info"
            />
            <StatsCard
              title="Respon Masuk"
              value={stats.total_responses || 0}
              icon={BeakerIcon}
              color="warning"
            />
          </>
        )}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Requests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Recent Requests */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6">
                {user?.role === 'pendonor' ? 'Permintaan Terdekat' : 'Permintaan Terbaru'}
              </Typography>
              <Link to="/requests" className="text-primary-600 hover:text-primary-700 flex items-center">
                Lihat Semua
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {recentRequests.length > 0 ? (
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BeakerIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Typography variant="body2" color="secondary">
                  Belum ada permintaan donor
                </Typography>
                {user?.role === 'pasien' && (
                  <Link to="/requests/create">
                    <Button variant="primary" size="sm" className="mt-4">
                      Buat Permintaan
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <Typography variant="h6" className="mb-4">
              Aksi Cepat
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user?.role === 'pendonor' && (
                <>
                  <Link to="/requests" className="block p-4 bg-primary-50 rounded-xl text-center hover:bg-primary-100">
                    <HeartIcon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <Typography variant="caption">Cari Permintaan</Typography>
                  </Link>
                  <Link to="/donor/history" className="block p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100">
                    <ClockIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <Typography variant="caption">Riwayat Donor</Typography>
                  </Link>
                  <Link to="/appointments/create" className="block p-4 bg-green-50 rounded-xl text-center hover:bg-green-100">
                    <CalendarIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <Typography variant="caption">Buat Janji</Typography>
                  </Link>
                  <Link to="/donor/certificates" className="block p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100">
                    <BuildingOfficeIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <Typography variant="caption">Sertifikat</Typography>
                  </Link>
                </>
              )}

              {user?.role === 'pasien' && (
                <>
                  <Link to="/requests/create" className="block p-4 bg-primary-50 rounded-xl text-center hover:bg-primary-100">
                    <HeartIcon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <Typography variant="caption">Buat Permintaan</Typography>
                  </Link>
                  <Link to="/hospitals" className="block p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100">
                    <BuildingOfficeIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <Typography variant="caption">Cari RS</Typography>
                  </Link>
                  <Link to="/appointments/create" className="block p-4 bg-green-50 rounded-xl text-center hover:bg-green-100">
                    <CalendarIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <Typography variant="caption">Buat Janji</Typography>
                  </Link>
                  <Link to="/blood-stock" className="block p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100">
                    <BeakerIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <Typography variant="caption">Cek Stok</Typography>
                  </Link>
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Right Column - Hospitals & Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Nearby Hospitals */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6">
                Rumah Sakit Terdekat
              </Typography>
              <Link to="/hospitals" className="text-primary-600 hover:text-primary-700 flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1" />
                Lihat Semua
              </Link>
            </div>

            {nearbyHospitals.length > 0 ? (
              <div className="space-y-4">
                {nearbyHospitals.map((hospital) => (
                  <HospitalCard key={hospital.id} hospital={hospital} showDistance compact />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Typography variant="body2" color="secondary">
                  Aktifkan GPS untuk melihat RS terdekat
                </Typography>
              </div>
            )}
          </Card>

          {/* Emergency Info */}
          <Card variant="danger" className="border-red-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <HeartIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <Typography variant="body2" weight="bold" className="text-red-800 mb-1">
                  Butuh Darurat?
                </Typography>
                <Typography variant="caption" className="text-red-700 mb-2 block">
                  Jika dalam keadaan darurat, segera buat permintaan dengan status GAWAT DARURAT.
                </Typography>
                <Link to="/requests/create">
                  <Button variant="danger" size="sm" fullWidth>
                    Buat Permintaan Darurat
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Donation Tips */}
          <Card variant="gradient">
            <Typography variant="h6" className="mb-3">
              Tips Donor
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-start text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                Istirahat cukup minimal 5 jam sebelum donor
              </li>
              <li className="flex items-start text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                Makan makanan bergizi sebelum donor
              </li>
              <li className="flex items-start text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                Minum air putih yang cukup
              </li>
              <li className="flex items-start text-sm text-gray-600">
                <CheckCircleIcon className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                Bawa identitas diri (KTP)
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;