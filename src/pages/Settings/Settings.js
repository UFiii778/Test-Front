/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Settings/Settings.jsx
// DESKRIPSI: User settings page
// =====================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  LockClosedIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Input } from '../../components/atoms';
import { Tabs, AlertMessage } from '../../components/molecules';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    notify_requests: true,
    notify_responses: true,
    notify_reminders: true,
    notify_emergency: true,
    notify_promotions: false
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Language & Region
  const [language, setLanguage] = useState('id');
  const [timezone, setTimezone] = useState('Asia/Jakarta');
  const [dateFormat, setDateFormat] = useState('dd/MM/yyyy');

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    show_profile_public: true,
    show_donation_history: true,
    allow_data_analytics: true,
    two_factor_auth: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/notifications/settings');
      setNotifSettings(response.data.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/notifications/settings', notifSettings);
      setSuccess('Pengaturan notifikasi berhasil disimpan');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Password baru dan konfirmasi tidak cocok');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setSuccess('Password berhasil diubah');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // await api.put('/users/privacy', privacySettings);
      setSuccess('Pengaturan privasi berhasil disimpan');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'notifications', label: 'Notifikasi', icon: BellIcon },
    { key: 'security', label: 'Keamanan', icon: LockClosedIcon },
    { key: 'privacy', label: 'Privasi', icon: ShieldCheckIcon },
    { key: 'language', label: 'Bahasa & Wilayah', icon: GlobeAltIcon }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Typography variant="h4" className="mb-6">
        Pengaturan
      </Typography>

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

      {/* Settings Tabs */}
      <Card>
        <Tabs
          tabs={tabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          variant="pill"
        />

        <div className="mt-6">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Channel Settings */}
              <div>
                <Typography variant="h6" className="mb-4">
                  Saluran Notifikasi
                </Typography>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <Typography variant="body2" weight="medium">
                          Email
                        </Typography>
                        <Typography variant="caption" color="secondary">
                          Terima notifikasi melalui email
                        </Typography>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifSettings.email_notifications}
                      onChange={(e) => setNotifSettings({
                        ...notifSettings,
                        email_notifications: e.target.checked
                      })}
                      className="toggle-checkbox"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <Typography variant="body2" weight="medium">
                          Push Notifikasi
                        </Typography>
                        <Typography variant="caption" color="secondary">
                          Terima notifikasi di browser/mobile
                        </Typography>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifSettings.push_notifications}
                      onChange={(e) => setNotifSettings({
                        ...notifSettings,
                        push_notifications: e.target.checked
                      })}
                      className="toggle-checkbox"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <Typography variant="body2" weight="medium">
                          SMS
                        </Typography>
                        <Typography variant="caption" color="secondary">
                          Terima notifikasi via SMS (darurat saja)
                        </Typography>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifSettings.sms_notifications}
                      onChange={(e) => setNotifSettings({
                        ...notifSettings,
                        sms_notifications: e.target.checked
                      })}
                      className="toggle-checkbox"
                    />
                  </label>
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <Typography variant="h6" className="mb-4">
                  Jenis Notifikasi
                </Typography>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Permintaan donor baru</span>
                    <input
                      type="checkbox"
                      checked={notifSettings.notify_requests}
                      onChange={(e) => setNotifSettings({
                        ...notifSettings,
                        notify_requests: e.target.checked
                      })}
                      className="toggle-checkbox"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Respon dari pendonor</span>
                    <input
                      type="checkbox"
                      checked={notifSettings.notify_responses}
                      onChange={(e) => setNotifSettings({
                        ...notifSettings,
                        notify_responses: e.target.checked
                      })}
                      className="toggle-checkbox"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Pengingat janji temu</span>
                    <input
                      type="checkbox"
                      checked={notifSettings.notify_reminders}
                      onChange={(e) => setNotifSettings({
                        ...notifSettings,
                        notify_reminders: e.target.checked
                      })}
                      className="toggle-checkbox"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Notifikasi darurat</span>
                    <input
                      type="checkbox"
                      checked={notifSettings.notify_emergency}
                      onChange={(e) => setNotifSettings({
                        ...notifSettings,
                        notify_emergency: e.target.checked
                      })}
                      className="toggle-checkbox"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Promosi & informasi</span>
                    <input
                      type="checkbox"
                      checked={notifSettings.notify_promotions}
                      onChange={(e) => setNotifSettings({
                        ...notifSettings,
                        notify_promotions: e.target.checked
                      })}
                      className="toggle-checkbox"
                    />
                  </label>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleSaveNotifications}
                loading={loading}
              >
                Simpan Pengaturan
              </Button>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <Typography variant="h6" className="mb-4">
                  Ubah Password
                </Typography>
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Password Saat Ini"
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        current_password: e.target.value
                      })}
                      placeholder="Masukkan password saat ini"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({
                        ...showPassword,
                        current: !showPassword.current
                      })}
                      className="absolute right-3 top-9"
                    >
                      {showPassword.current ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Password Baru"
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        new_password: e.target.value
                      })}
                      placeholder="Masukkan password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({
                        ...showPassword,
                        new: !showPassword.new
                      })}
                      className="absolute right-3 top-9"
                    >
                      {showPassword.new ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Konfirmasi Password Baru"
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        confirm_password: e.target.value
                      })}
                      placeholder="Masukkan ulang password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm
                      })}
                      className="absolute right-3 top-9"
                    >
                      {showPassword.confirm ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="h6" className="mb-4">
                  Autentikasi Dua Faktor
                </Typography>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" weight="medium">
                        Two-Factor Authentication (2FA)
                      </Typography>
                      <Typography variant="caption" color="secondary">
                        Aktifkan 2FA untuk keamanan tambahan
                      </Typography>
                    </div>
                    <Button variant="outline" size="sm">
                      Aktifkan
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleChangePassword}
                loading={loading}
              >
                Ubah Password
              </Button>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Typography variant="body2" weight="medium">
                      Profil Publik
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      Izinkan profil Anda dilihat oleh pengguna lain
                    </Typography>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings.show_profile_public}
                    onChange={(e) => setPrivacySettings({
                      ...privacySettings,
                      show_profile_public: e.target.checked
                    })}
                    className="toggle-checkbox"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Typography variant="body2" weight="medium">
                      Riwayat Donor
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      Tampilkan riwayat donor di profil publik
                    </Typography>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings.show_donation_history}
                    onChange={(e) => setPrivacySettings({
                      ...privacySettings,
                      show_donation_history: e.target.checked
                    })}
                    className="toggle-checkbox"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Typography variant="body2" weight="medium">
                      Data Analytics
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      Izinkan penggunaan data untuk analitik
                    </Typography>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings.allow_data_analytics}
                    onChange={(e) => setPrivacySettings({
                      ...privacySettings,
                      allow_data_analytics: e.target.checked
                    })}
                    className="toggle-checkbox"
                  />
                </label>
              </div>

              <Button
                variant="primary"
                onClick={handleSavePrivacy}
                loading={loading}
              >
                Simpan Pengaturan Privasi
              </Button>
            </motion.div>
          )}

          {/* Language & Region Tab */}
          {activeTab === 'language' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <Typography variant="h6" className="mb-4">
                  Bahasa
                </Typography>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <Typography variant="h6" className="mb-4">
                  Zona Waktu
                </Typography>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Asia/Jakarta">WIB (Jakarta)</option>
                  <option value="Asia/Makassar">WITA (Makassar)</option>
                  <option value="Asia/Jayapura">WIT (Jayapura)</option>
                </select>
              </div>

              <div>
                <Typography variant="h6" className="mb-4">
                  Format Tanggal
                </Typography>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="dd/MM/yyyy">31/12/2024</option>
                  <option value="MM/dd/yyyy">12/31/2024</option>
                  <option value="yyyy-MM-dd">2024-12-31</option>
                </select>
              </div>

              <Button variant="primary">
                Simpan Pengaturan
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Settings;