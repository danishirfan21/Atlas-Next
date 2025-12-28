import React from 'react';
import styles from './SkipLink.module.css';

/**
 * Skip to main content link for keyboard navigation
 * Visible only when focused
 */

export function SkipLink() {
  return (
    <a href="#main-content" className={styles.skipLink}>
      Skip to main content
    </a>
  );
}
