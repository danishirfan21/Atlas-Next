import React from 'react';
import styles from './Avatar.module.css';
import { getAvatarColor } from '@/lib/utils/helpers';

/**
 * Avatar Component
 * 
 * Displays user initials with color-coded background
 * Colors are deterministic based on initials
 */

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ initials, size = 'md' }: AvatarProps) {
  const backgroundColor = getAvatarColor(initials);

  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
      style={{ background: backgroundColor }}
    >
      {initials}
    </div>
  );
}
