'use client';

import React from 'react';
import type { ActivityAction } from '@/types';
import styles from './ActivityFilters.module.css';

interface ActivityFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const FILTERS: Array<{ value: string; label: string; icon: string }> = [
  { value: 'all', label: 'All Activity', icon: '📊' },
  { value: 'created', label: 'Created', icon: '✨' },
  { value: 'updated', label: 'Updated', icon: '📝' },
  { value: 'published', label: 'Published', icon: '🚀' },
  { value: 'commented', label: 'Commented', icon: '💬' },
];

export function ActivityFilters({
  selectedFilter,
  onFilterChange,
}: ActivityFiltersProps) {
  return (
    <div className={styles.filters}>
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          className={`${styles.filter} ${
            selectedFilter === filter.value ? styles.active : ''
          }`}
          onClick={() => onFilterChange(filter.value)}
        >
          <span className={styles.icon}>{filter.icon}</span>
          {filter.label}
        </button>
      ))}
    </div>
  );
}
