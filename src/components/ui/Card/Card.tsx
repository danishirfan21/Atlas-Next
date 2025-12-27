import React from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';

/**
 * Card Component
 * 
 * Reusable container with consistent padding, borders, and hover states
 * Used across dashboard, collections, settings, etc.
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div 
      className={clsx(
        styles.card, 
        hover && styles.hover,
        className
      )}
    >
      {children}
    </div>
  );
}
