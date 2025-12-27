'use client';

import React from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedDocumentId } from '@/lib/redux/slices/uiSlice';
import { useRouter } from 'next/navigation';
import type { Document } from '@/types';
import { Badge } from '@/components/ui/Badge/Badge';
import { formatRelativeTime } from '@/lib/utils/helpers';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  results: Document[];
  isLoading: boolean;
  searchQuery: string;
}

export function SearchResults({
  results,
  isLoading,
  searchQuery,
}: SearchResultsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleResultClick = (doc: Document) => {
    dispatch(setSelectedDocumentId(doc.id));
    router.push('/documents');
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  if (isLoading) {
    return (
      <div className={styles.results}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonMeta}></div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="empty-state">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>No results found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      <div className={styles.resultCount}>
        Found <strong>{results.length}</strong>{' '}
        {results.length === 1 ? 'result' : 'results'}
        {searchQuery && (
          <>
            {' for '}
            <strong>"{searchQuery}"</strong>
          </>
        )}
      </div>

      {results.map((doc) => (
        <div
          key={doc.id}
          className={styles.resultCard}
          onClick={() => handleResultClick(doc)}
        >
          <div className={styles.resultHeader}>
            <h3
              className={styles.resultTitle}
              dangerouslySetInnerHTML={{
                __html: highlightText(doc.title, searchQuery),
              }}
            />
            <Badge status={doc.status} />
          </div>

          <p
            className={styles.resultSnippet}
            dangerouslySetInnerHTML={{
              __html: highlightText(doc.snippet, searchQuery),
            }}
          />

          <div className={styles.resultMeta}>
            <span>{doc.author}</span>
            <span>•</span>
            <span>{formatRelativeTime(new Date(doc.updatedAt))}</span>
            <span>•</span>
            <span>👁 {doc.views} views</span>
          </div>
        </div>
      ))}
    </div>
  );
}
