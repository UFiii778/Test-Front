/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/ForgotPassword/ForgotPassword.jsx
// DESKRIPSI: Forgot password page
// =====================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

import { Button, Input, Typography, Card } from '../../components/atoms';
import { AlertMessage } from '../../components/molecules';
import api from '../../services/api';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim email reset password');
    } finally {
      setIsLoading(false);
    }
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
          {/* Back to Login */}
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Kembali ke Login
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <Typography variant="h4" className="mb-2">
              Lupa Password?
            </Typography>
            <Typography variant="body2" color="secondary">
              Masukkan email Anda untuk menerima instruksi reset password
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
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <EnvelopeIcon className="w-10 h-10 text-green-600" />
              </div>
              <Typography variant="h6" className="mb-2">
                Email Terkirim!
              </Typography>
              <Typography variant="body2" color="secondary" className="mb-6">
                Kami telah mengirim instruksi reset password ke email Anda. Silakan cek kotak masuk atau folder spam.
              </Typography>
              <Link to="/login">
                <Button variant="primary">
                  Kembali ke Login
                </Button>
              </Link>
            </motion.div>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="Masukkan email Anda"
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

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isLoading}
              >
                Kirim Instruksi Reset
              </Button>
            </form>
          )}

          {/* Register Link */}
          {!isSubmitted && (
            <div className="text-center mt-6">
              <Typography variant="body2" color="secondary">
                Belum punya akun?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Daftar sekarang
                </Link>
              </Typography>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;