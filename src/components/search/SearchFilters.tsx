'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import {
  setSearchFilters,
  resetSearchFilters,
} from '@/lib/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button/Button';
import styles from './SearchFilters.module.css';

const AUTHORS = [
  'All Authors',
  'Sarah Chen',
  'Marcus Rivera',
  'Alex Morgan',
  'David Park',
  'Emma Wilson',
  'Rachel Kim',
];

export function SearchFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.ui.searchFilters);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSearchFilters({ status: e.target.value }));
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSearchFilters({ author: e.target.value }));
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilters({ dateFrom: e.target.value }));
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilters({ dateTo: e.target.value }));
  };

  const handleReset = () => {
    dispatch(resetSearchFilters());
  };

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.author !== 'all' ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label className={styles.label}>Status</label>
        <select
          className={styles.select}
          value={filters.status}
          onChange={handleStatusChange}
        >
          <option value="all">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="In Review">In Review</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Author</label>
        <select
          className={styles.select}
          value={filters.author}
          onChange={handleAuthorChange}
        >
          {AUTHORS.map((author) => (
            <option
              key={author}
              value={author === 'All Authors' ? 'all' : author}
            >
              {author}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>From Date</label>
        <input
          type="date"
          className={styles.input}
          value={filters.dateFrom}
          onChange={handleDateFromChange}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>To Date</label>
        <input
          type="date"
          className={styles.input}
          value={filters.dateTo}
          onChange={handleDateToChange}
        />
      </div>

      {hasActiveFilters && (
        <div className={styles.filterGroup}>
          <label className={styles.label}>&nbsp;</label>
          <Button variant="secondary" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
