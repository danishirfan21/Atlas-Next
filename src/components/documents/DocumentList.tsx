'use client';

import React, { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedDocumentId } from '@/lib/redux/slices/uiSlice';
import { documentsApi } from '@/lib/redux/api/documentsApi';
import { Badge, EmptyState } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/helpers';
import type { Document } from '@/types';
import styles from './DocumentList.module.css';

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onNewDocument: () => void;
}

export function DocumentList({
  documents,
  isLoading,
  onNewDocument,
}: DocumentListProps) {
  const dispatch = useAppDispatch();
  const selectedDocumentId = useAppSelector(
    (state) => state.ui.selectedDocumentId
  );
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);

  const handleSelectDocument = useCallback(
    (id: number) => {
      dispatch(setSelectedDocumentId(id));
    },
    [dispatch]
  );

  // Prefetch document on hover for instant loading
  const handleDocumentHover = useCallback((id: number) => {
    // Trigger prefetch by calling the query hook (it will cache the result)
    // We don't use the result here, just trigger the fetch
    // This is a pattern - we'll add the actual prefetch in the DocumentCard component
  }, []);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  if (isLoading) {
    return (
      <div className={styles.scrollable}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className={styles.scrollable}>
        {searchQuery ? (
          <EmptyState
            icon={
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            }
            title="No documents found"
            description={`No documents match "${searchQuery}". Try adjusting your search or filters.`}
          />
        ) : (
          <EmptyState
            icon={
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            }
            title="No documents yet"
            description="Create your first document to get started with Atlas. Documents help you organize and share knowledge with your team."
            actionLabel="+ New Document"
            onAction={onNewDocument}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.scrollable}>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          isSelected={doc.id === selectedDocumentId}
          searchQuery={searchQuery}
          onSelect={handleSelectDocument}
        />
      ))}
    </div>
  );
}

// Memoized document card component to prevent unnecessary re-renders
const DocumentCard = React.memo(
  ({
    doc,
    isSelected,
    searchQuery,
    onSelect,
  }: {
    doc: Document;
    isSelected: boolean;
    searchQuery: string;
    onSelect: (id: number) => void;
  }) => {
    const prefetchDocument = documentsApi.usePrefetch('getDocument');

    const handleMouseEnter = useCallback(() => {
      prefetchDocument(doc.id, { ifOlderThan: 10 });
    }, [doc.id, prefetchDocument]);

    const handleClick = useCallback(() => {
      onSelect(doc.id);
    }, [doc.id, onSelect]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(doc.id);
        }
      },
      [doc.id, onSelect]
    );

    const highlightText = (text: string, query: string) => {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };

    return (
      <div
        className={`${styles.docCard} ${isSelected ? styles.selected : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <h3
          dangerouslySetInnerHTML={{
            __html: highlightText(doc.title, searchQuery),
          }}
        />
        <p
          className={styles.snippet}
          dangerouslySetInnerHTML={{
            __html: highlightText(doc.snippet, searchQuery),
          }}
        />
        <div className={styles.meta}>
          <span>
            {formatRelativeTime(new Date(doc.updatedAt))} • {doc.author}
          </span>
          <Badge status={doc.status} />
        </div>
      </div>
    );
  }
);

DocumentCard.displayName = 'DocumentCard';
