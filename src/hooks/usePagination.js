// =====================================================
// FILE: frontend/src/hooks/usePagination.js
// DESKRIPSI: Pagination hook
// =====================================================

import { useState, useCallback, useMemo } from 'react';

export const usePagination = (initialState = {}) => {
  const [page, setPage] = useState(initialState.page || 1);
  const [limit, setLimit] = useState(initialState.limit || 10);
  const [total, setTotal] = useState(initialState.total || 0);
  const [totalPages, setTotalPages] = useState(initialState.totalPages || 0);

  const updateTotal = useCallback((newTotal) => {
    setTotal(newTotal);
    setTotalPages(Math.ceil(newTotal / limit));
  }, [limit]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
    setTotalPages(Math.ceil(total / newLimit));
  }, [total]);

  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const from = useMemo(() => (page - 1) * limit + 1, [page, limit]);
  const to = useMemo(() => Math.min(page * limit, total), [page, limit, total]);

  const paginationInfo = useMemo(() => ({
    page,
    limit,
    total,
    totalPages,
    from,
    to,
    hasNext,
    hasPrev
  }), [page, limit, total, totalPages, from, to, hasNext, hasPrev]);

  return {
    page,
    limit,
    total,
    totalPages,
    from,
    to,
    hasNext,
    hasPrev,
    setPage,
    setLimit,
    setTotal,
    setTotalPages,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    updateTotal,
    paginationInfo
  };
};

// Pagination with data fetching
export const usePaginatedData = (fetchFunction, initialState = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const pagination = usePagination(initialState);

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction({
        page: pagination.page,
        limit: pagination.limit,
        ...params
      });

      setData(result.data || []);
      pagination.updateTotal(result.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, pagination.page, pagination.limit, pagination.updateTotal]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit]);

  return {
    data,
    loading,
    error,
    ...pagination,
    refresh: fetchData,
    refetch: fetchData
  };
};

// Pagination with search
export const useSearchPagination = (fetchFunction, initialState = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const pagination = usePaginatedData(fetchFunction, initialState);

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
    pagination.goToPage(1);
  }, 500, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      pagination.refetch({ search: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm]);

  return {
    ...pagination,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm
  };
};

// Pagination with sorting
export const useSortablePagination = (fetchFunction, initialState = {}) => {
  const [sortBy, setSortBy] = useState(initialState.sortBy || 'created_at');
  const [sortOrder, setSortOrder] = useState(initialState.sortOrder || 'DESC');

  const pagination = usePaginatedData(fetchFunction, initialState);

  const toggleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('DESC');
    }
    pagination.goToPage(1);
  }, [sortBy, pagination.goToPage]);

  useEffect(() => {
    pagination.refetch({ sortBy, sortOrder });
  }, [sortBy, sortOrder]);

  return {
    ...pagination,
    sortBy,
    sortOrder,
    toggleSort
  };
};

// Pagination with filters
export const useFilteredPagination = (fetchFunction, initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const pagination = usePaginatedData(fetchFunction, {});

  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    pagination.goToPage(1);
  }, [pagination.goToPage]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    pagination.goToPage(1);
  }, [initialFilters, pagination.goToPage]);

  useEffect(() => {
    pagination.refetch(filters);
  }, [filters]);

  return {
    ...pagination,
    filters,
    applyFilters,
    resetFilters
  };
};