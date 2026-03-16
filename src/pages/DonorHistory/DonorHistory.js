/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/DonorHistory/DonorHistory.jsx
// DESKRIPSI: Donor history page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge } from '../../components/atoms';
import { Tabs, Pagination } from '../../components/molecules';
import api from '../../services/api';
import { formatDate } from '../../utils/dateFormatter';

const DonorHistory = () => {
  const [history, setHistory] = useState([]);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchHistory();
  }, [pagination.page, selectedYear]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        year: selectedYear !== 'all' ? selectedYear : undefined
      };

      const response = await api.get('/donor/history', { params });
      setHistory(response.data.data.history);
      setYearlyStats(response.data.data.yearly_stats);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      console.error('Error fetching donor history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = (id) => {
    window.open(`/donor/certificate/${id}`, '_blank');
  };

  const getStatusBadge = (status) => {
    const variants = {
      berhasil: 'success',
      batal: 'danger',
      tertunda: 'warning'
    };
    const labels = {
      berhasil: 'Berhasil',
      batal: 'Batal',
      tertunda: 'Tertunda'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="mb-2">
            Riwayat Donor
          </Typography>
          <Typography variant="body2" color="secondary">
            Lihat semua aktivitas donor darah Anda
          </Typography>
        </div>
        <Button variant="outline">
          <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Yearly Stats */}
      {yearlyStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {yearlyStats.map((stat) => (
            <Card key={stat.year} className="text-center p-4">
              <Typography variant="h3" color="primary" className="mb-1">
                {stat.total}
              </Typography>
              <Typography variant="caption" color="secondary">
                {stat.year}
              </Typography>
              <Typography variant="caption" color="secondary" className="block">
                {stat.total_quantity} kantong
              </Typography>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <Typography variant="body2" weight="medium">
            Filter Tahun:
          </Typography>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Semua Tahun</option>
            {yearlyStats.map((stat) => (
              <option key={stat.year} value={stat.year}>
                {stat.year} ({stat.total} donor)
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* History List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {history.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Date */}
                        <div className="text-center min-w-[60px]">
                          <Typography variant="h5" color="primary" className="leading-tight">
                            {new Date(item.donation_date).getDate()}
                          </Typography>
                          <Typography variant="caption" color="secondary" className="block">
                            {new Date(item.donation_date).toLocaleString('id-ID', { month: 'short' })}
                          </Typography>
                          <Typography variant="caption" color="secondary" className="block">
                            {new Date(item.donation_date).getFullYear()}
                          </Typography>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="primary" size="lg">
                              {item.blood_type}
                            </Badge>
                            {getStatusBadge(item.status)}
                          </div>
                          
                          <Typography variant="body2" weight="medium" className="mb-1">
                            {item.hospital_name}
                          </Typography>
                          
                          <Typography variant="caption" color="secondary" className="flex items-center">
                            <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                            {item.hospital_city}
                          </Typography>

                          {item.request_code && (
                            <Typography variant="caption" color="secondary" className="mt-1 block">
                              Permintaan: {item.request_code}
                            </Typography>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Typography variant="h6" weight="bold" className="text-primary-600">
                          {item.quantity}
                        </Typography>
                        <Typography variant="caption" color="secondary">
                          kantong
                        </Typography>
                        {item.status === 'berhasil' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadCertificate(item.id)}
                          >
                            <DocumentTextIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <Typography variant="caption" color="secondary">
                          <span className="font-medium">Catatan:</span> {item.notes}
                        </Typography>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="text-center py-12">
              <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" className="mb-2">
                Belum Ada Riwayat Donor
              </Typography>
              <Typography variant="body2" color="secondary">
                Anda belum melakukan donor darah. Mulai donor sekarang!
              </Typography>
              <Link to="/requests" className="mt-4 inline-block">
                <Button variant="primary">
                  Cari Permintaan Donor
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

export default DonorHistory;
