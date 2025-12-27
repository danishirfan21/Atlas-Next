import React from 'react';
import { getBadgeClass } from '@/lib/utils/helpers';

/**
 * Badge Component
 * 
 * Status indicator with color-coded backgrounds
 * Uses global badge styles from globals.css
 */

interface BadgeProps {
  status: string;
}

export function Badge({ status }: BadgeProps) {
  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {status}
    </span>
  );
}
