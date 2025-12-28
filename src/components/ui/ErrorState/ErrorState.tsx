import React from 'react';
import { Button } from '@/components/ui/Button/Button';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  detailed?: boolean;
}

export function ErrorState({
  message = 'Failed to load data',
  onRetry,
  detailed = false,
}: ErrorStateProps) {
  return (
    <div className={styles.container}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={styles.icon}
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h3>{message}</h3>
      <p>
        {detailed
          ? 'The service is temporarily unavailable. This may be due to network issues or server maintenance.'
          : 'Please check your connection and try again'}
      </p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
