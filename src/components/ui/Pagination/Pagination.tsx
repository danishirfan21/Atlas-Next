import React from 'react';
import type { PaginationInfo } from '@/types';
import styles from './Pagination.module.css';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, hasNext, hasPrev } = pagination;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and pages around current
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1 && page === 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Previous
      </button>

      <div className={styles.pages}>
        {getPageNumbers().map((pageNum, idx) =>
          typeof pageNum === 'number' ? (
            <button
              key={idx}
              className={`${styles.pageButton} ${
                pageNum === page ? styles.active : ''
              }`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          ) : (
            <span key={idx} className={styles.ellipsis}>
              {pageNum}
            </span>
          )
        )}
      </div>

      <button
        className={styles.button}
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
      >
        Next
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
