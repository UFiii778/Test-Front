/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/NotFound/NotFound.jsx
// DESKRIPSI: 404 Not Found page
// =====================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ArrowLeftIcon,
  HeartIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

import { Typography, Button, Card } from '../../components/atoms';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center py-16 px-8">
          {/* Animated Blood Drop Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-25" />
              <div className="absolute inset-2 bg-primary-200 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-primary-600 rounded-full flex items-center justify-center">
                <HeartIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Error Code */}
          <Typography variant="h1" className="text-8xl font-bold text-primary-600 mb-4">
            404
          </Typography>

          {/* Title */}
          <Typography variant="h3" className="mb-4">
            Halaman Tidak Ditemukan
          </Typography>

          {/* Description */}
          <Typography variant="body1" color="secondary" className="mb-8 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan 
            atau URL yang Anda masukkan salah.
          </Typography>

          {/* Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link to="/">
              <Button variant="primary" fullWidth>
                <HomeIcon className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => window.history.back()}
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Halaman Sebelumnya
            </Button>
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-200 pt-8">
            <Typography variant="body2" color="secondary" className="mb-4">
              Atau coba halaman berikut:
            </Typography>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/hospitals">
                <Button variant="ghost" size="sm">
                  Rumah Sakit
                </Button>
              </Link>
              <Link to="/blood-stock">
                <Button variant="ghost" size="sm">
                  Stok Darah
                </Button>
              </Link>
              <Link to="/requests">
                <Button variant="ghost" size="sm">
                  Permintaan
                </Button>
              </Link>
              <Link to="/news">
                <Button variant="ghost" size="sm">
                  Berita
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost" size="sm">
                  Kontak
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 flex items-center justify-center text-gray-400">
            <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
            <Typography variant="caption">
              Pastikan URL yang Anda masukkan sudah benar
            </Typography>
          </div>
        </Card>

        {/* Help Text */}
        <Typography variant="caption" color="secondary" className="block text-center mt-4">
          Jika Anda yakin ini adalah kesalahan, silakan hubungi{' '}
          <a href="mailto:support@darahkita.id" className="text-primary-600 hover:text-primary-700">
            support@darahkita.id
          </a>
        </Typography>
      </motion.div>
    </div>
  );
};

export default NotFound;