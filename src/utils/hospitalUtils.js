// =====================================================
// FILE: frontend/src/utils/hospitalUtils.js
// DESKRIPSI: Hospital utilities
// =====================================================

/**
 * Get hospital type label
 */
export const getHospitalTypeLabel = (type) => {
  const types = {
    'pusat': 'Rumah Sakit Pusat',
    'daerah': 'Rumah Sakit Daerah',
    'swasta': 'Rumah Sakit Swasta',
    'pmi': 'UDD PMI',
    'klinik': 'Klinik'
  };
  return types[type] || type;
};

/**
 * Get hospital facilities
 */
export const getHospitalFacilities = () => {
  return [
    'UGD',
    'Bank Darah',
    'ICU',
    'HCU',
    'Rawat Inap',
    'Rawat Jalan',
    'Farmasi',
    'Laboratorium',
    'Radiologi',
    'Kamar Bedah'
  ];
};

/**
 * Format hospital address
 */
export const formatHospitalAddress = (hospital) => {
  const parts = [];
  if (hospital.address) parts.push(hospital.address);
  if (hospital.city) parts.push(hospital.city);
  if (hospital.province) parts.push(hospital.province);
  if (hospital.postal_code) parts.push(hospital.postal_code);
  
  return parts.join(', ');
};

/**
 * Get hospital operating hours display
 */
export const formatOperatingHours = (hospital) => {
  if (!hospital.operating_hours) return '24 Jam';
  
  try {
    const hours = JSON.parse(hospital.operating_hours);
    if (hours.monday && hours.tuesday) {
      return `${hours.monday} - ${hours.friday}`;
    }
    return hospital.operating_hours;
  } catch {
    return hospital.operating_hours;
  }
};

/**
 * Check if hospital has emergency unit
 */
export const hasEmergencyUnit = (hospital) => {
  return hospital.has_emergency || 
         (hospital.facilities && hospital.facilities.includes('UGD'));
};

/**
 * Check if hospital has blood bank
 */
export const hasBloodBank = (hospital) => {
  return hospital.facilities && hospital.facilities.includes('Bank Darah');
};

/**
 * Get emergency phone number
 */
export const getEmergencyPhone = (hospital) => {
  return hospital.emergency_phone || hospital.phone;
};

/**
 * Get blood stock status for hospital
 */
export const getBloodStockStatus = (hospital, bloodType) => {
  if (!hospital.blood_stock) return null;
  
  const stock = hospital.blood_stock.find(s => s.blood_type === bloodType);
  if (!stock) return null;
  
  if (stock.quantity < 10) return 'kritis';
  if (stock.quantity < 20) return 'waspada';
  return 'aman';
};

/**
 * Get blood stock summary
 */
export const getBloodStockSummary = (hospital) => {
  if (!hospital.blood_stock) return null;
  
  const summary = {
    total: 0,
    byStatus: {
      kritis: 0,
      waspada: 0,
      aman: 0
    },
    byType: {}
  };
  
  hospital.blood_stock.forEach(stock => {
    summary.total += stock.quantity;
    summary.byType[stock.blood_type] = stock.quantity;
    
    if (stock.quantity < 10) summary.byStatus.kritis++;
    else if (stock.quantity < 20) summary.byStatus.waspada++;
    else summary.byStatus.aman++;
  });
  
  return summary;
};

/**
 * Get hospital rating average
 */
export const getHospitalRatingAverage = (hospital) => {
  if (!hospital.reviews || hospital.reviews.length === 0) return 0;
  
  const sum = hospital.reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / hospital.reviews.length;
};

/**
 * Get hospital rating distribution
 */
export const getHospitalRatingDistribution = (hospital) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  if (!hospital.reviews) return distribution;
  
  hospital.reviews.forEach(review => {
    distribution[review.rating] = (distribution[review.rating] || 0) + 1;
  });
  
  return distribution;
};

/**
 * Get nearest hospitals
 */
export const getNearestHospitals = (hospitals, lat, lng, limit = 5) => {
  const withDistance = hospitals.map(h => ({
    ...h,
    distance: calculateDistance(lat, lng, h.latitude, h.longitude)
  }));
  
  return withDistance
    .filter(h => h.distance !== null)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
};

/**
 * Filter hospitals by facilities
 */
export const filterHospitalsByFacilities = (hospitals, facilities) => {
  if (!facilities || facilities.length === 0) return hospitals;
  
  return hospitals.filter(hospital => {
    return facilities.every(f => hospital.facilities?.includes(f));
  });
};

/**
 * Filter hospitals by blood type availability
 */
export const filterHospitalsByBloodType = (hospitals, bloodType) => {
  return hospitals.filter(hospital => {
    return hospital.blood_stock?.some(s => s.blood_type === bloodType);
  });
};

/**
 * Search hospitals by name or address
 */
export const searchHospitals = (hospitals, query) => {
  if (!query) return hospitals;
  
  const searchTerm = query.toLowerCase();
  return hospitals.filter(hospital => {
    return hospital.name.toLowerCase().includes(searchTerm) ||
           hospital.address.toLowerCase().includes(searchTerm) ||
           hospital.city.toLowerCase().includes(searchTerm);
  });
};

/**
 * Validate hospital data
 */
export const validateHospitalData = (data) => {
  const errors = {};
  
  if (!data.name) {
    errors.name = 'Nama rumah sakit wajib diisi';
  }
  
  if (!data.address) {
    errors.address = 'Alamat wajib diisi';
  }
  
  if (!data.city) {
    errors.city = 'Kota wajib diisi';
  }
  
  if (!data.province) {
    errors.province = 'Provinsi wajib diisi';
  }
  
  if (data.latitude && (data.latitude < -90 || data.latitude > 90)) {
    errors.latitude = 'Latitude harus antara -90 dan 90';
  }
  
  if (data.longitude && (data.longitude < -180 || data.longitude > 180)) {
    errors.longitude = 'Longitude harus antara -180 dan 180';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};