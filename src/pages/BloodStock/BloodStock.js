/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/BloodStock/BloodStock.jsx
// DESKRIPSI: Blood stock page
// =====================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BeakerIcon, 
  MapPinIcon, 
  FunnelIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import { Typography, Card, Button, Spinner, Badge, Input } from '../../components/atoms';
import { SearchBar } from '../../components/molecules';
import api from '../../services/api';

const BloodStock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [summary, setSummary] = useState({});
  const [cities, setCities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  useEffect(() => {
    fetchBloodStock();
    fetchSummary();
  }, [selectedCity, selectedBloodType]);

  const fetchBloodStock = async () => {
    setLoading(true);
    try {
      const params = {
        city: selectedCity || undefined,
        blood_type: selectedBloodType || undefined
      };
      const response = await api.get('/blood-stock', { params });
      setStocks(response.data.data);
      setLastUpdated(new Date());
      
      // Extract unique cities
      const uniqueCities = [...new Set(response.data.data.map(s => s.city))].filter(Boolean);
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error fetching blood stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get('/blood-stock/summary');
      setSummary(response.data.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const getStatusColor = (quantity) => {
    if (quantity < 10) return 'danger';
    if (quantity < 20) return 'warning';
    return 'success';
  };

  const getStatusText = (quantity) => {
    if (quantity < 10) return 'Kritis';
    if (quantity < 20) return 'Waspada';
    return 'Aman';
  };

  const handleRefresh = () => {
    fetchBloodStock();
    fetchSummary();
  };

  const handleSearch = (term) => {
    // Implement search logic
  };

  const handleFilter = (filters) => {
    if (filters.city) setSelectedCity(filters.city);
    if (filters.blood_type) setSelectedBloodType(filters.blood_type);
  };

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedBloodType('');
  };

  const filterOptions = [
    {
      name: 'city',
      label: 'Kota',
      type: 'select',
      options: cities.map(city => ({ value: city, label: city }))
    },
    {
      name: 'blood_type',
      label: 'Golongan Darah',
      type: 'select',
      options: bloodTypes.map(type => ({ value: type, label: type }))
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h4" className="mb-2">
            Stok Darah
          </Typography>
          <Typography variant="body2" color="secondary">
            Informasi stok darah terkini di rumah sakit dan UDD PMI
          </Typography>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
        >
          <ArrowPathIcon className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Perbarui
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center p-4">
            <Typography variant="h3" color="primary" className="mb-1">
              {summary.total_stock || 0}
            </Typography>
            <Typography variant="caption" color="secondary">
              Total Stok
            </Typography>
          </Card>
          
          {summary.by_blood_type && Object.entries(summary.by_blood_type).map(([type, qty]) => (
            <Card key={type} className="text-center p-4">
              <Typography variant="h5" weight="bold" className="mb-1">
                {type}
              </Typography>
              <Typography variant="h4" className="mb-1">
                {qty}
              </Typography>
              <Badge variant={getStatusColor(qty)}>
                {getStatusText(qty)}
              </Badge>
            </Card>
          ))}
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <SearchBar
          placeholder="Cari berdasarkan kota atau provinsi..."
          onSearch={handleSearch}
          onFilter={handleFilter}
          filters={filterOptions}
          showFilter
        />

        {/* Active Filters */}
        {(selectedCity || selectedBloodType) && (
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
              {selectedCity && (
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  Kota: {selectedCity}
                </span>
              )}
              {selectedBloodType && (
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  Gol. Darah: {selectedBloodType}
                </span>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Critical Stock Alert */}
      {summary.critical_count > 0 && (
        <Card variant="danger" className="border-red-200">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
            <div>
              <Typography variant="body2" weight="bold" className="text-red-800 mb-1">
                Stok Kritis Terdeteksi
              </Typography>
              <Typography variant="caption" className="text-red-700">
                Terdapat {summary.critical_count} lokasi dengan stok darah dalam kondisi kritis.
                Segera lakukan donor darah jika memungkinkan.
              </Typography>
            </div>
          </div>
        </Card>
      )}

      {/* Blood Stock List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {stocks.length > 0 ? (
            <div className="space-y-6">
              {stocks.map((location, index) => (
                <motion.div
                  key={`${location.location_id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Typography variant="h6" className="mb-1">
                          {location.location_name}
                        </Typography>
                        <div className="flex items-center text-gray-600">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          <Typography variant="caption">
                            {location.city}, {location.province}
                          </Typography>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {location.location_type === 'hospital' ? 'Rumah Sakit' : 'PMI'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {location.stocks.map((stock) => (
                        <div key={stock.id} className="text-center p-3 bg-gray-50 rounded-lg">
                          <Typography variant="h6" weight="bold" className="mb-1">
                            {stock.blood_type}
                          </Typography>
                          <Typography variant="h5" className="mb-2">
                            {stock.quantity}
                          </Typography>
                          <Badge variant={getStatusColor(stock.quantity)}>
                            {getStatusText(stock.quantity)}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-right">
                      <Typography variant="caption" color="secondary">
                        Terakhir diperbarui: {new Date(location.last_updated).toLocaleString('id-ID')}
                      </Typography>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <BeakerIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" className="mb-2">
                Tidak ada data stok darah
              </Typography>
              <Typography variant="body2" color="secondary">
                Coba ubah filter atau periksa kembali nanti
              </Typography>
            </Card>
          )}
        </>
      )}

      {/* Legend */}
      <Card className="p-4">
        <Typography variant="body2" weight="bold" className="mb-3">
          Keterangan Status
        </Typography>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded-full mr-2" />
            <Typography variant="caption">Aman (&gt;20 kantong)</Typography>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2" />
            <Typography variant="caption">Waspada (10-20 kantong)</Typography>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2" />
            <Typography variant="caption">Kritis (&lt;10 kantong)</Typography>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          {lastUpdated && `Data terakhir diperbarui: ${lastUpdated.toLocaleString('id-ID')}`}
        </div>
      </Card>
    </div>
  );
};

export default BloodStock;