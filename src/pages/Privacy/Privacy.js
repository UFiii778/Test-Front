/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Privacy/Privacy.jsx
// DESKRIPSI: Privacy policy page
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ServerIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Divider } from '../../components/atoms';

const Privacy = () => {
  const lastUpdated = '1 Januari 2024';

  const sections = [
    {
      title: 'Informasi yang Kami Kumpulkan',
      icon: DocumentTextIcon,
      content: [
        'Informasi pribadi: nama, email, nomor telepon, alamat, tanggal lahir, golongan darah, dan informasi kesehatan relevan.',
        'Informasi penggunaan: riwayat donor, permintaan donor, janji temu, dan interaksi dengan fitur aplikasi.',
        'Informasi teknis: alamat IP, jenis perangkat, browser, dan data log otomatis lainnya.',
        'Lokasi: data lokasi untuk menemukan donor dan rumah sakit terdekat.'
      ]
    },
    {
      title: 'Penggunaan Informasi',
      icon: EyeIcon,
      content: [
        'Mencocokkan pendonor dengan penerima donor berdasarkan golongan darah dan lokasi.',
        'Memproses permintaan donor dan janji temu.',
        'Mengirim notifikasi dan pengingat terkait donor darah.',
        'Meningkatkan dan mengembangkan layanan kami.',
        'Memenuhi kewajiban hukum dan peraturan yang berlaku.'
      ]
    },
    {
      title: 'Perlindungan Data',
      icon: LockClosedIcon,
      content: [
        'Data Anda dienkripsi menggunakan teknologi SSL/TLS.',
        'Akses ke data pribadi dibatasi hanya untuk personel yang berwenang.',
        'Kami melakukan audit keamanan secara berkala.',
        'Data kesehatan disimpan dengan perlindungan tambahan sesuai standar medis.'
      ]
    },
    {
      title: 'Berbagi Data',
      icon: UserGroupIcon,
      content: [
        'Informasi dasar (nama, golongan darah) dapat dilihat oleh pendonor/penerima yang cocok.',
        'Data kesehatan hanya dibagikan ke rumah sakit/PMI dengan persetujuan Anda.',
        'Kami tidak menjual data pribadi Anda kepada pihak ketiga.',
        'Data dapat dibagikan jika diwajibkan oleh hukum.'
      ]
    },
    {
      title: 'Penyimpanan Data',
      icon: ServerIcon,
      content: [
        'Data disimpan di server yang aman dengan perlindungan fisik dan digital.',
        'Riwayat donor disimpan untuk keperluan medis dan verifikasi.',
        'Anda dapat meminta penghapusan data dengan menghubungi customer service.'
      ]
    },
    {
      title: 'Hak Pengguna',
      icon: ScaleIcon,
      content: [
        'Mengakses dan memperbarui informasi pribadi Anda.',
        'Meminta penghapusan data (right to be forgotten).',
        'Menolak penggunaan data untuk tujuan tertentu.',
        'Mendapatkan salinan data Anda dalam format terstruktur.'
      ]
    },
    {
      title: 'Cookie dan Teknologi Pelacakan',
      icon: GlobeAltIcon,
      content: [
        'Kami menggunakan cookie untuk meningkatkan pengalaman pengguna.',
        'Cookie digunakan untuk menyimpan preferensi dan sesi login.',
        'Anda dapat menonaktifkan cookie melalui pengaturan browser.',
        'Pihak ketiga seperti Google Analytics mungkin menggunakan cookie mereka sendiri.'
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
          Kebijakan Privasi
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
          <div className="flex items-start space-x-4">
            <ShieldCheckIcon className="w-8 h-8 text-primary-600 flex-shrink-0" />
            <Typography variant="body1" className="leading-relaxed">
              Di DarahKita, privasi Anda adalah prioritas utama kami. Kebijakan privasi ini 
              menjelaskan bagaimana kami mengumpulkan, menggunakan, melindungi, dan mengungkapkan 
              informasi pribadi Anda saat menggunakan layanan kami.
            </Typography>
          </div>
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
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <Typography variant="body2" color="secondary">
                          {item}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="primary" className="bg-primary-50 border-primary-200">
          <Typography variant="h6" className="mb-4 text-center">
            Pertanyaan tentang Privasi?
          </Typography>
          <Typography variant="body2" className="text-center mb-4">
            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin 
            menggunakan hak-hak Anda terkait data pribadi, silakan hubungi kami:
          </Typography>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-center">
            <a href="mailto:privacy@darahkita.id" className="text-primary-600 hover:text-primary-700">
              privacy@darahkita.id
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a href="tel:0211234567" className="text-primary-600 hover:text-primary-700">
              021-1234567
            </a>
          </div>
        </Card>
      </motion.div>

      {/* Footer Links */}
      <Divider />
      
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-center">
        <Link to="/terms" className="text-primary-600 hover:text-primary-700">
          Syarat & Ketentuan
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

export default Privacy;