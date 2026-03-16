// =====================================================
// FILE: frontend/src/contexts/FilterContext.jsx
// DESKRIPSI: Filter context provider
// =====================================================

import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// Create context
const FilterContext = createContext(null);

// Custom hook to use filter context
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

// Provider component
export const FilterProvider = ({ children, storageKey = 'filters' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    // Load from URL params first
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      urlFilters[key] = value;
    }

    // If no URL params, load from localStorage
    if (Object.keys(urlFilters).length === 0) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Failed to parse saved filters:', error);
        }
      }
    }

    return urlFilters;
  });

  const [activeFilters, setActiveFilters] = useState([]);
  const [filterDefinitions, setFilterDefinitions] = useState({});

  // Update URL and localStorage when filters change
  React.useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value);
      }
    });
    setSearchParams(params);

    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(filters));

    // Update active filters
    const active = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => ({
        key,
        value,
        label: filterDefinitions[key]?.label || key,
        displayValue: getDisplayValue(key, value)
      }));
    setActiveFilters(active);
  }, [filters, filterDefinitions]);

  // Get display value for filter
  const getDisplayValue = (key, value) => {
    const definition = filterDefinitions[key];
    
    if (definition?.options) {
      const option = definition.options.find(opt => opt.value === value);
      return option?.label || value;
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (typeof value === 'object' && value.min !== undefined) {
      return `${value.min} - ${value.max || '∞'}`;
    }
    
    return value;
  };

  // Set filter
  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Set multiple filters
  const setFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Remove filter
  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Reset to specific filters
  const resetTo = useCallback((newFilters = {}) => {
    setFilters(newFilters);
  }, []);

  // Register filter definition
  const registerFilter = useCallback((key, definition) => {
    setFilterDefinitions(prev => ({
      ...prev,
      [key]: definition
    }));
  }, []);

  // Unregister filter
  const unregisterFilter = useCallback((key) => {
    setFilterDefinitions(prev => {
      const newDefinitions = { ...prev };
      delete newDefinitions[key];
      return newDefinitions;
    });
  }, []);

  // Check if filter is active
  const isFilterActive = useCallback((key) => {
    const value = filters[key];
    return value !== undefined && value !== null && value !== '';
  }, [filters]);

  // Get filter value
  const getFilter = useCallback((key, defaultValue = null) => {
    return filters[key] !== undefined ? filters[key] : defaultValue;
  }, [filters]);

  // Get all filters
  const getAllFilters = useCallback(() => {
    return { ...filters };
  }, [filters]);

  // Get active filters count
  const getActiveCount = useCallback(() => {
    return activeFilters.length;
  }, [activeFilters]);

  // Merge with default filters
  const mergeWithDefaults = useCallback((defaultFilters) => {
    setFilters(prev => ({
      ...defaultFilters,
      ...prev
    }));
  }, []);

  // Apply preset
  const applyPreset = useCallback((preset) => {
    setFilters(preset.filters);
  }, []);

  // Save as preset
  const saveAsPreset = useCallback((name) => {
    const preset = {
      name,
      filters,
      createdAt: new Date().toISOString()
    };
    
    const savedPresets = JSON.parse(localStorage.getItem('filter_presets') || '[]');
    savedPresets.push(preset);
    localStorage.setItem('filter_presets', JSON.stringify(savedPresets));
    
    return preset;
  }, [filters]);

  // Get presets
  const getPresets = useCallback(() => {
    return JSON.parse(localStorage.getItem('filter_presets') || '[]');
  }, []);

  // Delete preset
  const deletePreset = useCallback((presetName) => {
    const presets = JSON.parse(localStorage.getItem('filter_presets') || '[]');
    const filtered = presets.filter(p => p.name !== presetName);
    localStorage.setItem('filter_presets', JSON.stringify(filtered));
  }, []);

  // Context value
  const value = {
    filters,
    activeFilters,
    filterDefinitions,
    setFilter,
    setFilters,
    removeFilter,
    clearFilters,
    resetTo,
    registerFilter,
    unregisterFilter,
    isFilterActive,
    getFilter,
    getAllFilters,
    getActiveCount,
    mergeWithDefaults,
    applyPreset,
    saveAsPreset,
    getPresets,
    deletePreset
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};