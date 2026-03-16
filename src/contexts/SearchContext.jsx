// =====================================================
// FILE: frontend/src/contexts/SearchContext.jsx
// DESKRIPSI: Search context provider
// =====================================================

import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import hospitalService from '../services/hospital';
import requestService from '../services/request';
import newsService from '../services/news';
import userService from '../services/user';
import toast from 'react-hot-toast';

// Create context
const SearchContext = createContext(null);

// Custom hook to use search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// Provider component
export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all'); // all, hospitals, requests, news, users
  const [results, setResults] = useState({
    hospitals: [],
    requests: [],
    news: [],
    users: []
  });
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const debouncedQuery = useDebounce(query, 500);

  // Perform search when query changes
  React.useEffect(() => {
    if (debouncedQuery) {
      performSearch();
    } else {
      clearResults();
    }
  }, [debouncedQuery, type, filters, pagination.page]);

  // Perform search
  const performSearch = async () => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults({ hospitals: [], requests: [], news: [], users: [] });
      setTotalResults(0);
      return;
    }

    setLoading(true);
    try {
      const searchPromises = [];

      // Search hospitals
      if (type === 'all' || type === 'hospitals') {
        searchPromises.push(
          hospitalService.search(debouncedQuery, { page: pagination.page, limit: pagination.limit })
            .then(res => ({ type: 'hospitals', data: res.success ? res.data : [] }))
        );
      }

      // Search requests
      if (type === 'all' || type === 'requests') {
        searchPromises.push(
          requestService.getAll({ search: debouncedQuery, ...filters, page: pagination.page, limit: pagination.limit })
            .then(res => ({ type: 'requests', data: res.success ? res.data : [] }))
        );
      }

      // Search news
      if (type === 'all' || type === 'news') {
        searchPromises.push(
          newsService.search(debouncedQuery, { page: pagination.page, limit: pagination.limit })
            .then(res => ({ type: 'news', data: res.success ? res.data : [] }))
        );
      }

      // Search users
      if (type === 'all' || type === 'users') {
        searchPromises.push(
          userService.search(debouncedQuery, { page: pagination.page, limit: pagination.limit })
            .then(res => ({ type: 'users', data: res.success ? res.data : [] }))
        );
      }

      const searchResults = await Promise.all(searchPromises);

      const newResults = {
        hospitals: [],
        requests: [],
        news: [],
        users: []
      };

      let total = 0;

      searchResults.forEach(result => {
        if (result.data) {
          newResults[result.type] = result.data.data || result.data;
          total += result.data.data?.length || result.data.length || 0;
        }
      });

      setResults(newResults);
      setTotalResults(total);

      // Save to recent searches
      if (debouncedQuery && !recentSearches.includes(debouncedQuery)) {
        setRecentSearches(prev => [debouncedQuery, ...prev].slice(0, 10));
      }

      // Generate suggestions
      generateSuggestions(debouncedQuery, newResults);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Gagal melakukan pencarian');
    } finally {
      setLoading(false);
    }
  };

  // Generate suggestions based on results
  const generateSuggestions = (searchQuery, searchResults) => {
    const newSuggestions = [];

    // Add hospital names
    if (searchResults.hospitals?.length) {
      searchResults.hospitals.slice(0, 3).forEach(h => {
        newSuggestions.push({
          type: 'hospital',
          text: h.name,
          icon: '🏥'
        });
      });
    }

    // Add request blood types
    if (searchResults.requests?.length) {
      searchResults.requests.slice(0, 3).forEach(r => {
        newSuggestions.push({
          type: 'request',
          text: `Permintaan ${r.blood_type} di ${r.city}`,
          icon: '🩸'
        });
      });
    }

    // Add news titles
    if (searchResults.news?.length) {
      searchResults.news.slice(0, 3).forEach(n => {
        newSuggestions.push({
          type: 'news',
          text: n.title,
          icon: '📰'
        });
      });
    }

    setSuggestions(newSuggestions);
  };

  // Clear results
  const clearResults = () => {
    setResults({
      hospitals: [],
      requests: [],
      news: [],
      users: []
    });
    setTotalResults(0);
    setSuggestions([]);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setType('all');
    setFilters({});
    setPagination({ ...pagination, page: 1 });
    clearResults();
  };

  // Apply filters
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Change page
  const changePage = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  // Remove recent search
  const removeRecentSearch = useCallback((searchTerm) => {
    setRecentSearches(prev => prev.filter(s => s !== searchTerm));
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  // Context value
  const value = {
    query,
    setQuery,
    type,
    setType,
    results,
    loading,
    totalResults,
    recentSearches,
    suggestions,
    filters,
    pagination,
    clearSearch,
    applyFilters,
    resetFilters,
    changePage,
    removeRecentSearch,
    clearRecentSearches
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};