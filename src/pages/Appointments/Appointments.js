/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Appointments/Appointments.jsx
// DESKRIPSI: Appointments list page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  CalendarIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge } from '../../components/atoms';
import { Tabs } from '../../components/molecules';
import { AppointmentCard, SearchBar, Pagination } from '../../components/molecules';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { formatDate } from '../../utils/dateFormatter';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, [activeTab, pagination.page, selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (activeTab === 'upcoming') {
        params.start_date = new Date().toISOString().split('T')[0];
      } else if (activeTab === 'past') {
        params.end_date = new Date().toISOString().split('T')[0];
      } else if (activeTab === 'date') {
        params.date = formatDate(selectedDate, 'YYYY-MM-DD');
      }

      const response = await api.get('/appointments', { params });
      setAppointments(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/appointments/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.post(`/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleReschedule = (id) => {
    // Navigate to reschedule page
    // navigate(`/appointments/${id}/reschedule`);
  };

  const handleConfirm = async (id) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: 'dikonfirmasi' });
      fetchAppointments();
    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
    setActiveTab('date');
  };

  const tabs = [
    { key: 'upcoming', label: 'Akan Datang', badge: stats.upcoming_count },
    { key: 'past', label: 'Riwayat' },
    { key: 'date', label: 'Tanggal Tertentu' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="mb-2">
            Janji Temu
          </Typography>
          <Typography variant="body2" color="secondary">
            Kelola jadwal donor dan konsultasi Anda
          </Typography>
        </div>
        
        {user?.role === 'pasien' && (
          <Link to="/appointments/create">
            <Button variant="primary">
              <PlusIcon className="w-5 h-5 mr-2" />
              Buat Janji
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <Typography variant="h3" color="primary" className="mb-1">
            {stats.today || 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Hari Ini
          </Typography>
        </Card>
        <Card className="text-center p-4">
          <Typography variant="h3" color="success" className="mb-1">
            {stats.this_week || 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Minggu Ini
          </Typography>
        </Card>
        <Card className="text-center p-4">
          <Typography variant="h3" color="warning" className="mb-1">
            {stats.pending || 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Menunggu
          </Typography>
        </Card>
        <Card className="text-center p-4">
          <Typography variant="h3" color="info" className="mb-1">
            {stats.completed || 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Selesai
          </Typography>
        </Card>
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

      {/* Date Selector */}
      {activeTab === 'date' && (
        <Card>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateChange(-1)}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <Typography variant="h6">
                {formatDate(selectedDate, 'EEEE, dd MMMM yyyy')}
              </Typography>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateChange(1)}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Appointments List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {appointments.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {appointments.map((group) => (
                <div key={group.date} className="space-y-3">
                  <Typography variant="h6" className="px-1">
                    {formatDate(group.date, 'EEEE, dd MMMM yyyy')}
                  </Typography>
                  <div className="space-y-4">
                    {group.appointments.map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <AppointmentCard
                          appointment={appointment}
                          onCancel={handleCancel}
                          onReschedule={handleReschedule}
                          onConfirm={user?.role === 'pmi' || user?.role === 'admin' 
                            ? handleConfirm 
                            : undefined
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <Card className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" className="mb-2">
                Tidak ada janji temu
              </Typography>
              <Typography variant="body2" color="secondary">
                {user?.role === 'pasien' 
                  ? 'Anda belum memiliki janji temu. Buat jadwal donor sekarang.'
                  : 'Belum ada janji temu pada periode ini'
                }
              </Typography>
              {user?.role === 'pasien' && (
                <Link to="/appointments/create" className="mt-4 inline-block">
                  <Button variant="primary">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Buat Janji Temu
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
                onPageChange={(page) => setPagination({ ...pagination, page })}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Appointments;