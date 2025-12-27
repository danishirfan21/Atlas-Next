"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { removeToast } from '@/lib/redux/slices/uiSlice';
import styles from './Toast.module.css';

export function ToastContainer() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    toasts.forEach((toast: { id: string; message: string; type: string }) => {
      // Errors stay longer (5s), others 3s
      const duration = toast.type === 'error' ? 5000 : 3000;
      
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast: { id: string; message: string; type: string }) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span className={styles.message}>{toast.message}</span>
          <button
            className={styles.dismiss}
            onClick={() => dispatch(removeToast(toast.id))}
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
