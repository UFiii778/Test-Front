// =====================================================
// FILE: frontend/src/utils/locationUtils.js
// DESKRIPSI: Location utilities
// =====================================================

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

/**
 * Convert degrees to radians
 */
export const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert radians to degrees
 */
export const toDeg = (radians) => {
  return radians * (180 / Math.PI);
};

/**
 * Calculate bounding box for given radius
 */
export const getBoundingBox = (lat, lng, radiusKm) => {
  const latRad = toRad(lat);
  const lngRad = toRad(lng);
  const radiusRad = radiusKm / 6371;

  const minLat = latRad - radiusRad;
  const maxLat = latRad + radiusRad;
  
  let minLng = lngRad - Math.asin(Math.sin(radiusRad) / Math.cos(latRad));
  let maxLng = lngRad + Math.asin(Math.sin(radiusRad) / Math.cos(latRad));
  
  // Normalize longitudes
  if (minLng < -Math.PI) minLng += 2 * Math.PI;
  if (maxLng > Math.PI) maxLng -= 2 * Math.PI;

  return {
    minLat: toDeg(minLat),
    maxLat: toDeg(maxLat),
    minLng: toDeg(minLng),
    maxLng: toDeg(maxLng)
  };
};

/**
 * Check if point is within radius
 */
export const isWithinRadius = (centerLat, centerLng, pointLat, pointLng, radiusKm) => {
  const distance = calculateDistance(centerLat, centerLng, pointLat, pointLng);
  return distance !== null && distance <= radiusKm;
};

/**
 * Get center point of multiple coordinates
 */
export const getCenterPoint = (coordinates) => {
  if (!coordinates || coordinates.length === 0) return null;
  
  let latSum = 0;
  let lngSum = 0;
  
  coordinates.forEach(coord => {
    latSum += coord.lat;
    lngSum += coord.lng;
  });
  
  return {
    lat: latSum / coordinates.length,
    lng: lngSum / coordinates.length
  };
};

/**
 * Calculate approximate travel time (assuming 60 km/h average speed)
 */
export const estimateTravelTime = (distanceKm, averageSpeedKmH = 60) => {
  if (!distanceKm) return null;
  
  const hours = distanceKm / averageSpeedKmH;
  const minutes = Math.round(hours * 60);
  
  return {
    hours: Math.floor(hours),
    minutes: minutes % 60,
    totalMinutes: minutes
  };
};

/**
 * Format distance with unit
 */
export const formatDistance = (km) => {
  if (km === null || km === undefined) return '-';
  
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  
  return `${km.toFixed(1)} km`;
};

/**
 * Format travel time
 */
export const formatTravelTime = (minutes) => {
  if (!minutes) return '-';
  
  if (minutes < 60) {
    return `${minutes} menit`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} jam`;
  }
  
  return `${hours} jam ${mins} menit`;
};

/**
 * Get province from coordinates (mock - replace with actual reverse geocoding)
 */
export const getProvinceFromCoordinates = (lat, lng) => {
  // This would typically call a reverse geocoding service
  // For now, return mock data based on rough coordinates
  if (lat > -5 && lat < -6 && lng > 105 && lng < 107) return 'Banten';
  if (lat > -6 && lat < -7 && lng > 106 && lng < 108) return 'DKI Jakarta';
  if (lat > -6 && lat < -7 && lng > 107 && lng < 109) return 'Jawa Barat';
  if (lat > -7 && lat < -8 && lng > 108 && lng < 110) return 'Jawa Tengah';
  if (lat > -7 && lat < -9 && lng > 110 && lng < 115) return 'Jawa Timur';
  
  return 'Unknown';
};

/**
 * Get city from coordinates (mock)
 */
export const getCityFromCoordinates = (lat, lng) => {
  // Mock implementation
  if (Math.abs(lat + 6.2088) < 0.1 && Math.abs(lng - 106.8456) < 0.1) return 'Jakarta Pusat';
  if (Math.abs(lat + 6.9175) < 0.1 && Math.abs(lng - 107.6191) < 0.1) return 'Bandung';
  if (Math.abs(lat + 7.2575) < 0.1 && Math.abs(lng - 112.7521) < 0.1) return 'Surabaya';
  
  return 'Unknown';
};

/**
 * Get Indonesian provinces list
 */
export const getIndonesianProvinces = () => {
  return [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Kepulauan Riau',
    'Jambi',
    'Bengkulu',
    'Sumatera Selatan',
    'Bangka Belitung',
    'Lampung',
    'Banten',
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Gorontalo',
    'Sulawesi Tengah',
    'Sulawesi Barat',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Maluku',
    'Maluku Utara',
    'Papua Barat',
    'Papua',
    'Papua Pegunungan',
    'Papua Selatan',
    'Papua Tengah'
  ];
};

/**
 * Get cities by province (mock)
 */
export const getCitiesByProvince = (province) => {
  const cityMap = {
    'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Kepulauan Seribu'],
    'Jawa Barat': ['Bandung', 'Bekasi', 'Bogor', 'Depok', 'Cirebon', 'Sukabumi', 'Tasikmalaya'],
    'Jawa Tengah': ['Semarang', 'Solo', 'Magelang', 'Pekalongan', 'Tegal', 'Salatiga'],
    'Jawa Timur': ['Surabaya', 'Malang', 'Sidoarjo', 'Kediri', 'Madiun', 'Blitar'],
    'Banten': ['Serang', 'Tangerang', 'Cilegon', 'Tangerang Selatan']
  };
  
  return cityMap[province] || [];
};

/**
 * Get coordinates for location (mock - replace with geocoding service)
 */
export const getCoordinatesForLocation = async (address) => {
  // This would call a geocoding service like Google Maps API
  // For now, return mock coordinates
  return {
    lat: -6.2088,
    lng: 106.8456
  };
};

/**
 * Get address from coordinates (reverse geocoding)
 */
export const getAddressFromCoordinates = async (lat, lng) => {
  // This would call a reverse geocoding service
  // For now, return mock address
  return `${getCityFromCoordinates(lat, lng)}, ${getProvinceFromCoordinates(lat, lng)}`;
};

/**
 * Sort locations by distance
 */
export const sortByDistance = (locations, referenceLat, referenceLng) => {
  return locations
    .map(location => ({
      ...location,
      distance: calculateDistance(
        referenceLat,
        referenceLng,
        location.latitude || location.lat,
        location.longitude || location.lng
      )
    }))
    .filter(item => item.distance !== null)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Filter locations within radius
 */
export const filterByRadius = (locations, centerLat, centerLng, radiusKm) => {
  return locations.filter(location => {
    const distance = calculateDistance(
      centerLat,
      centerLng,
      location.latitude || location.lat,
      location.longitude || location.lng
    );
    return distance !== null && distance <= radiusKm;
  });
};

/**
 * Get current position from browser
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Watch position changes
 */
export const watchPosition = (onSuccess, onError, options = {}) => {
  if (!navigator.geolocation) {
    onError?.(new Error('Geolocation is not supported'));
    return null;
  }

  return navigator.geolocation.watchPosition(
    onSuccess,
    onError,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options
    }
  );
};

/**
 * Clear watch
 */
export const clearWatch = (watchId) => {
  if (watchId && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};