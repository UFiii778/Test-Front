/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/DonorCertificate/DonorCertificate.jsx
// DESKRIPSI: Donor certificate page
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  ArrowLeftIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { useReactToPrint } from 'react-to-print';

import { Typography, Card, Button, Spinner, Divider } from '../../components/atoms';
import { Breadcrumb } from '../../components/molecules';
import api from '../../services/api';
import { formatDate } from '../../utils/dateFormatter';

const DonorCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const certificateRef = useRef();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/donor/certificate/${id}`);
      setCertificate(response.data.data);
    } catch (error) {
      console.error('Error fetching certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: `Sertifikat Donor - ${certificate?.certificate_number}`
  });

  const handleDownload = () => {
    // Implement PDF download logic
    handlePrint();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Sertifikat Donor Darah',
        text: `Saya telah mendonorkan darah di ${certificate?.hospital_name}`,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="text-center py-12">
        <Typography variant="h5" color="danger">
          Sertifikat tidak ditemukan
        </Typography>
        <Button
          variant="primary"
          onClick={() => navigate('/donor/history')}
          className="mt-4"
        >
          Kembali ke Riwayat
        </Button>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Riwayat Donor', path: '/donor/history' },
    { label: 'Sertifikat Donor' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/donor/history')}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <PrinterIcon className="w-4 h-4 mr-2" />
            Cetak
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          {navigator.share && (
            <Button variant="outline" onClick={handleShare}>
              <ShareIcon className="w-4 h-4 mr-2" />
              Bagikan
            </Button>
          )}
        </div>
      </div>

      {/* Certificate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        ref={certificateRef}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-primary-100"
      >
        {/* Certificate Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white text-center">
          <HeartIcon className="w-20 h-20 mx-auto mb-4 text-white opacity-80" />
          <Typography variant="h2" weight="bold" className="mb-2">
            SERTIFIKAT DONOR DARAH
          </Typography>
          <Typography variant="body1" className="opacity-90">
            Palang Merah Indonesia
          </Typography>
        </div>

        {/* Certificate Body */}
        <div className="p-12">
          <div className="text-center mb-8">
            <Typography variant="body1" color="secondary" className="mb-4">
              Diberikan kepada:
            </Typography>
            <Typography variant="h3" weight="bold" className="mb-2">
              {certificate.donor_name}
            </Typography>
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="primary" size="lg">
                {certificate.blood_type}
              </Badge>
              <CheckBadgeIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>

          <Divider />

          <div className="grid md:grid-cols-2 gap-8 py-8">
            <div className="text-center">
              <Typography variant="body2" color="secondary" className="mb-2">
                Tanggal Donor
              </Typography>
              <Typography variant="h5" weight="bold">
                {formatDate(certificate.donation_date, 'dd MMMM yyyy')}
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="body2" color="secondary" className="mb-2">
                Jumlah Donor
              </Typography>
              <Typography variant="h5" weight="bold">
                {certificate.quantity} Kantong
              </Typography>
            </div>
          </div>

          <div className="text-center py-4">
            <Typography variant="body2" color="secondary" className="mb-2">
              Lokasi Donor
            </Typography>
            <Typography variant="h6" weight="bold">
              {certificate.hospital_name}
            </Typography>
            <Typography variant="body2" color="secondary">
              {certificate.hospital_city}
            </Typography>
          </div>

          <Divider />

          <div className="pt-8">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <Typography variant="body2" color="secondary">
                  Nomor Sertifikat
                </Typography>
                <Typography variant="body2" weight="bold">
                  {certificate.certificate_number}
                </Typography>
              </div>
              <div className="text-center">
                <Typography variant="body2" color="secondary">
                  Diterbitkan
                </Typography>
                <Typography variant="body2" weight="bold">
                  {formatDate(certificate.issued_at, 'dd MMMM yyyy')}
                </Typography>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="mt-8 flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${certificate.qr_code}`}
              alt="QR Code"
              className="w-32 h-32"
            />
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Sertifikat ini diterbitkan secara digital oleh DarahKita</p>
            <p>Verifikasi keaslian: darahkita.id/verify/{certificate.id}</p>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-200">
          <Typography variant="caption" color="secondary">
            Terima kasih telah menjadi pahlawan kemanusiaan.
            Setiap tetes darah Anda sangat berarti.
          </Typography>
        </div>
      </motion.div>

      {/* Verification Note */}
      <Card variant="info" className="bg-blue-50">
        <div className="flex items-start">
          <CheckBadgeIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <Typography variant="caption" color="primary">
            Sertifikat ini dapat diverifikasi keasliannya melalui website DarahKita
            dengan memasukkan nomor sertifikat atau scan QR code.
          </Typography>
        </div>
      </Card>
    </div>
  );
};

export default DonorCertificate;
