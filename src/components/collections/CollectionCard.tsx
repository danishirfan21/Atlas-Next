'use client';

import React, { useCallback } from 'react';
import type { Collection } from '@/types';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
  collection: Collection;
  isSelected: boolean;
  onClick: () => void;
  actualDocCount?: number;
  actualContributorCount?: number;
}

export const CollectionCard = React.memo(function CollectionCard({
  collection,
  isSelected,
  onClick,
  actualDocCount,
  actualContributorCount,
}: CollectionCardProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className={styles.iconContainer}
        style={{ background: collection.iconBg }}
      >
        <span className={styles.icon}>{collection.icon}</span>
      </div>

      <h3 className={styles.name}>{collection.name}</h3>
      <p className={styles.description}>{collection.description}</p>

      <div className={styles.stats}>
        <span>📄 {actualDocCount ?? collection.documentCount} docs</span>
        <span>
          👥 {actualContributorCount ?? collection.contributorCount}{' '}
          contributors
        </span>
      </div>
    </div>
  );
});
