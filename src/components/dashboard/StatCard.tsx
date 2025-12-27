import React from 'react';
import styles from './StatCard.module.css';

/**
 * StatCard Component
 * 
 * Dashboard metric card with icon, value, label, and trend indicator
 */

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function StatCard({
  icon,
  iconBg,
  iconColor,
  value,
  label,
  change,
  changeType = 'neutral',
}: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.icon} style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
        {change && (
          <div className={`${styles.change} ${styles[changeType]}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
