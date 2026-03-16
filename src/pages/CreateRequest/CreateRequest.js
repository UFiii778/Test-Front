/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/CreateRequest/CreateRequest.jsx
// DESKRIPSI: Create donation request page
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Input, Select } from '../../components/atoms';
import { AlertMessage } from '../../components/molecules';
import { BloodTypeSelector, Breadcrumb } from '../../components/molecules';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const CreateRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [selectedBloodType, setSelectedBloodType] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      quantity: 1,
      urgency: 'biasa'
    }
  });

  const urgency = watch('urgency');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals', { params: { limit: 100 } });
      setHospitals(response.data.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedBloodType) {
      setError('Pilih golongan darah');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestData = {
        ...data,
        blood_type: selectedBloodType,
        patient_id: user.id
      };

      const response = await api.post('/requests', requestData);
      navigate(`/requests/${response.data.data.request_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat permintaan');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Permintaan', path: '/requests' },
    { label: 'Buat Permintaan' }
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
          Buat Permintaan Donor Darah
        </Typography>
        <Typography variant="body2" color="secondary">
          Isi formulir di bawah untuk membuat permintaan donor darah baru
        </Typography>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <AlertMessage
          type="error"
          message={error}
          dismissible
          onClose={() => setError('')}
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
          {/* Blood Type Selection */}
          <div>
            <Typography variant="body2" weight="bold" className="mb-3">
              Golongan Darah yang Dibutuhkan <span className="text-red-600">*</span>
            </Typography>
            <BloodTypeSelector
              value={selectedBloodType}
              onChange={setSelectedBloodType}
              includeRhesus
              size="lg"
            />
          </div>

          {/* Quantity and Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Jumlah Kantong"
              type="number"
              min="1"
              max="10"
              error={errors.quantity?.message}
              {...register('quantity', { 
                required: 'Jumlah kantong wajib diisi',
                min: { value: 1, message: 'Minimal 1 kantong' },
                max: { value: 10, message: 'Maksimal 10 kantong' }
              })}
            />

            <div>
              <Typography variant="body2" weight="bold" className="mb-2">
                Tingkat Urgensi
              </Typography>
              <div className="space-y-2">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="biasa"
                    {...register('urgency')}
                    className="mr-3"
                  />
                  <div>
                    <Typography variant="body2" weight="medium">
                      Biasa
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      Dapat dipenuhi dalam 3 hari
                    </Typography>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="urgent"
                    {...register('urgency')}
                    className="mr-3"
                  />
                  <div>
                    <Typography variant="body2" weight="medium">
                      Urgent
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      Dibutuhkan dalam 24 jam
                    </Typography>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="gawat_darurat"
                    {...register('urgency')}
                    className="mr-3"
                  />
                  <div>
                    <Typography variant="body2" weight="medium">
                      Gawat Darurat
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      Dibutuhkan segera!
                    </Typography>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Hospital Selection */}
          <div>
            <Typography variant="body2" weight="bold" className="mb-2">
              Rumah Sakit Tujuan (opsional)
            </Typography>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              {...register('hospital_id')}
            >
              <option value="">Pilih rumah sakit (opsional)</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name} - {hospital.city}
                </option>
              ))}
            </select>
          </div>

          {/* Location (if no hospital selected) */}
          {!watch('hospital_id') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Kota / Kabupaten"
                placeholder="Contoh: Jakarta Selatan"
                {...register('city')}
              />
              <Input
                label="Provinsi"
                placeholder="Contoh: DKI Jakarta"
                {...register('province')}
              />
            </div>
          )}

          {/* Notes */}
          <Textarea
            label="Catatan Tambahan (opsional)"
            placeholder="Contoh: butuh segera, lokasi pasien, kontak darurat, dll."
            rows="4"
            {...register('notes')}
          />

          {/* Emergency Warning */}
          {urgency === 'gawat_darurat' && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <Typography variant="body2" weight="bold" className="text-red-800 mb-1">
                ⚠️ Perhatian: Status Gawat Darurat
              </Typography>
              <Typography variant="caption" className="text-red-700">
                Permintaan dengan status gawat darurat akan segera diberitahukan ke pendonor terdekat.
                Pastikan data yang Anda masukkan sudah benar.
              </Typography>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/requests')}
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
              <HeartIcon className="w-5 h-5 mr-2" />
              Buat Permintaan
            </Button>
          </div>
        </Card>
      </motion.form>

      {/* Info Card */}
      <Card variant="info" className="bg-blue-50">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <Typography variant="body2" weight="bold" className="text-blue-800">
              Tips Membuat Permintaan
            </Typography>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Pastikan golongan darah yang dipilih sesuai dengan kebutuhan</li>
              <li>Sebutkan jumlah kantong yang dibutuhkan dengan jelas</li>
              <li>Pilih tingkat urgensi yang tepat sesuai kondisi</li>
              <li>Cantumkan kontak yang bisa dihubungi jika diperlukan</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateRequest;
