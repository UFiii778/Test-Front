/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/Sidebar/Sidebar.jsx
// DESKRIPSI: Sidebar component for dashboard
// =====================================================

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import { Icon, Badge } from '../../atoms';
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose, className = '' }) => {
  const { user, logout } = useAuth();

  // Get navigation items based on user role
  const getNavigationItems = () => {
    const items = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['all'] }
    ];

    if (user?.role === 'pasien') {
      items.push(
        { name: 'Permintaan', href: '/requests', icon: ClipboardDocumentListIcon, roles: ['pasien'] },
        { name: 'Buat Permintaan', href: '/requests/create', icon: BeakerIcon, roles: ['pasien'] },
        { name: 'Janji Temu', href: '/appointments', icon: CalendarIcon, roles: ['pasien'] },
        { name: 'Buat Janji', href: '/appointments/create', icon: CalendarIcon, roles: ['pasien'] }
      );
    } else if (user?.role === 'pendonor') {
      items.push(
        { name: 'Riwayat Donor', href: '/donor/history', icon: ClipboardDocumentListIcon, roles: ['pendonor'] },
        { name: 'Sertifikat', href: '/donor/certificates', icon: BuildingOfficeIcon, roles: ['pendonor'] }
      );
    } else if (user?.role === 'pmi') {
      items.push(
        { name: 'Stok Darah', href: '/pmi/stock', icon: BeakerIcon, roles: ['pmi'] },
        { name: 'Verifikasi', href: '/pmi/verify', icon: UserIcon, roles: ['pmi'] },
        { name: 'Laporan', href: '/pmi/reports', icon: ClipboardDocumentListIcon, roles: ['pmi'] }
      );
    } else if (user?.role === 'sukarelawan') {
      items.push(
        { name: 'Verifikasi', href: '/volunteer/verify', icon: UserIcon, roles: ['sukarelawan'] },
        { name: 'Kegiatan', href: '/volunteer/activities', icon: CalendarIcon, roles: ['sukarelawan'] }
      );
    } else if (user?.role === 'admin') {
      items.push(
        { name: 'Users', href: '/admin/users', icon: UserIcon, roles: ['admin'] },
        { name: 'Reports', href: '/admin/reports', icon: ClipboardDocumentListIcon, roles: ['admin'] },
        { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, roles: ['admin'] }
      );
    }

    // Common items for all logged in users
    items.push(
      { name: 'Rumah Sakit', href: '/hospitals', icon: BuildingOfficeIcon, roles: ['all'] },
      { name: 'Stok Darah', href: '/blood-stock', icon: BeakerIcon, roles: ['all'] },
      { name: 'Berita', href: '/news', icon: NewspaperIcon, roles: ['all'] },
      { name: 'Chatbot', href: '/chatbot', icon: ChatBubbleLeftRightIcon, roles: ['all'] },
      { name: 'Profil', href: '/profile', icon: UserIcon, roles: ['all'] },
      { name: 'Pengaturan', href: '/settings', icon: Cog6ToothIcon, roles: ['all'] }
    );

    return items.filter(item => 
      item.roles.includes('all') || (user && item.roles.includes(user.role))
    );
  };

  const navigation = getNavigationItems();

  // Animation variants
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`
          fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200
          lg:translate-x-0 lg:static lg:z-0
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <span className="text-xl font-bold text-primary-600">DarahKita</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg lg:hidden hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600">
                  {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.full_name}</p>
                <Badge variant="primary" size="sm">
                  {user.role === 'pendonor' ? 'Pendonor' : 
                   user.role === 'pasien' ? 'Pasien' : 
                   user.role === 'pmi' ? 'PMI' : 
                   user.role === 'sukarelawan' ? 'Sukarelawan' : 
                   user.role === 'admin' ? 'Admin' : user.role}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-xl
                transition-colors duration-200
                ${isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon name={item.icon.name} size="md" className="mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200"
          >
            <Icon name="ArrowLeftOnRectangleIcon" size="md" className="mr-3" />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default Sidebar;