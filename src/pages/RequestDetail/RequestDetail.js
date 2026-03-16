/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/RequestDetail/RequestDetail.jsx
// DESKRIPSI: Donation request detail page
// =====================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge, Divider, Modal } from '../../components/atoms';
import { UrgencyBadge, Breadcrumb, DonorCard } from '../../components/molecules';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { formatDate, formatTime, formatDistanceToNow } from '../../utils/dateFormatter';

const RequestDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [responseStatus, setResponseStatus] = useState('tersedia');
  const [responseNotes, setResponseNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequestDetail();
  }, [id]);

  const fetchRequestDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/requests/${id}`);
      setRequest(response.data.data);
      setResponses(response.data.data.responses || []);
    } catch (error) {
      console.error('Error fetching request detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async () => {
    setSubmitting(true);
    try {
      await api.post(`/requests/${id}/respond`, {
        response_status: responseStatus,
        notes: responseNotes
      });
      setShowRespondModal(false);
      fetchRequestDetail();
    } catch (error) {
      console.error('Error responding to request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async () => {
    setSubmitting(true);
    try {
      await api.post(`/requests/${id}/cancel`, {
        reason: 'Dibatalkan oleh pemohon'
      });
      setShowCancelModal(false);
      navigate('/requests');
    } catch (error) {
      console.error('Error cancelling request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      await api.put(`/requests/${id}/status`, { status: 'selesai' });
      fetchRequestDetail();
    } catch (error) {
      console.error('Error marking request as completed:', error);
    }
  };

  const isOwner = user?.id === request?.patient_id;
  const canRespond = user?.role === 'pendonor' && request?.request_status === 'menunggu';
  const canCancel = (isOwner || user?.role === 'admin') && request?.request_status === 'menunggu';
  const canMarkComplete = (isOwner || user?.role === 'admin') && request?.request_status === 'diproses';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <Typography variant="h5" color="danger">
          Permintaan tidak ditemukan
        </Typography>
        <Link to="/requests" className="mt-4 inline-block">
          <Button variant="primary">Kembali ke Daftar</Button>
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Permintaan', path: '/requests' },
    { label: `Permintaan #${request.request_code || request.id}` }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Link to="/requests" className="flex items-center text-gray-600 hover:text-primary-600">
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Kembali
        </Link>
        <div className="flex items-center space-x-2">
          {canCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowCancelModal(true)}
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Batalkan Permintaan
            </Button>
          )}
          {canMarkComplete && (
            <Button
              variant="success"
              size="sm"
              onClick={handleMarkAsCompleted}
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Tandai Selesai
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Request Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Request Info Card */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Typography variant="h4">
                    {request.blood_type}
                  </Typography>
                  <UrgencyBadge urgency={request.urgency} size="lg" />
                </div>
                <Typography variant="body2" color="secondary">
                  Kode: {request.request_code || `REQ-${request.id}`}
                </Typography>
              </div>
              <Badge variant={
                request.request_status === 'menunggu' ? 'warning' :
                request.request_status === 'diproses' ? 'info' :
                request.request_status === 'selesai' ? 'success' : 'danger'
              } size="lg">
                {request.request_status}
              </Badge>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Typography variant="caption" color="secondary" className="block mb-1">
                  Jumlah Kantong
                </Typography>
                <Typography variant="h5">
                  {request.quantity}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="secondary" className="block mb-1">
                  Dibuat
                </Typography>
                <Typography variant="body2">
                  {formatDate(request.created_at)}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {formatDistanceToNow(request.created_at)}
                </Typography>
              </div>
            </div>

            <Divider />

            {/* Patient Info */}
            <div className="py-4 space-y-3">
              <Typography variant="h6" className="mb-3">
                Informasi Pasien
              </Typography>
              
              <div className="flex items-center">
                <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <Typography variant="body2" weight="medium">
                    {request.patient_name}
                  </Typography>
                </div>
              </div>

              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-gray-400 mr-3" />
                <Typography variant="body2">
                  {request.patient_city || request.location || 'Lokasi tidak diketahui'}
                </Typography>
              </div>

              {request.hospital_name && (
                <div className="flex items-center">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <Typography variant="body2">
                    {request.hospital_name}
                  </Typography>
                </div>
              )}
            </div>

            {request.notes && (
              <>
                <Divider />
                <div className="py-4">
                  <Typography variant="body2" weight="bold" className="mb-2">
                    Catatan
                  </Typography>
                  <Typography variant="body2" color="secondary" className="bg-gray-50 p-3 rounded-lg">
                    {request.notes}
                  </Typography>
                </div>
              </>
            )}
          </Card>

          {/* Responses List */}
          <Card>
            <Typography variant="h6" className="mb-4">
              Respon dari Pendonor ({responses.length})
            </Typography>

            {responses.length > 0 ? (
              <div className="space-y-4">
                {responses.map((response) => (
                  <DonorCard
                    key={response.id}
                    donor={response}
                    showContact={isOwner}
                    showDistance
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Typography variant="body2" color="secondary">
                  Belum ada respon dari pendonor
                </Typography>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Right Column - Actions & Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Action Card */}
          {canRespond && (
            <Card variant="primary">
              <Typography variant="h6" className="mb-4">
                Respon Permintaan
              </Typography>
              <Typography variant="body2" className="mb-4">
                Anda cocok dengan permintaan ini? Respon sekarang untuk membantu.
              </Typography>
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowRespondModal(true)}
              >
                <HeartIcon className="w-5 h-5 mr-2" />
                Respon Permintaan
              </Button>
            </Card>
          )}

          {/* Stats Card */}
          <Card>
            <Typography variant="h6" className="mb-4">
              Statistik
            </Typography>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Typography variant="body2" color="secondary">
                  Total Respon
                </Typography>
                <Typography variant="body2" weight="bold">
                  {request.total_responses || 0}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body2" color="secondary">
                  Tersedia
                </Typography>
                <Typography variant="body2" weight="bold" className="text-green-600">
                  {request.available_responses || 0}
                </Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="body2" color="secondary">
                  Pertimbangan
                </Typography>
                <Typography variant="body2" weight="bold" className="text-yellow-600">
                  {request.considering_responses || 0}
                </Typography>
              </div>
            </div>
          </Card>

          {/* Contact Info (only for owner) */}
          {isOwner && (
            <Card>
              <Typography variant="h6" className="mb-4">
                Kontak Darurat
              </Typography>
              <div className="space-y-3">
                <Button variant="outline" fullWidth>
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Hubungi PMI Terdekat
                </Button>
                <Button variant="outline" fullWidth>
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                  Hubungi Pendonor
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Respond Modal */}
      <Modal
        isOpen={showRespondModal}
        onClose={() => setShowRespondModal(false)}
        title="Respon Permintaan Donor"
      >
        <div className="space-y-4">
          <div>
            <Typography variant="body2" weight="bold" className="mb-2">
              Status Ketersediaan
            </Typography>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="status"
                  value="tersedia"
                  checked={responseStatus === 'tersedia'}
                  onChange={(e) => setResponseStatus(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <Typography variant="body2" weight="medium">
                    Tersedia
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    Saya bisa donor sekarang
                  </Typography>
                </div>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="status"
                  value="pertimbangan"
                  checked={responseStatus === 'pertimbangan'}
                  onChange={(e) => setResponseStatus(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <Typography variant="body2" weight="medium">
                    Sedang Dipertimbangkan
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    Saya akan konfirmasi nanti
                  </Typography>
                </div>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="status"
                  value="tidak_tersedia"
                  checked={responseStatus === 'tidak_tersedia'}
                  onChange={(e) => setResponseStatus(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <Typography variant="body2" weight="medium">
                    Tidak Tersedia
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    Saya tidak bisa donor saat ini
                  </Typography>
                </div>
              </label>
            </div>
          </div>

          <div>
            <Typography variant="body2" weight="bold" className="mb-2">
              Catatan (opsional)
            </Typography>
            <textarea
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              placeholder="Tambahkan catatan untuk pemohon..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              rows="3"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowRespondModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleRespond}
              loading={submitting}
            >
              Kirim Respon
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Batalkan Permintaan"
      >
        <div className="space-y-4">
          <Typography variant="body2" color="secondary">
            Apakah Anda yakin ingin membatalkan permintaan ini? Tindakan ini tidak dapat dibatalkan.
          </Typography>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowCancelModal(false)}
            >
              Tidak
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleCancelRequest}
              loading={submitting}
            >
              Ya, Batalkan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RequestDetail;