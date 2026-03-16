// =====================================================
// FILE: frontend/src/hooks/useInfiniteScroll.js
// DESKRIPSI: Infinite scroll hook
// =====================================================

import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (fetchMore, options = {}) => {
  const {
    threshold = 100,
    initialPage = 1,
    loading: initialLoading = false,
    hasMore: initialHasMore = true
  } = options;

  const [loading, setLoading] = useState(initialLoading);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(initialPage);
  const [error, setError] = useState(null);
  
  const loaderRef = useRef();
  const observerRef = useRef();

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);

    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  useEffect(() => {
    if (page > initialPage) {
      const loadMore = async () => {
        setLoading(true);
        setError(null);

        try {
          const result = await fetchMore(page);
          setHasMore(result.hasMore !== false);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      loadMore();
    }
  }, [page, fetchMore, initialPage]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(initialHasMore);
    setLoading(false);
    setError(null);
  }, [initialPage, initialHasMore]);

  return {
    loaderRef,
    loading,
    hasMore,
    error,
    page,
    reset
  };
};

// Infinite scroll with data fetching
export const useInfiniteData = (fetchFunction, options = {}) => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  
  const infiniteScroll = useInfiniteScroll(async (page) => {
    const result = await fetchFunction(page);
    
    setData(prev => [...prev, ...result.data]);
    setAllData(prev => [...prev, ...result.data]);
    
    return result;
  }, options);

  const refresh = useCallback(async () => {
    infiniteScroll.reset();
    setData([]);
    setAllData([]);
  }, [infiniteScroll]);

  return {
    ...infiniteScroll,
    data,
    allData,
    refresh
  };
};

// Infinite scroll with search
export const useInfiniteSearch = (searchFunction, options = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const infiniteData = useInfiniteData(
    async (page) => {
      return await searchFunction(debouncedSearchTerm, page);
    },
    options
  );

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
    infiniteData.refresh();
  }, 500, [searchTerm]);

  return {
    ...infiniteData,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm
  };
};

// Window scroll infinite hook
export const useWindowInfiniteScroll = (fetchMore, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const handleScroll = useCallback(() => {
    if (!hasMore || loading) return;

    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= docHeight - 200) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1) {
      const loadMore = async () => {
        setLoading(true);
        setError(null);

        try {
          const result = await fetchMore(page);
          setHasMore(result.hasMore !== false);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      loadMore();
    }
  }, [page, fetchMore]);

  const reset = useCallback(() => {
    setPage(1);
    setHasMore(true);
    setLoading(false);
    setError(null);
  }, []);

  return { loading, hasMore, error, page, reset };
};