'use client';

import React, { useState, useEffect } from 'react';
import styles from './PersistenceIndicator.module.css';

/**
 * Shows a subtle indicator when state is being saved
 * Appears briefly in bottom-left corner
 */

export function PersistenceIndicator() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setShow(true);
      setTimeout(() => setShow(false), 1000);
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!show) return null;

  return (
    <div className={styles.indicator}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Preferences saved</span>
    </div>
  );
}
