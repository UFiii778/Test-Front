/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/PMIVerify/PMIVerify.jsx
// DESKRIPSI: PMI donor verification page
// =====================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Avatar, Badge, Divider } from '../../components/atoms';
import { AlertMessage } from '../../components/molecules';
import api from '../../services/api';

const PMIVerify = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [donor, setDonor] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDonorDetails();
  }, [id]);

  const fetchDonorDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users/${id}`);
      setDonor(response.data.data);
    } catch (error) {
      console.error('Error fetching donor details:', error);
      setError('Gagal memuat data donor');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status) => {
    setSubmitting(true);
    setError('');
    
    try {
      await api.put(`/admin/users/${id}/verify`, { verified: status });
      setSuccess(status ? 'Donor berhasil diverifikasi' : 'Donor ditolak');
      setTimeout(() => {
        navigate('/pmi/dashboard?tab=verification');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memproses verifikasi');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="text-center py-12">
        <Typography variant="h5" color="danger">
          Data donor tidak ditemukan
        </Typography>
        <Button
          variant="primary"
          onClick={() => navigate('/pmi/dashboard')}
          className="mt-4"
        >
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h4">
          Verifikasi Pendonor
        </Typography>
        <Button variant="outline" onClick={() => navigate('/pmi/dashboard')}>
          Kembali
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <AlertMessage
          type="error"
          message={error}
          dismissible
          onClose={() => setError('')}
        />
      )}
      
      {success && (
        <AlertMessage
          type="success"
          message={success}
        />
      )}

      {/* Donor Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <div className="flex items-start space-x-6">
            <Avatar
              src={donor.profile_picture}
              name={donor.full_name}
              size="xl"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Typography variant="h5" className="mb-1">
                    {donor.full_name}
                  </Typography>
                  <div className="flex items-center space-x-2">
                    <Badge variant="primary">{donor.blood_type || '-'}</Badge>
                    <Badge variant="secondary">{donor.rhesus || '-'}</Badge>
                  </div>
                </div>
                <Badge variant={donor.is_verified ? 'success' : 'warning'} size="lg">
                  {donor.is_verified ? 'Terverifikasi' : 'Belum Verifikasi'}
                </Badge>
              </div>

              <Divider />

              <div className="grid md:grid-cols-2 gap-4 py-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span>{donor.email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span>{donor.phone || '-'}</span>
                </div>
                <div className="flex items-start md:col-span-2">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <span>{donor.address || '-'}, {donor.city || '-'}, {donor.province || '-'}</span>
                </div>
              </div>

              <Divider />

              <div className="grid md:grid-cols-3 gap-4 py-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Typography variant="caption" color="secondary">
                    Berat Badan
                  </Typography>
                  <Typography variant="h6">
                    {donor.weight || '-'} kg
                  </Typography>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Typography variant="caption" color="secondary">
                    Tinggi Badan
                  </Typography>
                  <Typography variant="h6">
                    {donor.height || '-'} cm
                  </Typography>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Typography variant="caption" color="secondary">
                    Total Donor
                  </Typography>
                  <Typography variant="h6">
                    {donor.total_donations || 0}
                  </Typography>
                </div>
              </div>

              {donor.medical_notes && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <Typography variant="body2" weight="bold" className="text-yellow-800 mb-2">
                    Catatan Medis
                  </Typography>
                  <Typography variant="body2" className="text-yellow-700">
                    {donor.medical_notes}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <Typography variant="h6" className="mb-4">
            Dokumen Pendukung
          </Typography>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary-300 cursor-pointer">
              <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <Typography variant="body2" weight="medium">
                KTP
              </Typography>
              <Typography variant="caption" color="secondary">
                Klik untuk lihat
              </Typography>
            </div>
            <div className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary-300 cursor-pointer">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <Typography variant="body2" weight="medium">
                Surat Sehat
              </Typography>
              <Typography variant="caption" color="secondary">
                Klik untuk lihat
              </Typography>
            </div>
            <div className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-primary-300 cursor-pointer">
              <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <Typography variant="body2" weight="medium">
                Foto Donor
              </Typography>
              <Typography variant="caption" color="secondary">
                Klik untuk lihat
              </Typography>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-4"
      >
        <Button
          variant="success"
          size="lg"
          fullWidth
          onClick={() => handleVerify(true)}
          loading={submitting}
        >
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          Verifikasi Pendonor
        </Button>
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onClick={() => handleVerify(false)}
          loading={submitting}
        >
          <XCircleIcon className="w-5 h-5 mr-2" />
          Tolak
        </Button>
      </motion.div>

      {/* Verification Checklist */}
      <Card variant="info" className="bg-blue-50">
        <Typography variant="body2" weight="bold" className="text-blue-800 mb-3">
          Checklist Verifikasi
        </Typography>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-primary-600 mr-3" />
            <Typography variant="body2" className="text-blue-700">
              KTP sesuai dengan identitas
            </Typography>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-primary-600 mr-3" />
            <Typography variant="body2" className="text-blue-700">
              Surat sehat masih berlaku (maks 6 bulan)
            </Typography>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-primary-600 mr-3" />
            <Typography variant="body2" className="text-blue-700">
              Berat badan minimal 45 kg
            </Typography>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-primary-600 mr-3" />
            <Typography variant="body2" className="text-blue-700">
              Tidak memiliki penyakit yang menghalangi donor
            </Typography>
          </label>
        </div>
      </Card>
    </div>
  );
};

export default PMIVerify;