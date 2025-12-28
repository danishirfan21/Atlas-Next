'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setSearchQuery, addToast } from '@/lib/redux/slices/uiSlice';
import { useSearchDocumentsQuery } from '@/lib/redux/api/searchApi';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { ErrorState } from '@/components/ui';
import { debounce } from '@/lib/utils/helpers';
import styles from './page.module.css';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Get search query from URL or Redux
  const urlQuery = searchParams.get('q') || '';
  const reduxQuery = useAppSelector((state) => state.ui.searchQuery);
  const filters = useAppSelector((state) => state.ui.searchFilters);

  const [localQuery, setLocalQuery] = useState(urlQuery || reduxQuery);

  // Memoized debounced search - updates Redux & URL
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        dispatch(setSearchQuery(query));

        // Update URL
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
          params.set('q', query);
        } else {
          params.delete('q');
        }
        router.replace(`/search?${params.toString()}`, { scroll: false });
      }, 300),
    [dispatch, router, searchParams]
  );

  // Optimized input change handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Sync URL query to local state on mount
  useEffect(() => {
    if (urlQuery) {
      setLocalQuery(urlQuery);
      dispatch(setSearchQuery(urlQuery));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // RTK Query - automatically deduplicates requests
  const {
    data: results,
    isLoading,
    error,
    refetch,
  } = useSearchDocumentsQuery(
    {
      q: reduxQuery,
      status: filters.status,
      author: filters.author,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    },
    {
      skip: !reduxQuery && filters.status === 'all' && filters.author === 'all',
    }
  );

  // Show error toast
  useEffect(() => {
    if (error) {
      dispatch(
        addToast({
          message: 'Search failed',
          type: 'error',
        })
      );
    }
  }, [error, dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Search</h1>
        <p className={styles.subtitle}>
          Search across all documents and collections
        </p>
      </div>

      <div className={styles.searchBar}>
        <svg
          className={styles.searchIcon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search documents..."
          value={localQuery}
          onChange={handleSearchChange}
          disabled={isLoading}
          autoFocus
        />
      </div>

      <SearchFilters />

      {error ? (
        <ErrorState message="Search failed" onRetry={() => refetch()} />
      ) : (
        <SearchResults
          results={results || []}
          isLoading={isLoading}
          searchQuery={reduxQuery}
        />
      )}
    </div>
  );
}
