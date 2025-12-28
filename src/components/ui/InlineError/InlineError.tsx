import React from 'react';
import { Button } from '@/components/ui/Button/Button';
import styles from './InlineError.module.css';

interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function InlineError({ message, onRetry, onDismiss }: InlineErrorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={styles.icon}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p className={styles.message}>{message}</p>
      </div>
      <div className={styles.actions}>
        {onRetry && (
          <button className={styles.retryButton} onClick={onRetry}>
            Retry
          </button>
        )}
        {onDismiss && (
          <button className={styles.dismissButton} onClick={onDismiss}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
