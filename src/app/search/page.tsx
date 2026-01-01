'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setSearchQuery, addToast } from '@/lib/redux/slices/uiSlice';
import { useSearchDocumentsAndCollectionsQuery } from '@/lib/redux/api/searchApi';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { ErrorState } from '@/components/ui';
import { debounce } from '@/lib/utils/helpers';
import styles from './page.module.css';

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const urlQuery = searchParams.get('q') || '';
  const filters = useAppSelector((state) => state.ui.searchFilters);

  const [localQuery, setLocalQuery] = useState(urlQuery);

  useEffect(() => {
    const currentUrlQuery = searchParams.get('q') || '';
    setLocalQuery(currentUrlQuery);
    dispatch(setSearchQuery(currentUrlQuery));
  }, [searchParams, dispatch]);

  useEffect(() => {
    return () => {
      // Clear Redux search query when leaving search page
      dispatch(setSearchQuery(''));
    };
  }, [dispatch]);

  const debouncedUrlUpdate = useMemo(
    () =>
      debounce((query: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) {
          params.set('q', query);
        } else {
          params.delete('q');
        }
        router.replace(`/search?${params.toString()}`, { scroll: false });
      }, 300),
    [router, searchParams]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalQuery(value);
      debouncedUrlUpdate(value);
    },
    [debouncedUrlUpdate]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediate URL update on submit
    const params = new URLSearchParams();
    if (localQuery.trim()) {
      params.set('q', localQuery.trim());
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = useCallback(() => {
    setLocalQuery('');
    router.push('/search');
  }, [router]);

  const shouldSkip =
    !urlQuery.trim() &&
    filters.status === 'all' &&
    filters.author === 'all' &&
    !filters.dateFrom &&
    !filters.dateTo;

  const {
    data: results,
    isLoading,
    error,
    refetch,
  } = useSearchDocumentsAndCollectionsQuery(
    {
      q: urlQuery,
      status: filters.status,
      author: filters.author,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    },
    { skip: shouldSkip }
  );

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

  // Default results structure
  const defaultResults = {
    documents: [],
    collections: [],
    totalResults: 0,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Search</h1>
        <p className={styles.subtitle}>
          Search across all documents and collections
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
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
          placeholder="Search documents and collections..."
          value={localQuery}
          onChange={handleSearchChange}
          disabled={isLoading}
          autoFocus
        />
        {localQuery && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
        )}
      </form>

      <SearchFilters />

      {error ? (
        <ErrorState message="Search failed" onRetry={() => refetch()} />
      ) : (
        <SearchResults
          results={results || defaultResults}
          isLoading={isLoading}
          searchQuery={urlQuery}
        />
      )}
    </div>
  );
}
