/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/AdminReports/AdminReports.jsx
// DESKRIPSI: Admin reports page
// =====================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  BeakerIcon,
  UserGroupIcon,
  HeartIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Input } from '../../components/atoms';
import { Tabs } from '../../components/molecules';
import api from '../../services/api';

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedReport, setSelectedReport] = useState('blood-stock');

  const reportTypes = [
    { id: 'blood-stock', label: 'Stok Darah', icon: BeakerIcon },
    { id: 'donations', label: 'Donor', icon: HeartIcon },
    { id: 'requests', label: 'Permintaan', icon: DocumentTextIcon },
    { id: 'users', label: 'Users', icon: UserGroupIcon },
    { id: 'hospitals', label: 'Rumah Sakit', icon: BuildingOfficeIcon },
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon }
  ];

  useEffect(() => {
    fetchReport();
  }, [selectedReport, dateRange]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format: 'json'
      };

      const response = await api.get(`/reports/${selectedReport}`, { params });
      setReportData(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format
      };

      const response = await api.get(`/reports/${selectedReport}`, { 
        params,
        responseType: format === 'json' ? 'json' : 'blob'
      });

      if (format === 'json') {
        // Handle JSON download
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `report-${selectedReport}-${dateRange.startDate}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      } else {
        // Handle file download (excel/pdf)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report-${selectedReport}-${dateRange.startDate}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const renderBloodStockReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <Typography variant="h3" color="primary" className="mb-2">
            {reportData?.summary?.total_stock || 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Total Stok
          </Typography>
        </Card>
        <Card className="text-center p-4">
          <Typography variant="h3" color="danger" className="mb-2">
            {reportData?.summary?.by_status?.kritis || 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Lokasi Kritis
          </Typography>
        </Card>
        <Card className="text-center p-4">
          <Typography variant="h3" color="warning" className="mb-2">
            {reportData?.summary?.by_status?.waspada || 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Lokasi Waspada
          </Typography>
        </Card>
      </div>

      {/* By Blood Type */}
      <Card>
        <Typography variant="h6" className="mb-4">
          Stok per Golongan Darah
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(reportData?.summary?.by_blood_type || {}).map(([type, qty]) => (
            <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
              <Typography variant="h5" weight="bold" className="mb-2">
                {type}
              </Typography>
              <Typography variant="h4" color="primary">
                {qty}
              </Typography>
            </div>
          ))}
        </div>
      </Card>

      {/* Details Table */}
      <Card>
        <Typography variant="h6" className="mb-4">
          Detail Stok per Lokasi
        </Typography>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Lokasi</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kota</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Provinsi</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Gol. Darah</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jumlah</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData?.details?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">{item.location_name}</td>
                  <td className="px-4 py-3">{item.city}</td>
                  <td className="px-4 py-3">{item.province}</td>
                  <td className="px-4 py-3">
                    <Badge variant="primary">{item.blood_type}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">{item.quantity}</td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      item.status === 'kritis' ? 'danger' :
                      item.status === 'waspada' ? 'warning' : 'success'
                    }>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(item.last_updated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderDonationsReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <Typography variant="h3" color="primary" className="mb-2">
            {reportData?.summary?.total_donations || 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Total Donasi
          </Typography>
        </Card>
        <Card className="text-center p-4">
          <Typography variant="h3" color="success" className="mb-2">
            {reportData?.summary?.total_blood || 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Total Darah (kantong)
          </Typography>
        </Card>
        <Card className="text-center p-4">
          <Typography variant="h3" color="info" className="mb-2">
            {reportData?.summary?.unique_donors || 0}
          </Typography>
          <Typography variant="caption" color="secondary">
            Donor Unik
          </Typography>
        </Card>
        <Card className="text-center p-4">
          <Typography variant="h3" color="purple" className="mb-2">
            {Math.round((reportData?.summary?.successful / reportData?.summary?.total_donations) * 100 || 0)}%
          </Typography>
          <Typography variant="caption" color="secondary">
            Tingkat Keberhasilan
          </Typography>
        </Card>
      </div>

      {/* By Period */}
      <Card>
        <Typography variant="h6" className="mb-4">
          Donasi per Periode
        </Typography>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Periode</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jumlah</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total Darah</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Donor Unik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData?.by_period?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">{item.period}</td>
                  <td className="px-4 py-3 font-medium">{item.count}</td>
                  <td className="px-4 py-3">{item.total}</td>
                  <td className="px-4 py-3">{item.donors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top Donors */}
      <Card>
        <Typography variant="h6" className="mb-4">
          Top 10 Pendonor
        </Typography>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Gol. Darah</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kota</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jumlah Donasi</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total Darah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData?.top_donors?.map((donor, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">{donor.full_name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="primary">{donor.blood_type}</Badge>
                  </td>
                  <td className="px-4 py-3">{donor.city}</td>
                  <td className="px-4 py-3 font-medium">{donor.donation_count}</td>
                  <td className="px-4 py-3">{donor.total_blood}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="mb-2">
            Laporan & Statistik
          </Typography>
          <Typography variant="body2" color="secondary">
            Generate dan export laporan sistem
          </Typography>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Report Type */}
          <div className="flex-1">
            <Typography variant="body2" weight="medium" className="mb-2">
              Jenis Laporan
            </Typography>
            <div className="flex flex-wrap gap-2">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`
                    flex items-center px-4 py-2 rounded-lg border transition-all
                    ${selectedReport === type.id
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                    }
                  `}
                >
                  <type.icon className="w-4 h-4 mr-2" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-end space-x-2">
            <div>
              <Typography variant="caption" color="secondary" className="mb-1">
                Dari
              </Typography>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div>
              <Typography variant="caption" color="secondary" className="mb-1">
                Sampai
              </Typography>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex items-end space-x-2">
            <Button
              variant="outline"
              onClick={() => handleExport('excel')}
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
            >
              <PrinterIcon className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <motion.div
          key={selectedReport}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {selectedReport === 'blood-stock' && renderBloodStockReport()}
          {selectedReport === 'donations' && renderDonationsReport()}
          {/* Add other report types as needed */}
        </motion.div>
      )}
    </div>
  );
};

export default AdminReports;