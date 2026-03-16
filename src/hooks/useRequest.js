// =====================================================
// FILE: frontend/src/hooks/useRequest.js
// DESKRIPSI: Request hook
// =====================================================

import { useContext, useCallback } from 'react';
import { RequestContext } from '../contexts/RequestContext';

export const useRequest = () => {
  const context = useContext(RequestContext);
  
  if (!context) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  
  return context;
};

// Convenience hooks
export const useRequests = () => {
  const { requests, loading, pagination } = useRequest();
  return { requests, loading, pagination };
};

export const useMyRequests = () => {
  const { myRequests } = useRequest();
  return myRequests;
};

export const useEmergencyRequests = () => {
  const { emergencyRequests } = useRequest();
  return emergencyRequests;
};

export const useRequestStats = () => {
  const { stats } = useRequest();
  return stats;
};

export const useRequestFilters = () => {
  const { filters, applyFilters, resetFilters } = useRequest();
  return { filters, applyFilters, resetFilters };
};

export const useCreateRequest = () => {
  const { createRequest } = useRequest();
  return createRequest;
};

export const useUpdateRequestStatus = () => {
  const { updateStatus } = useRequest();
  return updateStatus;
};

export const useCancelRequest = () => {
  const { cancelRequest } = useRequest();
  return cancelRequest;
};

export const useRespondToRequest = () => {
  const { respondToRequest } = useRequest();
  return respondToRequest;
};

export const useAcceptResponse = () => {
  const { acceptResponse } = useRequest();
  return acceptResponse;
};

export const useDeclineResponse = () => {
  const { declineResponse } = useRequest();
  return declineResponse;
};

export const useRequestById = (requestId) => {
  const { getRequestById } = useRequest();
  
  const fetchRequest = useCallback(async () => {
    return await getRequestById(requestId);
  }, [requestId, getRequestById]);

  return fetchRequest;
};

export const useMatchingRequests = (donorId) => {
  const { getMatchingRequests } = useRequest();
  
  const fetchRequests = useCallback(async (params = {}) => {
    return await getMatchingRequests(donorId, params);
  }, [donorId, getMatchingRequests]);

  return fetchRequests;
};

export const useNearbyRequests = (lat, lng, radius = 20) => {
  const { getNearbyRequests } = useRequest();
  
  const fetchRequests = useCallback(async (params = {}) => {
    return await getNearbyRequests(lat, lng, radius, params);
  }, [lat, lng, radius, getNearbyRequests]);

  return fetchRequests;
};

export const useChangePage = () => {
  const { changePage } = useRequest();
  return changePage;
};

export const useRefreshRequests = () => {
  const { refresh } = useRequest();
  return refresh;
};