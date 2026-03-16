// =====================================================
// FILE: frontend/src/hooks/useGeolocation.js
// DESKRIPSI: Geolocation hook
// =====================================================

import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchId, setWatchId] = useState(null);

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false
  } = options;

  // Get current position
  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser ini');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (err) => {
        setError(getErrorMessage(err.code));
        setLoading(false);
      },
      { enableHighAccuracy, timeout, maximumAge }
    );
  }, [enableHighAccuracy, timeout, maximumAge]);

  // Start watching position
  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser ini');
      return null;
    }

    if (watchId !== null) {
      return watchId;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
        setError(null);
      },
      (err) => {
        setError(getErrorMessage(err.code));
      },
      { enableHighAccuracy, timeout, maximumAge }
    );

    setWatchId(id);
    return id;
  }, [enableHighAccuracy, timeout, maximumAge, watchId]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Get error message
  const getErrorMessage = (code) => {
    switch (code) {
      case 1:
        return 'Izin lokasi ditolak';
      case 2:
        return 'Tidak dapat mengambil lokasi';
      case 3:
        return 'Waktu permintaan lokasi habis';
      default:
        return 'Terjadi kesalahan saat mengambil lokasi';
    }
  };

  // Watch position on mount if enabled
  useEffect(() => {
    if (watch) {
      startWatching();
    }

    return () => {
      if (watchId !== null) {
        stopWatching();
      }
    };
  }, [watch, startWatching, stopWatching, watchId]);

  // Get address from coordinates (reverse geocoding)
  const getAddress = useCallback(async () => {
    if (!location) return null;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      return null;
    }
  }, [location]);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius bumi dalam km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  return {
    location,
    error,
    loading,
    watchId,
    getCurrentPosition,
    startWatching,
    stopWatching,
    getAddress,
    calculateDistance
  };
};

// Nearby locations hook
export const useNearbyLocations = (locations, radius = 10) => {
  const { location } = useGeolocation();
  const [nearby, setNearby] = useState([]);

  useEffect(() => {
    if (!location || !locations || locations.length === 0) return;

    const nearbyLocations = locations
      .map(loc => ({
        ...loc,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          loc.latitude,
          loc.longitude
        )
      }))
      .filter(loc => loc.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    setNearby(nearbyLocations);
  }, [location, locations, radius]);

  return nearby;
};

// Calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
};