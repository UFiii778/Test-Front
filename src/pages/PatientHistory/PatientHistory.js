/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/PatientHistory/PatientHistory.jsx
// DESKRIPSI: Patient request history page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge } from '../../components/atoms';
import { Tabs, Pagination } from '../../components/molecules';
import { UrgencyBadge } from '../../components/molecules';
import api from '../../services/api';
import { formatDate } from '../../utils/dateFormatter';

const PatientHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchRequests();
  }, [pagination.page, activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        my_requests: true
      };

      if (activeTab !== 'all') {
        params.status = activeTab;
      }

      const response = await api.get('/requests', { params });
      setRequests(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      console.error('Error fetching patient history:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'all', label: 'Semua' },
    { key: 'menunggu', label: 'Menunggu' },
    { key: 'diproses', label: 'Diproses' },
    { key: 'selesai', label: 'Selesai' },
    { key: 'dibatalkan', label: 'Dibatalkan' }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      menunggu: 'warning',
      diproses: 'info',
      selesai: 'success',
      dibatalkan: 'danger'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Typography variant="h4" className="mb-2">
          Riwayat Permintaan
        </Typography>
        <Typography variant="body2" color="secondary">
          Lihat semua permintaan donor yang pernah Anda buat
        </Typography>
      </div>

      {/* Tabs */}
      <Card className="p-2">
        <Tabs
          tabs={tabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          variant="pill"
        />
      </Card>

      {/* Requests List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {requests.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant="primary" size="lg">
                            {request.blood_type}
                          </Badge>
                          <UrgencyBadge urgency={request.urgency} />
                          {getStatusBadge(request.request_status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <Typography variant="caption" color="secondary">
                              Jumlah
                            </Typography>
                            <Typography variant="body2" weight="medium">
                              {request.quantity} kantong
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="caption" color="secondary">
                              Total Respon
                            </Typography>
                            <Typography variant="body2" weight="medium">
                              {request.total_responses || 0}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="caption" color="secondary">
                              Tersedia
                            </Typography>
                            <Typography variant="body2" weight="medium" className="text-green-600">
                              {request.available_responses || 0}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="caption" color="secondary">
                              Dibuat
                            </Typography>
                            <Typography variant="body2" weight="medium">
                              {formatDate(request.created_at)}
                            </Typography>
                          </div>
                        </div>

                        {request.hospital_name && (
                          <Typography variant="caption" color="secondary" className="block">
                            RS: {request.hospital_name}
                          </Typography>
                        )}

                        {request.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <Typography variant="caption" color="secondary">
                              {request.notes}
                            </Typography>
                          </div>
                        )}
                      </div>

                      <Link to={`/requests/${request.id}`}>
                        <Button variant="outline" size="sm">
                          <EyeIcon className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="text-center py-12">
              <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" className="mb-2">
                Belum Ada Permintaan
              </Typography>
              <Typography variant="body2" color="secondary">
                Anda belum membuat permintaan donor darah
              </Typography>
              <Link to="/requests/create" className="mt-4 inline-block">
                <Button variant="primary">
                  Buat Permintaan
                </Button>
              </Link>
            </Card>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setPagination({ ...pagination, page })}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientHistory;