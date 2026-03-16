/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Requests/Requests.jsx
// DESKRIPSI: Donation requests list page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  FunnelIcon,
  HeartIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge } from '../../components/atoms';
import { Tabs } from '../../components/molecules';
import { RequestCard, SearchBar, Pagination } from '../../components/molecules';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    blood_type: '',
    urgency: '',
    city: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const urgencyLevels = [
    { value: 'biasa', label: 'Biasa' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'gawat_darurat', label: 'Gawat Darurat' }
  ];

  useEffect(() => {
    fetchRequests();
  }, [pagination.page, activeTab, filters, sortBy, sortOrder]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        sort: sortBy,
        order: sortOrder
      };

      // Add status filter based on active tab
      if (activeTab === 'pending') params.status = 'menunggu';
      if (activeTab === 'processing') params.status = 'diproses';
      if (activeTab === 'completed') params.status = 'selesai';
      if (activeTab === 'my-requests' && user) params.my_requests = true;

      const response = await api.get('/requests', { params });
      setRequests(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term, filterValues) => {
    setFilters({
      ...filterValues,
      search: term
    });
    setPagination({ ...pagination, page: 1 });
  };

  const handleFilter = (filterValues) => {
    setFilters(filterValues);
    setPagination({ ...pagination, page: 1 });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('DESC');
    }
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      blood_type: '',
      urgency: '',
      city: '',
      status: ''
    });
    setActiveTab('all');
    setPagination({ ...pagination, page: 1 });
  };

  const filterOptions = [
    {
      name: 'blood_type',
      label: 'Golongan Darah',
      type: 'select',
      options: bloodTypes.map(type => ({ value: type, label: type }))
    },
    {
      name: 'urgency',
      label: 'Urgensi',
      type: 'select',
      options: urgencyLevels
    },
    {
      name: 'city',
      label: 'Kota',
      type: 'text',
      placeholder: 'Masukkan nama kota'
    }
  ];

  const tabs = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'processing', label: 'Diproses' },
    { key: 'completed', label: 'Selesai' }
  ];

  if (user?.role === 'pendonor') {
    tabs.push({ key: 'nearby', label: 'Terdekat' });
  }

  if (user?.role === 'pasien') {
    tabs.push({ key: 'my-requests', label: 'Permintaan Saya' });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="mb-2">
            Permintaan Donor Darah
          </Typography>
          <Typography variant="body2" color="secondary">
            {user?.role === 'pendonor' 
              ? 'Temukan dan respon permintaan donor terdekat'
              : user?.role === 'pasien'
                ? 'Buat dan pantau permintaan donor Anda'
                : 'Lihat semua permintaan donor darah'
            }
          </Typography>
        </div>
        
        {user?.role === 'pasien' && (
          <Link to="/requests/create">
            <Button variant="primary">
              <PlusIcon className="w-5 h-5 mr-2" />
              Buat Permintaan
            </Button>
          </Link>
        )}
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

      {/* Search and Filter */}
      <Card>
        <SearchBar
          placeholder="Cari berdasarkan lokasi atau catatan..."
          onSearch={handleSearch}
          onFilter={handleFilter}
          filters={filterOptions}
          showFilter
        />

        {/* Active Filters */}
        {(Object.values(filters).some(v => v) || activeTab !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Typography variant="caption" color="secondary">
                Filter aktif:
              </Typography>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Hapus semua
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {activeTab !== 'all' && (
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  Status: {tabs.find(t => t.key === activeTab)?.label}
                </span>
              )}
              {filters.blood_type && (
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  Gol. Darah: {filters.blood_type}
                </span>
              )}
              {filters.urgency && (
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  Urgensi: {urgencyLevels.find(u => u.value === filters.urgency)?.label}
                </span>
              )}
              {filters.city && (
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  Kota: {filters.city}
                </span>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Sort Bar */}
      <div className="flex items-center justify-between">
        <Typography variant="body2" color="secondary">
          Menampilkan {requests.length} dari {pagination.total} permintaan
        </Typography>
        <div className="flex items-center space-x-2">
          <Typography variant="caption" color="secondary">
            Urutkan:
          </Typography>
          <button
            onClick={() => handleSort('created_at')}
            className={`flex items-center px-3 py-1 rounded-lg text-sm ${
              sortBy === 'created_at' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Terbaru
            {sortBy === 'created_at' && (
              <ArrowsUpDownIcon className={`w-4 h-4 ml-1 ${sortOrder === 'ASC' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSort('urgency')}
            className={`flex items-center px-3 py-1 rounded-lg text-sm ${
              sortBy === 'urgency' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Urgensi
            {sortBy === 'urgency' && (
              <ArrowsUpDownIcon className={`w-4 h-4 ml-1 ${sortOrder === 'ASC' ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>
      </div>

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
                  <RequestCard
                    request={request}
                    onRespond={user?.role === 'pendonor' ? (id) => {
                      // Handle respond
                    } : undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="text-center py-12">
              <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" className="mb-2">
                Tidak ada permintaan ditemukan
              </Typography>
              <Typography variant="body2" color="secondary">
                {user?.role === 'pendonor' 
                  ? 'Belum ada permintaan yang cocok dengan golongan darah Anda'
                  : user?.role === 'pasien'
                    ? 'Anda belum membuat permintaan donor'
                    : 'Coba ubah filter atau kata kunci pencarian Anda'
                }
              </Typography>
              {user?.role === 'pasien' && (
                <Link to="/requests/create" className="mt-4 inline-block">
                  <Button variant="primary">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Buat Permintaan
                  </Button>
                </Link>
              )}
            </Card>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Requests;