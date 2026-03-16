/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/About/About.jsx
// DESKRIPSI: About page
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button } from '../../components/atoms';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { label: 'Pendonor Terdaftar', value: '10,000+', icon: UserGroupIcon },
    { label: 'Rumah Sakit Mitra', value: '500+', icon: BuildingOfficeIcon },
    { label: 'Kantong Darah Tersalurkan', value: '50,000+', icon: HeartIcon },
    { label: 'Kota Tercakup', value: '100+', icon: GlobeAltIcon }
  ];

  const values = [
    {
      title: 'Kemanusiaan',
      description: 'Mengedepankan nilai kemanusiaan dalam setiap tindakan',
      icon: HeartIcon
    },
    {
      title: 'Integritas',
      description: 'Menjaga kepercayaan dengan transparansi dan kejujuran',
      icon: CheckBadgeIcon
    },
    {
      title: 'Inovasi',
      description: 'Terus berinovasi untuk pelayanan yang lebih baik',
      icon: ArrowTrendingUpIcon
    },
    {
      title: 'Kolaborasi',
      description: 'Bekerja sama dengan semua pihak untuk hasil terbaik',
      icon: UserGroupIcon
    }
  ];

  const team = [
    {
      name: 'Dr. Ahmad Fauzi',
      role: 'Direktur Utama',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'dr. Siti Nurhaliza',
      role: 'Kepala Medis',
      image: 'https://images.unsplash.com/photo-1494790108777-766ef1f5f3b5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Budi Santoso',
      role: 'Koordinator Relawan',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Citra Dewi',
      role: 'Manajer Komunikasi',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative max-w-4xl mx-auto text-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" color="white" className="mb-6">
              Tentang DarahKita
            </Typography>
            <Typography variant="body1" color="white" className="mb-8 opacity-90 max-w-2xl mx-auto">
              Platform digital yang mempertemukan pendonor darah dengan mereka yang membutuhkan.
              Bersama kita selamatkan nyawa melalui donor darah.
            </Typography>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <Typography variant="h3" color="primary" className="mb-2">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="secondary">
                  {stat.label}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" className="mb-6">
            Misi Kami
          </Typography>
          <Typography variant="body1" color="secondary" className="mb-4">
            DarahKita hadir untuk menjawab tantangan dalam sistem donor darah di Indonesia. 
            Dengan teknologi, kami memudahkan akses informasi stok darah dan mempertemukan 
            pendonor dengan penerima secara cepat dan tepat.
          </Typography>
          <Typography variant="body1" color="secondary" className="mb-6">
            Kami percaya setiap tetes darah sangat berarti. Melalui platform ini, 
            kami ingin mengajak lebih banyak masyarakat untuk menjadi pahlawan 
            kemanusiaan melalui donor darah.
          </Typography>
          <Link to="/register">
            <Button variant="primary" size="lg">
              Bergabung Sekarang
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative h-96 rounded-2xl overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Donor darah"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Values Section */}
      <section>
        <Typography variant="h3" className="text-center mb-12">
          Nilai-nilai Kami
        </Typography>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <Typography variant="h6" className="mb-2">
                  {value.title}
                </Typography>
                <Typography variant="body2" color="secondary">
                  {value.description}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section>
        <Typography variant="h3" className="text-center mb-12">
          Tim Kami
        </Typography>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <Typography variant="h6" className="mb-1">
                  {member.name}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {member.role}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 rounded-3xl py-16 px-4 text-center">
        <Typography variant="h3" color="white" className="mb-4">
          Siap Menjadi Pahlawan?
        </Typography>
        <Typography variant="body1" color="white" className="mb-8 opacity-90 max-w-2xl mx-auto">
          Setetes darah Anda dapat menyelamatkan tiga nyawa. Mulai donor darah sekarang.
        </Typography>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button variant="white" size="lg">
              Daftar Jadi Pendonor
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline-white" size="lg">
              Hubungi Kami
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;