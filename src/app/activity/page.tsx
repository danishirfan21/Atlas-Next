'use client';

import React, { useState, useEffect } from 'react';
import { useGetActivityQuery } from '@/lib/redux/api/activityApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addToast } from '@/lib/redux/slices/uiSlice';
import { ActivityFilters } from '@/components/activity/ActivityFilters';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { Card, ErrorState } from '@/components/ui';
import styles from './page.module.css';

export default function ActivityPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const dispatch = useAppDispatch();

  const {
    data: activities,
    isLoading,
    error,
    refetch,
  } = useGetActivityQuery({
    type: selectedFilter,
  });

  // Show error toast
  useEffect(() => {
    if (error) {
      dispatch(
        addToast({
          message: 'Failed to load activity',
          type: 'error',
        })
      );
    }
  }, [error, dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Activity Feed</h1>
          <p className={styles.subtitle}>
            Track all changes across your workspace
          </p>
        </div>
      </div>

      {error ? (
        <Card>
          <ErrorState
            message="Failed to load activity"
            onRetry={() => refetch()}
          />
        </Card>
      ) : (
        <Card>
          <ActivityFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          <ActivityTimeline
            activities={activities || []}
            isLoading={isLoading}
          />
        </Card>
      )}
    </div>
  );
}
