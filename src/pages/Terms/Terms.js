/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Terms/Terms.jsx
// DESKRIPSI: Terms and conditions page
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ScaleIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Divider } from '../../components/atoms';

const Terms = () => {
  const lastUpdated = '1 Januari 2024';

  const sections = [
    {
      title: '1. Ketentuan Umum',
      icon: DocumentTextIcon,
      content: [
        'Dengan mengakses dan menggunakan layanan DarahKita, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini.',
        'DarahKita adalah platform yang mempertemukan pendonor darah dengan penerima donor. Kami tidak bertanggung jawab atas tindakan medis yang dilakukan oleh pihak rumah sakit atau PMI.',
        'Pengguna wajib memberikan informasi yang benar, akurat, dan lengkap saat mendaftar dan menggunakan layanan.'
      ]
    },
    {
      title: '2. Hak dan Kewajiban Pengguna',
      icon: UserGroupIcon,
      content: [
        'Pengguna berhak mengakses fitur-fitur yang tersedia sesuai dengan peran masing-masing (pendonor, pasien, sukarelawan, PMI).',
        'Pendonor wajib memastikan bahwa mereka memenuhi syarat kesehatan untuk donor darah.',
        'Pasien wajib memberikan informasi yang benar tentang kebutuhan darah dan kondisi pasien.',
        'Pengguna dilarang memberikan informasi palsu atau menyesatkan.'
      ]
    },
    {
      title: '3. Privasi dan Keamanan Data',
      icon: LockClosedIcon,
      content: [
        'DarahKita melindungi data pribadi pengguna sesuai dengan Kebijakan Privasi yang terpisah.',
        'Data kesehatan pengguna hanya akan digunakan untuk keperluan verifikasi dan pencocokan donor.',
        'Kami tidak akan membagikan data pribadi Anda kepada pihak ketiga tanpa persetujuan, kecuali diwajibkan oleh hukum.'
      ]
    },
    {
      title: '4. Layanan Darurat',
      icon: ShieldCheckIcon,
      content: [
        'Fitur permintaan darurat hanya boleh digunakan untuk kondisi yang benar-benar mengancam jiwa.',
        'Penyalahgunaan fitur darurat dapat mengakibatkan pemblokiran akun.',
        'DarahKita akan berusaha sebaik mungkin untuk merespon permintaan darurat, namun tidak menjamin ketersediaan donor.'
      ]
    },
    {
      title: '5. Batasan Tanggung Jawab',
      icon: ScaleIcon,
      content: [
        'DarahKita tidak bertanggung jawab atas tindakan medis yang dilakukan oleh pihak rumah sakit atau PMI.',
        'Kami tidak menjamin ketersediaan donor darah setiap saat.',
        'Pengguna bertanggung jawab penuh atas informasi yang diberikan dan konsekuensi dari penggunaannya.'
      ]
    },
    {
      title: '6. Perubahan Ketentuan',
      icon: GlobeAltIcon,
      content: [
        'DarahKita dapat mengubah syarat dan ketentuan ini sewaktu-waktu.',
        'Perubahan akan diumumkan melalui aplikasi atau email.',
        'Pengguna dianggap menyetujui perubahan jika tetap menggunakan layanan setelah perubahan diumumkan.'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Typography variant="h2" className="mb-4">
          Syarat dan Ketentuan
        </Typography>
        <Typography variant="body2" color="secondary">
          Terakhir diperbarui: {lastUpdated}
        </Typography>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <Typography variant="body1" className="leading-relaxed">
            Selamat datang di DarahKita. Dengan mengakses atau menggunakan layanan kami, 
            Anda menyetujui untuk terikat oleh syarat dan ketentuan berikut. Harap baca 
            dengan seksama sebelum menggunakan layanan kami.
          </Typography>
        </Card>
      </motion.div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <Typography variant="h5" className="mb-4">
                    {section.title}
                  </Typography>
                  <div className="space-y-3">
                    {section.content.map((paragraph, i) => (
                      <Typography key={i} variant="body2" color="secondary" className="leading-relaxed">
                        {paragraph}
                      </Typography>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Agreement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="primary" className="bg-primary-50 border-primary-200">
          <Typography variant="body1" weight="medium" className="text-center">
            Dengan menggunakan layanan DarahKita, Anda menyatakan telah membaca, memahami, 
            dan menyetujui semua syarat dan ketentuan yang berlaku.
          </Typography>
        </Card>
      </motion.div>

      {/* Footer Links */}
      <Divider />
      
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-center">
        <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
          Kebijakan Privasi
        </Link>
        <span className="hidden sm:inline text-gray-300">|</span>
        <Link to="/faq" className="text-primary-600 hover:text-primary-700">
          FAQ
        </Link>
        <span className="hidden sm:inline text-gray-300">|</span>
        <Link to="/contact" className="text-primary-600 hover:text-primary-700">
          Hubungi Kami
        </Link>
      </div>
    </div>
  );
};

export default Terms;