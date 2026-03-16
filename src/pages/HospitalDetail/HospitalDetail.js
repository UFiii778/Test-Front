/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/HospitalDetail/HospitalDetail.jsx
// DESKRIPSI: Hospital detail page
// =====================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon,
  BuildingOfficeIcon,
  HeartIcon,
  CalendarIcon,
  ArrowLeftIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge, Divider } from '../../components/atoms';
import { Breadcrumb } from '../../components/molecules';
import api from '../../services/api';
import { formatDistanceToNow } from '../../utils/dateFormatter';

const HospitalDetail = () => {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetchHospitalDetail();
  }, [id]);

  const fetchHospitalDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/hospitals/${id}`);
      setHospital(response.data.data);
    } catch (error) {
      console.error('Error fetching hospital detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'kritis': return 'danger';
      case 'waspada': return 'warning';
      case 'aman': return 'success';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="text-center py-12">
        <Typography variant="h5" color="danger">
          Rumah sakit tidak ditemukan
        </Typography>
        <Link to="/hospitals" className="mt-4 inline-block">
          <Button variant="primary">Kembali ke Daftar</Button>
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Rumah Sakit', path: '/hospitals' },
    { label: hospital.name }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 rounded-2xl overflow-hidden"
      >
        {hospital.image_url ? (
          <img
            src={hospital.image_url}
            alt={hospital.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center">
            <BuildingOfficeIcon className="w-24 h-24 text-white opacity-50" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
        {/* Hospital Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center mb-2">
            <Typography variant="h3" className="mr-3">
              {hospital.name}
            </Typography>
            {hospital.is_verified && (
              <CheckBadgeIcon className="w-6 h-6 text-primary-400" title="Terverifikasi" />
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span>{hospital.city}, {hospital.province}</span>
            </div>
            {hospital.distance && (
              <div className="flex items-center">
                <TruckIcon className="w-4 h-4 mr-1" />
                <span>{hospital.distance} km</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Card>
        <div className="flex space-x-1 border-b border-gray-200">
          {['info', 'blood-stock', 'facilities', 'contacts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {tab === 'info' && 'Informasi'}
              {tab === 'blood-stock' && 'Stok Darah'}
              {tab === 'facilities' && 'Fasilitas'}
              {tab === 'contacts' && 'Kontak'}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <Typography variant="body2" weight="bold" className="mb-2">
                  Alamat Lengkap
                </Typography>
                <Typography variant="body2" color="secondary">
                  {hospital.address}
                </Typography>
              </div>

              <Divider />

              <div>
                <Typography variant="body2" weight="bold" className="mb-2">
                  Jam Operasional
                </Typography>
                <Typography variant="body2" color="secondary">
                  {hospital.operating_hours || '24 Jam'}
                </Typography>
              </div>

              {hospital.emergency_phone && (
                <>
                  <Divider />
                  <div className="bg-red-50 p-4 rounded-lg">
                    <Typography variant="body2" weight="bold" className="text-red-800 mb-2">
                      IGD / Darurat
                    </Typography>
                    <Typography variant="body2" className="text-red-700">
                      {hospital.emergency_phone}
                    </Typography>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Blood Stock Tab */}
          {activeTab === 'blood-stock' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {hospital.blood_stock && hospital.blood_stock.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hospital.blood_stock.map((stock) => (
                    <Card key={stock.blood_type} className="text-center p-4">
                      <Typography variant="h5" weight="bold" className="mb-2">
                        {stock.blood_type}
                      </Typography>
                      <Typography variant="h3" className="mb-2">
                        {stock.quantity}
                      </Typography>
                      <Badge variant={getStockStatusColor(stock.status)}>
                        {stock.status}
                      </Badge>
                      <Typography variant="caption" color="secondary" className="mt-2 block">
                        Kantong
                      </Typography>
                    </Card>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="secondary" className="text-center py-8">
                  Informasi stok darah tidak tersedia
                </Typography>
              )}

              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <Typography variant="caption" color="primary">
                  ℹ️ Stok darah diperbarui setiap hari oleh petugas PMI
                </Typography>
              </div>
            </motion.div>
          )}

          {/* Facilities Tab */}
          {activeTab === 'facilities' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {hospital.facilities && hospital.facilities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hospital.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <CheckBadgeIcon className="w-5 h-5 text-green-600 mr-2" />
                      <Typography variant="body2">{facility}</Typography>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" color="secondary" className="text-center py-8">
                  Informasi fasilitas tidak tersedia
                </Typography>
              )}
            </motion.div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <Typography variant="body2" weight="bold">
                      Telepon
                    </Typography>
                    <Typography variant="body2" color="secondary">
                      {hospital.phone || 'Tidak tersedia'}
                    </Typography>
                  </div>
                </div>
                {hospital.phone && (
                  <a href={`tel:${hospital.phone}`}>
                    <Button size="sm">Hubungi</Button>
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <Typography variant="body2" weight="bold">
                      Email
                    </Typography>
                    <Typography variant="body2" color="secondary">
                      {hospital.email || 'Tidak tersedia'}
                    </Typography>
                  </div>
                </div>
                {hospital.email && (
                  <a href={`mailto:${hospital.email}`}>
                    <Button size="sm">Kirim Email</Button>
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <HeartIcon className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <Typography variant="body2" weight="bold">
                      Bank Darah
                    </Typography>
                    <Typography variant="body2" color="secondary">
                      {hospital.blood_bank_contact || 'Hubungi telepon utama'}
                    </Typography>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex space-x-4">
        {hospital.latitude && hospital.longitude && (
          <a
            href={`https://maps.google.com/?q=${hospital.latitude},${hospital.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="primary" fullWidth>
              <MapPinIcon className="w-5 h-5 mr-2" />
              Buka di Google Maps
            </Button>
          </a>
        )}
        <Link to="/appointments/create" className="flex-1">
          <Button variant="outline" fullWidth>
            <CalendarIcon className="w-5 h-5 mr-2" />
            Buat Janji Temu
          </Button>
        </Link>
      </div>

      {/* Recent Activities */}
      {hospital.recent_activities && hospital.recent_activities.length > 0 && (
        <Card>
          <Typography variant="h6" className="mb-4">
            Aktivitas Terbaru
          </Typography>
          <div className="space-y-3">
            {hospital.recent_activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Typography variant="body2" weight="medium">
                    {activity.type === 'donation' && 'Donor Darah'}
                    {activity.type === 'request' && 'Permintaan Darah'}
                    {activity.type === 'appointment' && 'Janji Temu'}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    {activity.count} kali • {formatDistanceToNow(activity.date)}
                  </Typography>
                </div>
                <Badge variant="secondary">
                  {activity.count}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HospitalDetail;