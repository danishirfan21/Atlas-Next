'use client';

import React, { useState } from 'react';
import { useGetActivityQuery } from '@/lib/redux/api/activityApi';
import { ActivityFilters } from '@/components/activity/ActivityFilters';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function ActivityPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { data: activities, isLoading } = useGetActivityQuery({
    type: selectedFilter,
  });

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

      <Card>
        <ActivityFilters
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        <ActivityTimeline activities={activities || []} isLoading={isLoading} />
      </Card>
    </div>
  );
}
