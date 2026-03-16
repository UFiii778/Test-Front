/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Profile/Profile.jsx
// DESKRIPSI: User profile page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  CalendarIcon,
  PencilIcon,
  CameraIcon,
  CheckBadgeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Avatar, Badge, Spinner, Divider } from '../../components/atoms';
import { StatsCard, Tabs } from '../../components/molecules';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { formatDate } from '../../utils/dateFormatter';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data.data);
      
      // Fetch additional data based on role
      if (user?.role === 'pendonor') {
        const statsResponse = await api.get('/donor/stats');
        setStats(statsResponse.data.data);
        
        const historyResponse = await api.get('/donor/history', { params: { limit: 5 } });
        setRecentActivities(historyResponse.data.data.history);
      } else if (user?.role === 'pasien') {
        const requestsResponse = await api.get('/requests', { 
          params: { patient_id: user.id, limit: 5 } 
        });
        setRecentActivities(requestsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const response = await api.post('/users/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({ ...profile, profile_picture: response.data.data.url });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      pmi: 'bg-blue-100 text-blue-800',
      sukarelawan: 'bg-green-100 text-green-800',
      pasien: 'bg-yellow-100 text-yellow-800',
      pendonor: 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Admin',
      pmi: 'PMI',
      sukarelawan: 'Sukarelawan',
      pasien: 'Pasien',
      pendonor: 'Pendonor'
    };
    return labels[role] || role;
  };

  const tabs = [
    { key: 'info', label: 'Informasi Pribadi' },
    { key: 'activity', label: 'Aktivitas' },
    { key: 'security', label: 'Keamanan' }
  ];

  if (user?.role === 'pendonor') {
    tabs.splice(1, 0, { key: 'donations', label: 'Riwayat Donor' });
  }

  if (user?.role === 'pasien') {
    tabs.splice(1, 0, { key: 'requests', label: 'Permintaan' });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700" />
          
          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <div className="relative group">
                <Avatar
                  src={profile?.profile_picture}
                  name={profile?.full_name}
                  size="xl"
                  className="border-4 border-white shadow-lg"
                />
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <CameraIcon className="w-4 h-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* User Info */}
            <div className="ml-36 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h4" className="mb-1">
                    {profile?.full_name}
                  </Typography>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getRoleBadgeColor(user?.role)}>
                      {getRoleLabel(user?.role)}
                    </Badge>
                    {profile?.is_verified && (
                      <Badge variant="success" icon={CheckBadgeIcon}>
                        Terverifikasi
                      </Badge>
                    )}
                  </div>
                </div>
                <Link to="/profile/edit">
                  <Button variant="outline" size="sm">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Profil
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Cards (for donors) */}
      {user?.role === 'pendonor' && stats.overview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <StatsCard
            title="Total Donor"
            value={stats.overview.total_donations || 0}
            icon={HeartIcon}
            color="primary"
          />
          <StatsCard
            title="Total Darah"
            value={`${stats.overview.total_blood_donated || 0} L`}
            icon={DocumentTextIcon}
            color="success"
          />
          <StatsCard
            title="Rata-rata"
            value={`${stats.overview.avg_donation || 0} L`}
            icon={CalendarIcon}
            color="info"
          />
          <StatsCard
            title="Tahun Aktif"
            value={stats.overview.active_years || 0}
            icon={UserIcon}
            color="purple"
          />
        </motion.div>
      )}

      {/* Tabs */}
      <Card>
        <Tabs
          tabs={tabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />

        {/* Tab Content */}
        <div className="mt-6">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="body2" weight="bold" className="mb-3">
                    Informasi Kontak
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <EnvelopeIcon className="w-5 h-5 mr-3" />
                      <span>{profile?.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <PhoneIcon className="w-5 h-5 mr-3" />
                      <span>{profile?.phone || 'Belum diisi'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Typography variant="body2" weight="bold" className="mb-3">
                    Informasi Pribadi
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <HeartIcon className="w-5 h-5 mr-3" />
                      <span>Golongan Darah: {profile?.blood_type || 'Belum diisi'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="w-5 h-5 mr-3" />
                      <span>Rhesus: {profile?.rhesus || 'Belum diisi'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              <div>
                <Typography variant="body2" weight="bold" className="mb-3">
                  Alamat
                </Typography>
                <div className="flex items-start text-gray-600">
                  <MapPinIcon className="w-5 h-5 mr-3 mt-0.5" />
                  <div>
                    <p>{profile?.address || 'Belum diisi'}</p>
                    <p className="text-sm text-gray-500">
                      {profile?.city}, {profile?.province} {profile?.postal_code}
                    </p>
                  </div>
                </div>
              </div>

              {user?.role === 'pendonor' && (
                <>
                  <Divider />
                  <div>
                    <Typography variant="body2" weight="bold" className="mb-3">
                      Informasi Medis
                    </Typography>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Typography variant="caption" color="secondary">
                          Berat Badan
                        </Typography>
                        <Typography variant="h5">
                          {profile?.weight || '-'} kg
                        </Typography>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Typography variant="caption" color="secondary">
                          Tinggi Badan
                        </Typography>
                        <Typography variant="h5">
                          {profile?.height || '-'} cm
                        </Typography>
                      </div>
                    </div>
                    {profile?.medical_notes && (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <Typography variant="caption" weight="bold" className="text-yellow-800">
                          Catatan Medis
                        </Typography>
                        <Typography variant="caption" className="text-yellow-700">
                          {profile.medical_notes}
                        </Typography>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && stats.monthly_breakdown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-4">
                {stats.monthly_breakdown.map((month) => (
                  <Card key={month.month} className="text-center p-4">
                    <Typography variant="body2" weight="bold" className="mb-2">
                      Bulan {month.month}
                    </Typography>
                    <Typography variant="h4" color="primary" className="mb-1">
                      {month.count}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {month.total} kantong
                    </Typography>
                  </Card>
                ))}
              </div>

              <Divider />

              <div>
                <Typography variant="body2" weight="bold" className="mb-3">
                  Rumah Sakit Favorit
                </Typography>
                <div className="space-y-3">
                  {stats.favorite_hospitals?.map((hospital) => (
                    <div key={hospital.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <Typography variant="body2">{hospital.name}</Typography>
                      <Badge variant="primary">{hospital.donation_count}x donor</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <Typography variant="body2" weight="medium">
                          {user?.role === 'pendonor' 
                            ? `Donor ${activity.blood_type} - ${activity.quantity} kantong`
                            : `Permintaan ${activity.blood_type}`
                          }
                        </Typography>
                        <Typography variant="caption" color="secondary">
                          {formatDate(activity.donation_date || activity.created_at)}
                        </Typography>
                      </div>
                      <Badge variant={activity.status === 'berhasil' ? 'success' : 'warning'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="secondary" className="text-center py-8">
                  Belum ada aktivitas
                </Typography>
              )}
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Typography variant="body2" weight="medium">
                    Ubah Password
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    Perbarui password secara berkala untuk keamanan
                  </Typography>
                </div>
                <Link to="/change-password">
                  <Button size="sm">Ubah</Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Typography variant="body2" weight="medium">
                    Verifikasi Email
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    {profile?.is_verified 
                      ? 'Email Anda telah terverifikasi'
                      : 'Verifikasi email untuk mengamankan akun'
                    }
                  </Typography>
                </div>
                {!profile?.is_verified && (
                  <Button size="sm" variant="primary">Verifikasi</Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Typography variant="body2" weight="medium" className="text-red-600">
                    Hapus Akun
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    Tindakan ini tidak dapat dibatalkan
                  </Typography>
                </div>
                <Button size="sm" variant="danger">Hapus</Button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;