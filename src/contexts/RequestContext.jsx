// =====================================================
// FILE: frontend/src/contexts/RequestContext.jsx
// DESKRIPSI: Request context provider
// =====================================================

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import requestService from '../services/request';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import toast from 'react-hot-toast';

// Create context
const RequestContext = createContext(null);

// Custom hook to use request context
export const useRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
};

// Provider component
export const RequestProvider = ({ children }) => {
  const { user } = useAuth();
  const { onDonorMatch, onEmergencyAlert } = useSocket();
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    blood_type: '',
    urgency: '',
    city: '',
    status: ''
  });

  // Load requests on mount and when filters/pagination change
  useEffect(() => {
    loadRequests();
  }, [filters, pagination.page]);

  // Load user's requests
  useEffect(() => {
    if (user) {
      loadMyRequests();
    }
  }, [user]);

  // Load emergency requests
  useEffect(() => {
    loadEmergencyRequests();
  }, []);

  // Setup socket listeners
  useEffect(() => {
    onDonorMatch(handleDonorMatch);
    onEmergencyAlert(handleEmergencyAlert);

    return () => {
      // Cleanup listeners if needed
    };
  }, []);

  // Load all requests
  const loadRequests = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      const response = await requestService.getAll(params);
      
      if (response.success) {
        setRequests(response.data);
        setPagination({
          ...pagination,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        });
      }
    } catch (error) {
      console.error('Load requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load user's requests
  const loadMyRequests = async () => {
    try {
      const response = await requestService.getByPatient(user.id);
      
      if (response.success) {
        setMyRequests(response.data);
      }
    } catch (error) {
      console.error('Load my requests error:', error);
    }
  };

  // Load emergency requests
  const loadEmergencyRequests = async () => {
    try {
      const response = await requestService.getEmergency();
      
      if (response.success) {
        setEmergencyRequests(response.data);
      }
    } catch (error) {
      console.error('Load emergency requests error:', error);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const response = await requestService.getStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  // Handle donor match
  const handleDonorMatch = (data) => {
    toast.success(`Pendonor tersedia untuk permintaan ${data.bloodType}`, {
      duration: 10000
    });
    loadRequests();
  };

  // Handle emergency alert
  const handleEmergencyAlert = (data) => {
    toast.error(`Permintaan darurat: ${data.bloodType} di ${data.location}`, {
      duration: 10000,
      icon: '🚨'
    });
    loadEmergencyRequests();
  };

  // Create new request
  const createRequest = async (requestData) => {
    try {
      const response = await requestService.create(requestData);
      
      if (response.success) {
        toast.success('Permintaan berhasil dibuat');
        loadRequests();
        loadMyRequests();
        loadEmergencyRequests();
        return { success: true, data: response.data };
      } else {
        toast.error(response.error || 'Gagal membuat permintaan');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      return { success: false, error: error.message };
    }
  };

  // Update request status
  const updateStatus = async (requestId, status, reason = '') => {
    try {
      const response = await requestService.updateStatus(requestId, status, reason);
      
      if (response.success) {
        toast.success('Status permintaan diperbarui');
        loadRequests();
        loadMyRequests();
        loadEmergencyRequests();
        return { success: true };
      } else {
        toast.error(response.error || 'Gagal memperbarui status');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      return { success: false, error: error.message };
    }
  };

  // Cancel request
  const cancelRequest = async (requestId, reason = '') => {
    try {
      const response = await requestService.cancel(requestId, reason);
      
      if (response.success) {
        toast.success('Permintaan dibatalkan');
        loadRequests();
        loadMyRequests();
        loadEmergencyRequests();
        return { success: true };
      } else {
        toast.error(response.error || 'Gagal membatalkan permintaan');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      return { success: false, error: error.message };
    }
  };

  // Respond to request (for donors)
  const respondToRequest = async (requestId, responseData) => {
    try {
      const response = await requestService.respond(requestId, responseData);
      
      if (response.success) {
        toast.success('Respon berhasil dikirim');
        loadRequests();
        return { success: true };
      } else {
        toast.error(response.error || 'Gagal mengirim respon');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      return { success: false, error: error.message };
    }
  };

  // Accept donor response
  const acceptResponse = async (requestId, responseId) => {
    try {
      const response = await requestService.acceptResponse(requestId, responseId);
      
      if (response.success) {
        toast.success('Pendonor dipilih');
        loadRequests();
        loadMyRequests();
        return { success: true };
      } else {
        toast.error(response.error || 'Gagal memilih pendonor');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      return { success: false, error: error.message };
    }
  };

  // Decline donor response
  const declineResponse = async (requestId, responseId, reason = '') => {
    try {
      const response = await requestService.declineResponse(requestId, responseId, reason);
      
      if (response.success) {
        toast.success('Respon ditolak');
        loadRequests();
        return { success: true };
      } else {
        toast.error(response.error || 'Gagal menolak respon');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      return { success: false, error: error.message };
    }
  };

  // Get request by ID
  const getRequestById = useCallback(async (requestId) => {
    try {
      const response = await requestService.getById(requestId);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get matching requests for donor
  const getMatchingRequests = useCallback(async (donorId, params = {}) => {
    try {
      const response = await requestService.getMatchingForDonor(donorId, params);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Get nearby requests
  const getNearbyRequests = useCallback(async (lat, lng, radius = 20, params = {}) => {
    try {
      const response = await requestService.getNearby(lat, lng, radius, params);
      
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
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      blood_type: '',
      urgency: '',
      city: '',
      status: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Change page
  const changePage = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    loadRequests();
    loadMyRequests();
    loadEmergencyRequests();
    loadStats();
  }, []);

  // Context value
  const value = {
    requests,
    myRequests,
    emergencyRequests,
    stats,
    loading,
    pagination,
    filters,
    createRequest,
    updateStatus,
    cancelRequest,
    respondToRequest,
    acceptResponse,
    declineResponse,
    getRequestById,
    getMatchingRequests,
    getNearbyRequests,
    applyFilters,
    resetFilters,
    changePage,
    refresh
  };

  return (
    <RequestContext.Provider value={value}>
      {children}
    </RequestContext.Provider>
  );
};