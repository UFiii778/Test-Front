/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Notifications/Notifications.jsx
// DESKRIPSI: Notifications page
// =====================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  CheckCircleIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  InboxIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner } from '../../components/atoms';
import { Tabs, AlertMessage } from '../../components/molecules';
import { NotificationItem, Pagination } from '../../components/molecules';
import { useNotifications } from '../../contexts/NotificationContext';
import api from '../../services/api';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [activeTab, pagination.page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        unread_only: activeTab === 'unread'
      };

      const response = await api.get('/notifications', { params });
      setFilteredNotifications(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await api.delete('/notifications');
      setShowDeleteAllModal(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { key: 'all', label: 'Semua', badge: pagination.total },
    { key: 'unread', label: 'Belum Dibaca', badge: unreadCount }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="mb-2">
            Notifikasi
          </Typography>
          <Typography variant="body2" color="secondary">
            Kelola semua notifikasi Anda
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckIcon className="w-4 h-4 mr-2" />
              Tandai Semua Dibaca
            </Button>
          )}
          {filteredNotifications.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => setShowDeleteAllModal(true)}
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Hapus Semua
            </Button>
          )}
        </div>
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

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {filteredNotifications.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="divide-y divide-gray-100">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      onClick={(notif) => {
                        if (notif.data?.url) {
                          window.location.href = notif.data.url;
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </Card>
            </motion.div>
          ) : (
            <Card className="text-center py-12">
              <InboxIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" className="mb-2">
                Tidak Ada Notifikasi
              </Typography>
              <Typography variant="body2" color="secondary">
                {activeTab === 'unread' 
                  ? 'Semua notifikasi sudah dibaca'
                  : 'Belum ada notifikasi untuk ditampilkan'
                }
              </Typography>
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

      {/* Delete All Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <Typography variant="h6" className="mb-4">
              Hapus Semua Notifikasi
            </Typography>
            <Typography variant="body2" color="secondary" className="mb-6">
              Apakah Anda yakin ingin menghapus semua notifikasi? Tindakan ini tidak dapat dibatalkan.
            </Typography>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowDeleteAllModal(false)}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={handleDeleteAll}
              >
                Hapus Semua
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Notifications;