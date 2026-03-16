// =====================================================
// FILE: frontend/src/hooks/useBloodStock.js
// DESKRIPSI: Blood stock hook
// =====================================================

import { useContext, useCallback } from 'react';
import { BloodStockContext } from '../contexts/BloodStockContext';

export const useBloodStock = () => {
  const context = useContext(BloodStockContext);
  
  if (!context) {
    throw new Error('useBloodStock must be used within a BloodStockProvider');
  }
  
  return context;
};

// Convenience hooks
export const useBloodStockList = () => {
  const { stocks, loading, lastUpdated } = useBloodStock();
  return { stocks, loading, lastUpdated };
};

export const useBloodStockSummary = () => {
  const { summary } = useBloodStock();
  return summary;
};

export const useCriticalStock = () => {
  const { criticalStock } = useBloodStock();
  return criticalStock;
};

export const useBloodStockFilters = () => {
  const { filters, applyFilters, resetFilters } = useBloodStock();
  return { filters, applyFilters, resetFilters };
};

export const useUpdateStock = () => {
  const { updateStock } = useBloodStock();
  return updateStock;
};

export const useTransferStock = () => {
  const { transferStock } = useBloodStock();
  return transferStock;
};

export const useBatchUpdate = () => {
  const { batchUpdate } = useBloodStock();
  return batchUpdate;
};

export const useStockByLocation = (locationId, isHospital = true) => {
  const { getStockByLocation } = useBloodStock();
  
  const fetchStock = useCallback(async () => {
    return await getStockByLocation(locationId, isHospital);
  }, [locationId, isHospital, getStockByLocation]);

  return fetchStock;
};

export const useStockByBloodType = (bloodType) => {
  const { getStockByBloodType } = useBloodStock();
  
  const fetchStock = useCallback(async () => {
    return await getStockByBloodType(bloodType);
  }, [bloodType, getStockByBloodType]);

  return fetchStock;
};

export const useStockForecast = (locationId, bloodType, days = 7) => {
  const { getForecast } = useBloodStock();
  
  const fetchForecast = useCallback(async () => {
    return await getForecast(locationId, bloodType, days);
  }, [locationId, bloodType, days, getForecast]);

  return fetchForecast;
};

export const useStockHistory = (stockId) => {
  const { getHistory } = useBloodStock();
  
  const fetchHistory = useCallback(async (params = {}) => {
    return await getHistory(stockId, params);
  }, [stockId, getHistory]);

  return fetchHistory;
};

export const useRefreshBloodStock = () => {
  const { refresh } = useBloodStock();
  return refresh;
};