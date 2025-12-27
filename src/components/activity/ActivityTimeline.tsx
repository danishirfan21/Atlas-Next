'use client';

import React from 'react';
import type { ActivityItem } from '@/types';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { formatRelativeTime } from '@/lib/utils/helpers';
import styles from './ActivityTimeline.module.css';

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
      <div className="empty-state">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <h3>No activity yet</h3>
        <p>Activity will appear here as you work on documents</p>
      </div>
    );
  }

  return (
    <div className={styles.timeline}>
      {activities.map((activity) => {
        const config = ACTION_CONFIG[activity.action];

        return (
          <div key={activity.id} className={styles.item}>
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
