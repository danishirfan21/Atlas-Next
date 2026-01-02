'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  setSelectedDocumentId,
  setSelectedCollectionId,
} from '@/lib/redux/slices/uiSlice';
import type { ActivityItem } from '@/types';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { formatRelativeTime } from '@/lib/utils/helpers';
import styles from './ActivityTimeline.module.css';
import { EmptyState } from '../ui';

interface ActivityTimelineProps {
  activities: ActivityItem[];
  isLoading: boolean;
}

const ACTION_CONFIG = {
  created: { color: '#10b981', icon: '✨', label: 'created' },
  updated: { color: '#3b82f6', icon: '📝', label: 'updated' },
  published: { color: '#8b5cf6', icon: '🚀', label: 'published' },
  commented: { color: '#f59e0b', icon: '💬', label: 'commented on' },
};

export function ActivityTimeline({
  activities,
  isLoading,
}: ActivityTimelineProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleActivityClick = useCallback(
    (activity: ActivityItem) => {
      if (activity.documentId) {
        // Navigate to document
        dispatch(setSelectedDocumentId(activity.documentId));
        router.push('/documents');
      } else if (activity.collectionId) {
        // Navigate to collection
        dispatch(setSelectedCollectionId(activity.collectionId));
        router.push('/collections');
      }
    },
    [dispatch, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, activity: ActivityItem) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleActivityClick(activity);
      }
    },
    [handleActivityClick]
  );

  if (isLoading) {
    return (
      <div className={styles.timeline}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonAvatar}></div>
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonText}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        }
        title="No activity yet"
        description="Activity will appear here as you create, edit, and publish documents. All team actions are tracked automatically."
      />
    );
  }

  return (
    <div className={styles.timeline}>
      {activities.map((activity) => {
        const config = ACTION_CONFIG[activity.action];
        const isClickable = !!(activity.documentId || activity.collectionId);

        return (
          <div
            key={activity.id}
            className={styles.item}
            style={{
              cursor: isClickable ? 'pointer' : 'default',
            }}
            onClick={() => isClickable && handleActivityClick(activity)}
            onKeyDown={(e) => isClickable && handleKeyDown(e, activity)}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
          >
            <div className={styles.avatarContainer}>
              <Avatar initials={activity.authorInitials} size="md" />
              <div
                className={styles.actionBadge}
                style={{ background: config.color }}
              >
                {config.icon}
              </div>
            </div>

            <div className={styles.content}>
              <div className={styles.text}>
                <strong>{activity.author}</strong> {config.label}{' '}
                <em className={styles.documentTitle}>
                  {activity.documentTitle}
                </em>
              </div>
              <div className={styles.timestamp}>
                {formatRelativeTime(activity.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
