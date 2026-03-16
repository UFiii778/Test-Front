// =====================================================
// FILE: frontend/src/hooks/useFilter.js
// DESKRIPSI: Filter hook
// =====================================================

import { useContext, useCallback } from 'react';
import { FilterContext } from '../contexts/FilterContext';

export const useFilter = () => {
  const context = useContext(FilterContext);
  
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  
  return context;
};

// Convenience hooks
export const useFilters = () => {
  const { filters, setFilters } = useFilter();
  return { filters, setFilters };
};

export const useActiveFilters = () => {
  const { activeFilters } = useFilter();
  return activeFilters;
};

export const useFilterDefinitions = () => {
  const { filterDefinitions, registerFilter, unregisterFilter } = useFilter();
  return { filterDefinitions, registerFilter, unregisterFilter };
};

export const useFilterValue = (key, defaultValue = null) => {
  const { getFilter, setFilter } = useFilter();
  
  const value = getFilter(key, defaultValue);
  
  const setValue = useCallback((newValue) => {
    setFilter(key, newValue);
  }, [key, setFilter]);

  return [value, setValue];
};

export const useIsFilterActive = (key) => {
  const { isFilterActive } = useFilter();
  return isFilterActive(key);
};

export const useRemoveFilter = () => {
  const { removeFilter } = useFilter();
  return removeFilter;
};

export const useClearFilters = () => {
  const { clearFilters } = useFilter();
  return clearFilters;
};

export const useResetToFilters = () => {
  const { resetTo } = useFilter();
  return resetTo;
};

export const useActiveFilterCount = () => {
  const { getActiveCount } = useFilter();
  return getActiveCount();
};

export const useMergeWithDefaults = () => {
  const { mergeWithDefaults } = useFilter();
  return mergeWithDefaults;
};

// Filter presets
export const useFilterPresets = () => {
  const { applyPreset, saveAsPreset, getPresets, deletePreset } = useFilter();
  
  const presets = getPresets();
  
  const savePreset = useCallback((name) => {
    return saveAsPreset(name);
  }, [saveAsPreset]);

  const applyPresetByName = useCallback((preset) => {
    applyPreset(preset);
  }, [applyPreset]);

  const deletePresetByName = useCallback((presetName) => {
    deletePreset(presetName);
  }, [deletePreset]);

  return {
    presets,
    savePreset,
    applyPreset: applyPresetByName,
    deletePreset: deletePresetByName
  };
};

// Specialized filter hooks
export const useTextFilter = (key, defaultValue = '') => {
  const [value, setValue] = useFilterValue(key, defaultValue);
  
  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, [setValue]);

  return {
    value,
    setValue,
    onChange,
    isActive: !!value
  };
};

export const useSelectFilter = (key, defaultValue = '') => {
  const [value, setValue] = useFilterValue(key, defaultValue);
  
  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, [setValue]);

  return {
    value,
    setValue,
    onChange,
    isActive: !!value
  };
};

export const useMultiSelectFilter = (key, defaultValue = []) => {
  const [value, setValue] = useFilterValue(key, defaultValue);

  const toggle = useCallback((item) => {
    setValue(prev => {
      const newValue = [...(prev || [])];
      const index = newValue.indexOf(item);
      
      if (index === -1) {
        newValue.push(item);
      } else {
        newValue.splice(index, 1);
      }
      
      return newValue;
    });
  }, [setValue]);

  const includes = useCallback((item) => {
    return (value || []).includes(item);
  }, [value]);

  return {
    value: value || [],
    setValue,
    toggle,
    includes,
    isActive: (value || []).length > 0
  };
};

export const useRangeFilter = (key, min = 0, max = 100) => {
  const [value, setValue] = useFilterValue(key, { min, max });

  const setMin = useCallback((newMin) => {
    setValue(prev => ({ ...prev, min: newMin }));
  }, [setValue]);

  const setMax = useCallback((newMax) => {
    setValue(prev => ({ ...prev, max: newMax }));
  }, [setValue]);

  return {
    value,
    setValue,
    setMin,
    setMax,
    isActive: value.min !== min || value.max !== max
  };
};

export const useDateRangeFilter = (key) => {
  const [value, setValue] = useFilterValue(key, {});

  const setStartDate = useCallback((date) => {
    setValue(prev => ({ ...prev, startDate: date }));
  }, [setValue]);

  const setEndDate = useCallback((date) => {
    setValue(prev => ({ ...prev, endDate: date }));
  }, [setValue]);

  return {
    value,
    setValue,
    setStartDate,
    setEndDate,
    isActive: !!(value.startDate || value.endDate)
  };
};

export const useBooleanFilter = (key, defaultValue = false) => {
  const [value, setValue] = useFilterValue(key, defaultValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, [setValue]);

  return {
    value,
    setValue,
    toggle,
    isActive: value !== defaultValue
  };
};