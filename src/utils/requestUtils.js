// =====================================================
// FILE: frontend/src/utils/requestUtils.js
// DESKRIPSI: Request utilities
// =====================================================

import { URGENCY, REQUEST_STATUS, URGENCY_LABELS, REQUEST_STATUS_LABELS } from './constants';

/**
 * Get urgency label
 */
export const getUrgencyLabel = (urgency) => {
  return URGENCY_LABELS[urgency] || urgency;
};

/**
 * Get urgency color
 */
export const getUrgencyColor = (urgency) => {
  const colors = {
    [URGENCY.BIASA]: 'blue',
    [URGENCY.URGENT]: 'yellow',
    [URGENCY.GAWAT_DARURAT]: 'red'
  };
  return colors[urgency] || 'gray';
};

/**
 * Get urgency badge class
 */
export const getUrgencyBadgeClass = (urgency) => {
  const color = getUrgencyColor(urgency);
  return `badge-${color}`;
};

/**
 * Get request status label
 */
export const getRequestStatusLabel = (status) => {
  return REQUEST_STATUS_LABELS[status] || status;
};

/**
 * Get request status color
 */
export const getRequestStatusColor = (status) => {
  const colors = {
    [REQUEST_STATUS.MENUNGGU]: 'yellow',
    [REQUEST_STATUS.DIPROSES]: 'blue',
    [REQUEST_STATUS.SELESAI]: 'green',
    [REQUEST_STATUS.DIBATALKAN]: 'red'
  };
  return colors[status] || 'gray';
};

/**
 * Get request status badge class
 */
export const getRequestStatusBadgeClass = (status) => {
  const color = getRequestStatusColor(status);
  return `badge-${color}`;
};

/**
 * Check if request is urgent
 */
export const isUrgent = (request) => {
  return request.urgency === URGENCY.URGENT;
};

/**
 * Check if request is emergency
 */
export const isEmergency = (request) => {
  return request.urgency === URGENCY.GAWAT_DARURAT;
};

/**
 * Check if request is pending
 */
export const isPending = (request) => {
  return request.request_status === REQUEST_STATUS.MENUNGGU;
};

/**
 * Check if request is processing
 */
export const isProcessing = (request) => {
  return request.request_status === REQUEST_STATUS.DIPROSES;
};

/**
 * Check if request is completed
 */
export const isCompleted = (request) => {
  return request.request_status === REQUEST_STATUS.SELESAI;
};

/**
 * Check if request is cancelled
 */
export const isCancelled = (request) => {
  return request.request_status === REQUEST_STATUS.DIBATALKAN;
};

/**
 * Get request progress percentage
 */
export const getRequestProgress = (request) => {
  if (isCompleted(request)) return 100;
  if (isCancelled(request)) return 0;
  
  const responses = request.total_responses || 0;
  const target = request.quantity || 1;
  
  // Simple progress based on responses (adjust as needed)
  return Math.min((responses / target) * 100, 100);
};

/**
 * Get time remaining for request
 */
export const getTimeRemaining = (request) => {
  if (!request.expiry_date) return null;
  
  const now = new Date();
  const expiry = new Date(request.expiry_date);
  const diff = expiry - now;
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} hari`;
  if (hours > 0) return `${hours} jam`;
  
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} menit`;
};

/**
 * Check if request is expiring soon
 */
export const isExpiringSoon = (request, hoursThreshold = 24) => {
  if (!request.expiry_date) return false;
  
  const now = new Date();
  const expiry = new Date(request.expiry_date);
  const diffHours = (expiry - now) / (1000 * 60 * 60);
  
  return diffHours > 0 && diffHours <= hoursThreshold;
};

/**
 * Get matching donors count
 */
export const getMatchingDonorsCount = (request, donors) => {
  return donors.filter(donor => 
    donor.blood_type === request.blood_type && 
    donor.is_verified
  ).length;
};

/**
 * Calculate response rate
 */
export const calculateResponseRate = (request) => {
  const total = request.total_responses || 0;
  const available = request.available_responses || 0;
  
  if (total === 0) return 0;
  return (available / total) * 100;
};

/**
 * Get priority score for sorting
 */
export const getPriorityScore = (request) => {
  const urgencyScores = {
    [URGENCY.GAWAT_DARURAT]: 100,
    [URGENCY.URGENT]: 50,
    [URGENCY.BIASA]: 0
  };
  
  const statusScores = {
    [REQUEST_STATUS.MENUNGGU]: 10,
    [REQUEST_STATUS.DIPROSES]: 5,
    [REQUEST_STATUS.SELESAI]: 0,
    [REQUEST_STATUS.DIBATALKAN]: -10
  };
  
  return (urgencyScores[request.urgency] || 0) + (statusScores[request.request_status] || 0);
};

/**
 * Sort requests by priority
 */
export const sortRequestsByPriority = (requests) => {
  return [...requests].sort((a, b) => {
    const scoreA = getPriorityScore(a);
    const scoreB = getPriorityScore(b);
    return scoreB - scoreA;
  });
};

/**
 * Filter requests by blood type
 */
export const filterRequestsByBloodType = (requests, bloodTypes) => {
  if (!bloodTypes || bloodTypes.length === 0) return requests;
  return requests.filter(r => bloodTypes.includes(r.blood_type));
};

/**
 * Filter requests by urgency
 */
export const filterRequestsByUrgency = (requests, urgencies) => {
  if (!urgencies || urgencies.length === 0) return requests;
  return requests.filter(r => urgencies.includes(r.urgency));
};

/**
 * Filter requests by status
 */
export const filterRequestsByStatus = (requests, statuses) => {
  if (!statuses || statuses.length === 0) return requests;
  return requests.filter(r => statuses.includes(r.request_status));
};

/**
 * Filter requests by location
 */
export const filterRequestsByLocation = (requests, location, radius = 10) => {
  if (!location || !location.lat || !location.lng) return requests;
  
  return requests.filter(r => {
    if (!r.current_location_lat || !r.current_location_lng) return false;
    
    const distance = calculateDistance(
      location.lat,
      location.lng,
      r.current_location_lat,
      r.current_location_lng
    );
    
    return distance <= radius;
  });
};

/**
 * Generate request code
 */
export const generateRequestCode = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `REQ-${year}${month}${day}-${random}`;
};

/**
 * Validate request data
 */
export const validateRequestData = (data) => {
  const errors = {};
  
  if (!data.blood_type) {
    errors.blood_type = 'Golongan darah wajib dipilih';
  }
  
  if (!data.quantity || data.quantity < 1) {
    errors.quantity = 'Jumlah kantong minimal 1';
  }
  
  if (data.quantity > 10) {
    errors.quantity = 'Jumlah kantong maksimal 10';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};