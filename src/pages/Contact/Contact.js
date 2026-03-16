/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Contact/Contact.jsx
// DESKRIPSI: Contact page
// =====================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Input } from '../../components/atoms';
import { AlertMessage } from '../../components/molecules';
import api from '../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['info@darahkita.id', 'support@darahkita.id'],
      action: 'mailto:info@darahkita.id'
    },
    {
      icon: PhoneIcon,
      title: 'Telepon',
      details: ['021-1234567', '021-1234568'],
      action: 'tel:0211234567'
    },
    {
      icon: MapPinIcon,
      title: 'Kantor Pusat',
      details: ['Jl. Kramat Raya No.47', 'Jakarta Pusat 10450'],
      action: 'https://maps.google.com/?q=Jakarta'
    },
    {
      icon: ClockIcon,
      title: 'Jam Operasional',
      details: ['Senin - Jumat: 08:00 - 20:00', 'Sabtu - Minggu: 09:00 - 15:00'],
      action: null
    }
  ];

  const faqs = [
    {
      question: 'Bagaimana cara menjadi pendonor?',
      answer: 'Anda dapat mendaftar melalui aplikasi DarahKita, kemudian mengisi data diri dan memenuhi syarat donor darah.'
    },
    {
      question: 'Apakah donor darah aman?',
      answer: 'Ya, donor darah sangat aman karena menggunakan jarum steril sekali pakai dan didampingi petugas medis profesional.'
    },
    {
      question: 'Berapa lama proses donor darah?',
      answer: 'Proses donor darah sekitar 30-45 menit, termasuk registrasi, pemeriksaan, dan istirahat setelah donor.'
    },
    {
      question: 'Bagaimana cara cek stok darah?',
      answer: 'Anda dapat mengecek stok darah melalui menu Stok Darah di aplikasi atau website DarahKita.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="text-center">
        <Typography variant="h2" className="mb-4">
          Hubungi Kami
        </Typography>
        <Typography variant="body1" color="secondary" className="max-w-2xl mx-auto">
          Punya pertanyaan atau butuh bantuan? Tim kami siap membantu Anda 24/7.
        </Typography>
      </section>

      {/* Contact Info Cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center h-full">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-8 h-8 text-primary-600" />
              </div>
              <Typography variant="h6" className="mb-2">
                {info.title}
              </Typography>
              {info.details.map((detail, i) => (
                <Typography key={i} variant="body2" color="secondary" className="mb-1">
                  {detail}
                </Typography>
              ))}
              {info.action && (
                <a
                  href={info.action}
                  target={info.action.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700"
                >
                  Hubungi →
                </a>
              )}
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Contact Form & Map */}
      <section className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <Typography variant="h5" className="mb-6">
              Kirim Pesan
            </Typography>

            {success && (
              <AlertMessage
                type="success"
                message="Pesan berhasil dikirim! Kami akan segera merespon."
                className="mb-6"
                dismissible
                onClose={() => setSuccess(false)}
              />
            )}

            {error && (
              <AlertMessage
                type="error"
                message={error}
                className="mb-6"
                dismissible
                onClose={() => setError('')}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                icon={UserIcon}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Masukkan email"
                  icon={EnvelopeIcon}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Nomor Telepon"
                  placeholder="Masukkan nomor telepon"
                  icon={PhoneIcon}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <Input
                label="Subjek"
                placeholder="Masukkan subjek pesan"
                icon={ChatBubbleLeftRightIcon}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />

              <Textarea
                label="Pesan"
                placeholder="Tulis pesan Anda di sini..."
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={loading}
              >
                Kirim Pesan
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="h-full">
            <Typography variant="h5" className="mb-6">
              Lokasi Kantor
            </Typography>
            <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.321123456789!2d106.8456!3d-6.1917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnMzAuMSJTIDEwNsKwNTAnNDQuMiJF!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="DarahKita Office Location"
              />
            </div>
            <div className="mt-4">
              <Typography variant="body2" className="font-medium">
                PT DarahKita Indonesia
              </Typography>
              <Typography variant="caption" color="secondary">
                Jl. Kramat Raya No.47, Jakarta Pusat 10450
              </Typography>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section>
        <Typography variant="h3" className="text-center mb-8">
          Pertanyaan Umum
        </Typography>
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <Typography variant="h6" className="mb-2">
                  {faq.question}
                </Typography>
                <Typography variant="body2" color="secondary">
                  {faq.answer}
                </Typography>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/faq">
            <Button variant="outline">
              Lihat Semua FAQ
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Contact;
