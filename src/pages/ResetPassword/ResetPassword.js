/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/ResetPassword/ResetPassword.jsx
// DESKRIPSI: Reset password page
// =====================================================

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

import { Button, Input, Typography, Card } from '../../components/atoms';
import { AlertMessage } from '../../components/molecules';
import api from '../../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch('new_password');

  const onSubmit = async (data) => {
    if (!token) {
      setError('Token reset password tidak valid');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await api.post('/auth/reset-password', {
        token,
        new_password: data.new_password
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mereset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4">
        <Card className="max-w-md w-full text-center py-12">
          <Typography variant="h5" color="danger" className="mb-4">
            Token Tidak Valid
          </Typography>
          <Typography variant="body2" color="secondary" className="mb-6">
            Link reset password tidak valid atau sudah kadaluarsa.
          </Typography>
          <Link to="/forgot-password">
            <Button variant="primary">
              Minta Link Baru
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

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
            <Typography variant="h4" className="mb-2">
              Reset Password
            </Typography>
            <Typography variant="body2" color="secondary">
              Buat password baru untuk akun Anda
            </Typography>
          </div>

          {/* Error Alert */}
          {error && (
            <AlertMessage
              type="error"
              message={error}
              className="mb-6"
              dismissible
              onClose={() => setError('')}
            />
          )}

          {/* Success Message */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </div>
              <Typography variant="h6" className="mb-2">
                Password Berhasil Diubah!
              </Typography>
              <Typography variant="body2" color="secondary" className="mb-6">
                Anda akan diarahkan ke halaman login dalam 3 detik.
              </Typography>
            </motion.div>
          ) : (
            /* Reset Password Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Password Baru"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password baru"
                icon={LockClosedIcon}
                error={errors.new_password?.message}
                {...register('new_password', { 
                  required: 'Password baru wajib diisi',
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
                label="Konfirmasi Password Baru"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Masukkan ulang password baru"
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

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isLoading}
              >
                Reset Password
              </Button>
            </form>
          )}

          {/* Login Link */}
          {!isSuccess && (
            <div className="text-center mt-6">
              <Typography variant="body2" color="secondary">
                <Link to="/login" className="text-primary-600 hover:text-primary-700">
                  Kembali ke Login
                </Link>
              </Typography>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;