// =====================================================
// FILE: frontend/src/hooks/useSearch.js
// DESKRIPSI: Search hook
// =====================================================

import { useContext, useCallback } from 'react';
import { SearchContext } from '../contexts/SearchContext';

export const useSearch = () => {
  const context = useContext(SearchContext);
  
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  
  return context;
};

// Convenience hooks
export const useSearchQuery = () => {
  const { query, setQuery } = useSearch();
  return { query, setQuery };
};

export const useSearchType = () => {
  const { type, setType } = useSearch();
  return { type, setType };
};

export const useSearchResults = () => {
  const { results, totalResults, loading } = useSearch();
  return { results, totalResults, loading };
};

export const useRecentSearches = () => {
  const { recentSearches, removeRecentSearch, clearRecentSearches } = useSearch();
  return { recentSearches, removeRecentSearch, clearRecentSearches };
};

export const useSearchSuggestions = () => {
  const { suggestions } = useSearch();
  return suggestions;
};

export const useSearchFilters = () => {
  const { filters, applyFilters, resetFilters } = useSearch();
  return { filters, applyFilters, resetFilters };
};

export const useSearchPagination = () => {
  const { pagination, changePage } = useSearch();
  return { pagination, changePage };
};

export const useClearSearch = () => {
  const { clearSearch } = useSearch();
  return clearSearch;
};

// Specialized search hooks
export const useSearchHospitals = (initialQuery = '') => {
  const { setQuery, results } = useSearch();
  
  const search = useCallback((q) => {
    setQuery(q);
  }, [setQuery]);

  return {
    search,
    results: results.hospitals,
    loading: results.loading
  };
};

export const useSearchRequests = (initialQuery = '') => {
  const { setQuery, results } = useSearch();
  
  const search = useCallback((q) => {
    setQuery(q);
  }, [setQuery]);

  return {
    search,
    results: results.requests,
    loading: results.loading
  };
};

export const useSearchNews = (initialQuery = '') => {
  const { setQuery, results } = useSearch();
  
  const search = useCallback((q) => {
    setQuery(q);
  }, [setQuery]);

  return {
    search,
    results: results.news,
    loading: results.loading
  };
};

export const useSearchUsers = (initialQuery = '') => {
  const { setQuery, results } = useSearch();
  
  const search = useCallback((q) => {
    setQuery(q);
  }, [setQuery]);

  return {
    search,
    results: results.users,
    loading: results.loading
  };
};