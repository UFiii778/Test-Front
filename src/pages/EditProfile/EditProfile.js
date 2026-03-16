/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/EditProfile/EditProfile.jsx
// DESKRIPSI: Edit profile page
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  ScaleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

import { AlertMessage, BloodTypeSelector } from '../../components/molecules';
import { Typography, Card, Button, Input } from '../../components/atoms';
import { Breadcrumb } from '../../components/molecules';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState(null);
  const [selectedBloodType, setSelectedBloodType] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data.data);
      setSelectedBloodType(response.data.data.blood_type);
      
      // Set form values
      setValue('full_name', response.data.data.full_name);
      setValue('phone', response.data.data.phone);
      setValue('address', response.data.data.address);
      setValue('city', response.data.data.city);
      setValue('province', response.data.data.province);
      setValue('postal_code', response.data.data.postal_code);
      setValue('weight', response.data.data.weight);
      setValue('height', response.data.data.height);
      setValue('medical_notes', response.data.data.medical_notes);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        ...data,
        blood_type: selectedBloodType || undefined
      };

      await api.put('/users/profile', updateData);
      setSuccess('Profil berhasil diperbarui');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Profil', path: '/profile' },
    { label: 'Edit Profil' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" className="mb-2">
          Edit Profil
        </Typography>
        <Typography variant="body2" color="secondary">
          Perbarui informasi pribadi Anda
        </Typography>
      </motion.div>

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

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card className="space-y-6">
          {/* Personal Info */}
          <div>
            <Typography variant="h6" className="mb-4">
              Informasi Pribadi
            </Typography>
            <div className="space-y-4">
              <Input
                label="Nama Lengkap"
                icon={UserIcon}
                error={errors.full_name?.message}
                {...register('full_name', { 
                  required: 'Nama lengkap wajib diisi',
                  minLength: {
                    value: 3,
                    message: 'Nama minimal 3 karakter'
                  }
                })}
              />

              <Input
                label="Nomor Telepon"
                icon={PhoneIcon}
                error={errors.phone?.message}
                {...register('phone', { 
                  required: 'Nomor telepon wajib diisi',
                  pattern: {
                    value: /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
                    message: 'Format nomor telepon tidak valid'
                  }
                })}
              />
            </div>
          </div>

          {/* Blood Type (for donors and patients) */}
          {(user?.role === 'pendonor' || user?.role === 'pasien') && (
            <div>
              <Typography variant="h6" className="mb-4">
                Informasi Darah
              </Typography>
              <div className="space-y-4">
                <Typography variant="body2" weight="bold" className="mb-2">
                  Golongan Darah
                </Typography>
                <BloodTypeSelector
                  value={selectedBloodType}
                  onChange={setSelectedBloodType}
                  includeRhesus
                  size="lg"
                />
              </div>
            </div>
          )}

          {/* Address */}
          <div>
            <Typography variant="h6" className="mb-4">
              Alamat
            </Typography>
            <div className="space-y-4">
              <Textarea
                label="Alamat Lengkap"
                icon={MapPinIcon}
                rows="3"
                {...register('address')}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Kota"
                  {...register('city')}
                />
                <Input
                  label="Provinsi"
                  {...register('province')}
                />
                <Input
                  label="Kode Pos"
                  {...register('postal_code')}
                />
              </div>
            </div>
          </div>

          {/* Medical Info (for donors) */}
          {user?.role === 'pendonor' && (
            <div>
              <Typography variant="h6" className="mb-4">
                Informasi Medis
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Berat Badan (kg)"
                  type="number"
                  step="0.1"
                  icon={ScaleIcon}
                  {...register('weight')}
                />
                <Input
                  label="Tinggi Badan (cm)"
                  type="number"
                  step="0.1"
                  icon={ScaleIcon}
                  {...register('height')}
                />
              </div>

              <div className="mt-4">
                <Textarea
                  label="Catatan Medis"
                  icon={DocumentTextIcon}
                  rows="3"
                  placeholder="Contoh: riwayat penyakit, alergi, dll."
                  {...register('medical_notes')}
                />
              </div>

              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <Typography variant="caption" color="primary">
                  ?? Informasi medis hanya digunakan untuk verifikasi kelayakan donor dan dijaga kerahasiaannya.
                </Typography>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/profile')}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Simpan Perubahan
            </Button>
          </div>
        </Card>
      </motion.form>
    </div>
  );
};

export default EditProfile;

