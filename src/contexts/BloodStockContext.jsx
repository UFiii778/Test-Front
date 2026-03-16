// =====================================================
// FILE: frontend/src/contexts/BloodStockContext.jsx
// DESKRIPSI: Blood stock context provider
// =====================================================

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import bloodStockService from '../services/bloodStock';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Create context
const BloodStockContext = createContext(null);

// Custom hook to use blood stock context
export const useBloodStock = () => {
  const context = useContext(BloodStockContext);
  if (!context) {
    throw new Error('useBloodStock must be used within a BloodStockProvider');
  }
  return context;
};

// Provider component
export const BloodStockProvider = ({ children }) => {
  const { user, hasRole } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [criticalStock, setCriticalStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    province: '',
    city: '',
    blood_type: '',
    status: ''
  });

  // Load initial data
  useEffect(() => {
    loadStocks();
    loadSummary();
    
    // Auto refresh every 5 minutes
    const interval = setInterval(() => {
      loadStocks();
      loadSummary();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [filters]);

  // Load stocks
  const loadStocks = async () => {
    setLoading(true);
    try {
      const response = await bloodStockService.getAll(filters);
      
      if (response.success) {
        setStocks(response.data);
        setLastUpdated(new Date());
        
        // Check for critical stock
        const critical = response.data.filter(location =>
          location.stocks.some(s => s.quantity < 10)
        );
        setCriticalStock(critical);
      }
    } catch (error) {
      console.error('Load stocks error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load summary
  const loadSummary = async () => {
    try {
      const response = await bloodStockService.getSummary();
      
      if (response.success) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Load summary error:', error);
    }
  };

  // Update stock (PMI/Admin only)
  const updateStock = async (stockId, quantity, notes = '') => {
    if (!hasRole('pmi') && !hasRole('admin')) {
      toast.error('Anda tidak memiliki izin untuk mengupdate stok');
      return { success: false };
    }

    try {
      const response = await bloodStockService.update(stockId, quantity, notes);
      
      if (response.success) {
        toast.success('Stok berhasil diperbarui');
        loadStocks();
        loadSummary();
        return { success: true };
      } else {
        toast.error(response.error || 'Gagal memperbarui stok');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      return { success: false, error: error.message };
    }
  };

  // Transfer stock (PMI/Admin only)
  const transferStock = async (transferData) => {
    if (!hasRole('pmi') && !hasRole('admin')) {
      toast.error('Anda tidak memiliki izin untuk transfer stok');
      return { success: false };
    }

    try {
      const response = await bloodStockService.transfer(transferData);
      
      if (response.success) {
        toast.success('Transfer stok berhasil');
        loadStocks();
        loadSummary();
        return { success: true };
      } else {
        toast.error(response.error || 'Gagal transfer stok');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      return { success: false, error: error.message };
    }
  };

  // Batch update (PMI/Admin only)
  const batchUpdate = async (updates) => {
    if (!hasRole('pmi') && !hasRole('admin')) {
      toast.error('Anda tidak memiliki izin untuk batch update');
      return { success: false };
    }

    try {
      const response = await bloodStockService.batchUpdate(updates);
      
      if (response.success) {
        toast.success(`${response.data.results.length} stok berhasil diperbarui`);
        loadStocks();
        loadSummary();
        return { success: true, data: response.data };
      } else {
        toast.error(response.error || 'Gagal batch update');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      return { success: false, error: error.message };
    }
  };

  // Get stock by location
  const getStockByLocation = useCallback(async (locationId, isHospital = true) => {
    try {
      const response = await bloodStockService.getByLocation(locationId, isHospital);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get stock by blood type
  const getStockByBloodType = useCallback(async (bloodType) => {
    try {
      const response = await bloodStockService.getByBloodType(bloodType);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get forecast
  const getForecast = useCallback(async (locationId, bloodType, days = 7) => {
    try {
      const response = await bloodStockService.getForecast(locationId, bloodType, days);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get history
  const getHistory = useCallback(async (stockId, params = {}) => {
    try {
      const response = await bloodStockService.getHistory(stockId, params);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      province: '',
      city: '',
      blood_type: '',
      status: ''
    });
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    loadStocks();
    loadSummary();
  }, []);

  // Context value
  const value = {
    stocks,
    summary,
    criticalStock,
    loading,
    lastUpdated,
    filters,
    updateStock,
    transferStock,
    batchUpdate,
    getStockByLocation,
    getStockByBloodType,
    getForecast,
    getHistory,
    applyFilters,
    resetFilters,
    refresh
  };

  return (
    <BloodStockContext.Provider value={value}>
      {children}
    </BloodStockContext.Provider>
  );
};