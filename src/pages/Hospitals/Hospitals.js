/* eslint-disable */
// =====================================================
// FILE: frontend/src/pages/Hospitals/Hospitals.jsx
// DESKRIPSI: Hospitals list page
// =====================================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, FunnelIcon } from '@heroicons/react/24/outline';

import { Typography, Input, Button, Card, Spinner } from '../../components/atoms';
import { HospitalCard, SearchBar, Pagination } from '../../components/molecules';
import api from '../../services/api';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  });

  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);

  useEffect(() => {
    fetchHospitals();
    fetchFilters();
    getUserLocation();
  }, [pagination.page, searchTerm, selectedCity, selectedProvince]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        city: selectedCity || undefined,
        province: selectedProvince || undefined
      };

      const response = await api.get('/hospitals', { params });
      setHospitals(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      // Get unique cities and provinces from hospitals
      const response = await api.get('/hospitals');
      const allHospitals = response.data.data;
      
      const uniqueCities = [...new Set(allHospitals.map(h => h.city))].filter(Boolean);
      const uniqueProvinces = [...new Set(allHospitals.map(h => h.province))].filter(Boolean);
      
      setCities(uniqueCities);
      setProvinces(uniqueProvinces);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Fetch nearby hospitals
          try {
            const response = await api.get('/hospitals/nearby', {
              params: { lat: latitude, lng: longitude, radius: 10 }
            });
            setNearbyHospitals(response.data.data);
          } catch (error) {
            console.error('Error fetching nearby hospitals:', error);
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination({ ...pagination, page: 1 });
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'city') setSelectedCity(value);
    if (filterName === 'province') setSelectedProvince(value);
    setPagination({ ...pagination, page: 1 });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedProvince('');
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter options for SearchBar
  const filterOptions = [
    {
      name: 'city',
      label: 'Kota',
      type: 'select',
      options: cities.map(city => ({ value: city, label: city }))
    },
    {
      name: 'province',
      label: 'Provinsi',
      type: 'select',
      options: provinces.map(province => ({ value: province, label: province }))
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Typography variant="h4" className="mb-2">
          Rumah Sakit & PMI
        </Typography>
        <Typography variant="body2" color="secondary">
          Temukan rumah sakit dan UDD PMI terdekat untuk donor darah
        </Typography>
      </div>

      {/* Search and Filter */}
      <Card>
        <SearchBar
          placeholder="Cari rumah sakit berdasarkan nama atau alamat..."
          onSearch={handleSearch}
          onFilter={handleFilterChange}
          filters={filterOptions}
          showFilter
        />

        {/* Active Filters */}
        {(searchTerm || selectedCity || selectedProvince) && (
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
              {searchTerm && (
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  Pencarian: {searchTerm}
                </span>
              )}
              {selectedCity && (
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  Kota: {selectedCity}
                </span>
              )}
              {selectedProvince && (
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  Provinsi: {selectedProvince}
                </span>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Nearby Hospitals */}
      {userLocation && nearbyHospitals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center mb-4">
              <MapPinIcon className="w-5 h-5 text-primary-600 mr-2" />
              <Typography variant="h6">
                Rumah Sakit Terdekat (dalam 10 km)
              </Typography>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyHospitals.slice(0, 3).map((hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  showDistance
                  compact
                />
              ))}
            </div>
            {nearbyHospitals.length > 3 && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                >
                  Lihat semua ({nearbyHospitals.length})
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Hospitals List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {hospitals.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {hospitals.map((hospital, index) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <HospitalCard hospital={hospital} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="text-center py-12">
              <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" className="mb-2">
                Tidak ada rumah sakit ditemukan
              </Typography>
              <Typography variant="body2" color="secondary">
                Coba ubah kata kunci pencarian atau filter Anda
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
    </div>
  );
};

export default Hospitals;