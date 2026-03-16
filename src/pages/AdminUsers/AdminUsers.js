/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/AdminUsers/AdminUsers.jsx
// DESKRIPSI: Admin user management page
// =====================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge, Input, Modal } from '../../components/atoms';
import { AlertMessage } from '../../components/molecules';
import { Pagination } from '../../components/molecules';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm, selectedRole, selectedStatus]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        role: selectedRole || undefined,
        is_verified: selectedStatus === 'verified' ? true : 
                    selectedStatus === 'unverified' ? false : undefined,
        search: searchTerm || undefined
      };

      const response = await api.get('/admin/users', { params });
      setUsers(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    setError('');
    
    try {
      await api.delete(`/admin/users/${selectedUser.id}`);
      setSuccess('User berhasil dihapus');
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'danger',
      pmi: 'primary',
      sukarelawan: 'success',
      pasien: 'warning',
      pendonor: 'info'
    };
    return (
      <Badge variant={variants[role] || 'secondary'}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="mb-2">
            User Management
          </Typography>
          <Typography variant="body2" color="secondary">
            Kelola semua pengguna aplikasi
          </Typography>
        </div>
        <Link to="/admin/users/create">
          <Button variant="primary">
            <PlusIcon className="w-5 h-5 mr-2" />
            Tambah User
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <AlertMessage
          type="error"
          message={error}
          dismissible
          onClose={() => setError('')}
        />
      )}
      
      {success && (
        <AlertMessage
          type="success"
          message={success}
          dismissible
          onClose={() => setSuccess('')}
        />
      )}

      {/* Filters */}
      <Card>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={MagnifyingGlassIcon}
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="pmi">PMI</option>
            <option value="sukarelawan">Sukarelawan</option>
            <option value="pasien">Pasien</option>
            <option value="pendonor">Pendonor</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Status</option>
            <option value="verified">Terverifikasi</option>
            <option value="unverified">Belum Verifikasi</option>
          </select>
          <Button type="submit">Filter</Button>
        </form>
      </Card>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kontak</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Lokasi</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bergabung</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-primary-600">
                              {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <Typography variant="body2" weight="medium">
                              {user.full_name}
                            </Typography>
                            <Typography variant="caption" color="secondary">
                              {user.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 py-3">
                        <Typography variant="body2">{user.phone || '-'}</Typography>
                      </td>
                      <td className="px-4 py-3">
                        <Typography variant="body2">{user.city || '-'}</Typography>
                      </td>
                      <td className="px-4 py-3">
                        {user.is_verified ? (
                          <Badge variant="success" icon={CheckCircleIcon}>
                            Terverifikasi
                          </Badge>
                        ) : (
                          <Badge variant="warning" icon={XCircleIcon}>
                            Belum Verifikasi
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Link to={`/admin/users/${user.id}`}>
                            <Button size="sm" variant="outline">
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus User"
      >
        <div className="space-y-4">
          <Typography variant="body2" color="secondary">
            Apakah Anda yakin ingin menghapus user <span className="font-bold">{selectedUser?.full_name}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </Typography>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowDeleteModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleDelete}
              loading={submitting}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;