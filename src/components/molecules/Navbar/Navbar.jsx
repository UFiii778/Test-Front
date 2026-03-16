/* eslint-disable */
// =====================================================
// FILE: frontend/src/components/molecules/Navbar/Navbar.jsx
// DESKRIPSI: Navbar component with navigation links
// =====================================================

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  BellIcon 
} from '@heroicons/react/24/outline';

import { Button, Avatar, Badge, Icon } from '../../atoms';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from "../../../contexts/NotificationContext";

const Navbar = ({ transparent = false, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  // Navigation links
  const navLinks = [
    { name: 'Beranda', path: '/', icon: HomeIcon },
    { name: 'Rumah Sakit', path: '/hospitals', icon: BuildingOfficeIcon },
    { name: 'Stok Darah', path: '/blood-stock', icon: BeakerIcon },
    { name: 'Berita', path: '/news', icon: NewspaperIcon },
    { name: 'Chatbot', path: '/chatbot', icon: ChatBubbleLeftRightIcon }
  ];

  // User menu links based on role
  const getUserMenuLinks = () => {
    const links = [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon }
    ];

    if (user?.role === 'pasien') {
      links.push(
        { name: 'Permintaan Saya', path: '/requests', icon: BeakerIcon },
        { name: 'Janji Temu', path: '/appointments', icon: ChatBubbleLeftRightIcon }
      );
    } else if (user?.role === 'pendonor') {
      links.push(
        { name: 'Riwayat Donor', path: '/donor/history', icon: BeakerIcon },
        { name: 'Sertifikat', path: '/donor/certificates', icon: BuildingOfficeIcon }
      );
    } else if (user?.role === 'pmi') {
      links.push(
        { name: 'Stok Darah', path: '/pmi/stock', icon: BeakerIcon },
        { name: 'Verifikasi', path: '/pmi/verify', icon: UserCircleIcon }
      );
    } else if (user?.role === 'sukarelawan') {
      links.push(
        { name: 'Verifikasi', path: '/volunteer/verify', icon: UserCircleIcon }
      );
    } else if (user?.role === 'admin') {
      links.push(
        { name: 'Users', path: '/admin/users', icon: UserCircleIcon },
        { name: 'Reports', path: '/admin/reports', icon: BeakerIcon }
      );
    }

    links.push(
      { name: 'Profil', path: '/profile', icon: UserCircleIcon },
      { name: 'Pengaturan', path: '/settings', icon: BuildingOfficeIcon }
    );

    return links;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  return (
    <nav className={`
      fixed top-0 z-50 w-full
      ${transparent ? 'bg-transparent' : 'bg-white border-b border-gray-200 shadow-sm'}
      ${className}
    `}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center p-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
            
            <Link to="/" className="flex items-center ml-2 lg:ml-0">
              <span className="text-xl font-bold text-primary-600">DarahKita</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900"
              >
                <Icon name={link.icon.name} size="sm" className="mr-2" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right section - Notifications & Profile */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            {user && (
              <Link
                to="/notifications"
                className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-900"
              >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                  <Badge
                    size="sm"
                    variant="danger"
                    className="absolute -top-1 -right-1"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Link>
            )}

            {/* Profile dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Avatar
                    src={user.profile_picture}
                    name={user.full_name}
                    size="sm"
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.full_name?.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1">
                        {getUserMenuLinks().map((link) => (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Icon name={link.icon.name} size="sm" className="mr-3" />
                            {link.name}
                          </Link>
                        ))}
                        <div className="border-t border-gray-200 my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Icon name="ArrowLeftOnRectangleIcon" size="sm" className="mr-3" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Daftar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon name={link.icon.name} size="md" className="mr-3" />
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

Navbar.propTypes = {
  transparent: PropTypes.bool,
  className: PropTypes.string
};

export default Navbar;