/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/VerifyEmail/VerifyEmail.jsx
// DESKRIPSI: Email verification page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

import { Button, Typography, Card, Spinner } from '../../components/atoms';
import api from '../../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token verifikasi tidak ditemukan');
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage('Email Anda telah berhasil diverifikasi!');
        
        // Countdown to login
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/login');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Gagal memverifikasi email');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleResendVerification = async () => {
    try {
      // Get email from query param or localStorage
      const email = searchParams.get('email') || localStorage.getItem('verification_email');
      
      if (!email) {
        setMessage('Email tidak ditemukan. Silakan daftar ulang.');
        return;
      }

      await api.post('/auth/resend-verification', { email });
      setMessage('Email verifikasi telah dikirim ulang. Silakan cek email Anda.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal mengirim ulang email verifikasi');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="w-full text-center py-12 px-8">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <Spinner size="lg" color="primary" />
              </div>
            )}
            
            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
              </motion.div>
            )}
            
            {status === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center"
              >
                <XCircleIcon className="w-12 h-12 text-red-600" />
              </motion.div>
            )}
          </div>

          {/* Title */}
          <Typography variant="h5" className="mb-2">
            {status === 'loading' && 'Memverifikasi Email...'}
            {status === 'success' && 'Verifikasi Berhasil!'}
            {status === 'error' && 'Verifikasi Gagal'}
          </Typography>

          {/* Message */}
          <Typography variant="body2" color="secondary" className="mb-6">
            {message}
          </Typography>

          {/* Actions */}
          {status === 'success' && (
            <div className="space-y-4">
              <Typography variant="body2" color="secondary">
                Anda akan dialihkan ke halaman login dalam {countdown} detik.
              </Typography>
              <Link to="/login">
                <Button variant="primary" fullWidth>
                  Login Sekarang
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Button 
                variant="primary" 
                fullWidth
                onClick={handleResendVerification}
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Kirim Ulang Verifikasi
              </Button>
              
              <Link to="/">
                <Button variant="outline" fullWidth>
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;