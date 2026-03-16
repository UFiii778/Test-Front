/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/CreateAppointment/CreateAppointment.jsx
// DESKRIPSI: Create appointment page
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Input, Select } from '../../components/atoms';
import { AlertMessage } from '../../components/molecules';
import { Breadcrumb } from '../../components/molecules';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const CreateAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const selectedHospitalId = watch('hospital_id');
  const appointmentDate = watch('appointment_date');

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospitalId && appointmentDate) {
      fetchAvailableSlots(selectedHospitalId, appointmentDate);
    }
  }, [selectedHospitalId, appointmentDate]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals', { params: { limit: 100 } });
      setHospitals(response.data.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const fetchAvailableSlots = async (hospitalId, date) => {
    try {
      const response = await api.get('/appointments/slots', {
        params: { hospital_id: hospitalId, date }
      });
      setAvailableSlots(response.data.data.slots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/appointments', data);
      navigate(`/appointments`);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat janji temu');
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const breadcrumbItems = [
    { label: 'Janji Temu', path: '/appointments' },
    { label: 'Buat Janji Temu' }
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
          Buat Janji Temu Donor
        </Typography>
        <Typography variant="body2" color="secondary">
          Isi formulir di bawah untuk membuat jadwal donor darah
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
          {/* Hospital Selection */}
          <div>
            <Typography variant="body2" weight="bold" className="mb-2">
              Pilih Rumah Sakit <span className="text-red-600">*</span>
            </Typography>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              {...register('hospital_id', { required: 'Pilih rumah sakit' })}
            >
              <option value="">Pilih rumah sakit</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name} - {hospital.city}
                </option>
              ))}
            </select>
            {errors.hospital_id && (
              <p className="mt-1 text-sm text-red-600">{errors.hospital_id.message}</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tanggal"
              type="date"
              min={minDate}
              error={errors.appointment_date?.message}
              {...register('appointment_date', { 
                required: 'Pilih tanggal janji temu'
              })}
            />

            <div>
              <Typography variant="body2" weight="bold" className="mb-2">
                Pilih Waktu <span className="text-red-600">*</span>
              </Typography>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <label
                      key={slot.time}
                      className={`
                        block text-center p-2 border rounded-lg cursor-pointer transition-all
                        ${slot.available 
                          ? 'hover:border-primary-500 hover:bg-primary-50' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={slot.time}
                        disabled={!slot.available}
                        {...register('appointment_time', { 
                          required: 'Pilih waktu janji temu'
                        })}
                        className="hidden"
                      />
                      <Typography variant="body2">
                        {slot.time}
                      </Typography>
                      {!slot.available && (
                        <Typography variant="caption" color="secondary">
                          (Terisi)
                        </Typography>
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <Typography variant="body2" color="secondary">
                    {appointmentDate && selectedHospitalId
                      ? 'Tidak ada slot tersedia untuk tanggal ini'
                      : 'Pilih tanggal dan rumah sakit terlebih dahulu'
                    }
                  </Typography>
                </div>
              )}
              {errors.appointment_time && (
                <p className="mt-1 text-sm text-red-600">{errors.appointment_time.message}</p>
              )}
            </div>
          </div>

          {/* Doctor Name (Optional) */}
          <Input
            label="Nama Dokter (opsional)"
            placeholder="Contoh: Dr. Ahmad"
            icon={UserIcon}
            {...register('doctor_name')}
          />

          {/* Purpose */}
          <Textarea
            label="Tujuan / Catatan"
            placeholder="Contoh: Donor darah rutin, Konsultasi, dll."
            rows="4"
            {...register('purpose')}
          />

          {/* Preparation Tips */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <Typography variant="body2" weight="bold" className="text-blue-800 mb-2">
              Persiapan Sebelum Donor:
            </Typography>
            <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside">
              <li>Tidur cukup minimal 5 jam</li>
              <li>Makan makanan bergizi sebelum donor</li>
              <li>Minum air putih yang cukup</li>
              <li>Jangan konsumsi alkohol 24 jam sebelumnya</li>
              <li>Bawa identitas diri (KTP)</li>
              <li>Bawa kartu donor jika ada</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/appointments')}
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
              <CalendarIcon className="w-5 h-5 mr-2" />
              Buat Janji
            </Button>
          </div>
        </Card>
      </motion.form>
    </div>
  );
};

export default CreateAppointment;
