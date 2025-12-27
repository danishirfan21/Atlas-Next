'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedDocumentId } from '@/lib/redux/slices/uiSlice';
import { Badge } from '@/components/ui/Badge/Badge';
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

  const handleSelectDocument = (id: number) => {
    dispatch(setSelectedDocumentId(id));
  };

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
        <div className="empty-state">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <h3>{searchQuery ? 'No documents found' : 'No documents'}</h3>
          <p>
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Create your first document to get started'}
          </p>
          {!searchQuery && (
            <button className={styles.createButton} onClick={onNewDocument}>
              + New Document
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scrollable}>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`${styles.docCard} ${
            doc.id === selectedDocumentId ? styles.selected : ''
          }`}
          onClick={() => handleSelectDocument(doc.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelectDocument(doc.id);
            }
          }}
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
      ))}
    </div>
  );
}
