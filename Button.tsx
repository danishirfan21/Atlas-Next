import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

/**
 * Button Component
 * 
 * Reusable button with variants matching original design
 * Supports primary, secondary, and icon-only variants
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  children, 
  className,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
