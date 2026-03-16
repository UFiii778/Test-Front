/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Register/Register.jsx
// DESKRIPSI: Register page
// =====================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import { Button, Input, Typography, Card } from '../../components/atoms';
import { AlertMessage, BloodTypeSelector } from '../../components/molecules';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors }, setValue, trigger } = useForm({
    defaultValues: {
      role: 'pendonor'
    }
  });

  const password = watch('password');
  const selectedRole = watch('role');
  const selectedBloodType = watch('blood_type');

  const roles = [
    { value: 'pendonor', label: 'Pendonor', description: 'Saya ingin mendonorkan darah' },
    { value: 'pasien', label: 'Pasien', description: 'Saya membutuhkan donor darah' },
    { value: 'sukarelawan', label: 'Sukarelawan', description: 'Saya ingin membantu koordinasi donor' }
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await registerUser(data);
      if (result.success) {
        setSuccess('Registrasi berhasil! Silakan cek email untuk verifikasi.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.error || 'Registrasi gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    
    if (step === 1) {
      fieldsToValidate = ['full_name', 'email', 'phone'];
    } else if (step === 2) {
      fieldsToValidate = ['password', 'confirm_password'];
    } else if (step === 3) {
      fieldsToValidate = ['role'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <Typography variant="h3" color="primary" weight="bold">
                DarahKita
              </Typography>
            </Link>
            <Typography variant="h5" className="mb-2">
              Buat Akun Baru
            </Typography>
            <Typography variant="body2" color="secondary">
              Bergabunglah dan bantu sesama melalui donor darah
            </Typography>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${step > s 
                      ? 'bg-primary-600 text-white' 
                      : step === s 
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {step > s ? <CheckCircleIcon className="w-5 h-5" /> : s}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">
                    {s === 1 && 'Data Diri'}
                    {s === 2 && 'Password'}
                    {s === 3 && 'Role'}
                    {s === 4 && 'Gol Darah'}
                  </span>
                </div>
                {s < 4 && (
                  <div className={`
                    flex-1 h-1 mx-2
                    ${step > s ? 'bg-primary-600' : 'bg-gray-200'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Error/Success Alert */}
          {error && (
            <AlertMessage
              type="error"
              message={error}
              className="mb-6"
              dismissible
              onClose={() => setError('')}
            />
          )}
          
          {success && (
            <AlertMessage
              type="success"
              message={success}
              className="mb-6"
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Data */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Input
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap"
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
                  label="Email"
                  type="email"
                  placeholder="Masukkan email"
                  icon={EnvelopeIcon}
                  error={errors.email?.message}
                  {...register('email', { 
                    required: 'Email wajib diisi',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Format email tidak valid'
                    }
                  })}
                />

                <Input
                  label="Nomor Telepon"
                  placeholder="Contoh: 081234567890"
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
              </motion.div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  icon={LockClosedIcon}
                  error={errors.password?.message}
                  {...register('password', { 
                    required: 'Password wajib diisi',
                    minLength: {
                      value: 8,
                      message: 'Password minimal 8 karakter'
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                      message: 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol'
                    }
                  })}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  }
                />

                <Input
                  label="Konfirmasi Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Masukkan ulang password"
                  icon={LockClosedIcon}
                  error={errors.confirm_password?.message}
                  {...register('confirm_password', { 
                    required: 'Konfirmasi password wajib diisi',
                    validate: value => value === password || 'Password tidak cocok'
                  })}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  }
                />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <Typography variant="caption" weight="bold" className="block mb-2">
                    Password harus mengandung:
                  </Typography>
                  <ul className="space-y-1">
                    <li className="flex items-center text-xs text-gray-600">
                      <CheckCircleIcon className={`w-4 h-4 mr-2 ${password?.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                      Minimal 8 karakter
                    </li>
                    <li className="flex items-center text-xs text-gray-600">
                      <CheckCircleIcon className={`w-4 h-4 mr-2 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                      Huruf besar (A-Z)
                    </li>
                    <li className="flex items-center text-xs text-gray-600">
                      <CheckCircleIcon className={`w-4 h-4 mr-2 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                      Huruf kecil (a-z)
                    </li>
                    <li className="flex items-center text-xs text-gray-600">
                      <CheckCircleIcon className={`w-4 h-4 mr-2 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                      Angka (0-9)
                    </li>
                    <li className="flex items-center text-xs text-gray-600">
                      <CheckCircleIcon className={`w-4 h-4 mr-2 ${/[!@#$%^&*]/.test(password) ? 'text-green-600' : 'text-gray-400'}`} />
                      Simbol (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Step 3: Role Selection */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Typography variant="body2" weight="bold" className="mb-3">
                  Pilih peran Anda:
                </Typography>

                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`
                      block p-4 border-2 rounded-xl cursor-pointer transition-all
                      ${selectedRole === role.value 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-200 hover:border-primary-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={role.value}
                      className="hidden"
                      {...register('role', { required: 'Pilih peran Anda' })}
                    />
                    <div className="flex items-center">
                      <div className={`
                        w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                        ${selectedRole === role.value 
                          ? 'border-primary-600' 
                          : 'border-gray-400'
                        }
                      `}>
                        {selectedRole === role.value && (
                          <div className="w-3 h-3 rounded-full bg-primary-600" />
                        )}
                      </div>
                      <div>
                        <Typography variant="body2" weight="bold">
                          {role.label}
                        </Typography>
                        <Typography variant="caption" color="secondary">
                          {role.description}
                        </Typography>
                      </div>
                    </div>
                  </label>
                ))}
              </motion.div>
            )}

            {/* Step 4: Blood Type */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Typography variant="body2" weight="bold" className="mb-3">
                  Pilih golongan darah Anda (opsional):
                </Typography>

                <BloodTypeSelector
                  value={selectedBloodType}
                  onChange={(value) => setValue('blood_type', value)}
                  includeRhesus
                  size="lg"
                />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <Typography variant="caption" color="primary" weight="medium">
                    ?? Golongan darah hanya diperlukan jika Anda memilih sebagai Pendonor atau Pasien
                  </Typography>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-3 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                >
                  Kembali
                </Button>
              )}
              
              {step < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  className="flex-1"
                >
                  Lanjut
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  className="flex-1"
                >
                  Daftar
                </Button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <Typography variant="body2" color="secondary">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Masuk
              </Link>
            </Typography>
          </div>

          {/* Terms */}
          <div className="text-center mt-4">
            <Typography variant="caption" color="secondary">
              Dengan mendaftar, Anda menyetujui{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                Syarat & Ketentuan
              </Link>{' '}
              dan{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                Kebijakan Privasi
              </Link>
            </Typography>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;

