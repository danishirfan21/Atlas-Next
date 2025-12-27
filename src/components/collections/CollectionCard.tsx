'use client';

import React from 'react';
import type { Collection } from '@/types';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
  collection: Collection;
  isSelected: boolean;
  onClick: () => void;
}

export function CollectionCard({
  collection,
  isSelected,
  onClick,
}: CollectionCardProps) {
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
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
        <span>📄 {collection.documentCount} docs</span>
        <span>👥 {collection.contributorCount} contributors</span>
      </div>
    </div>
  );
}
