'use client';

import React, { useCallback } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  setSelectedDocumentId,
  setSelectedCollectionId,
} from '@/lib/redux/slices/uiSlice';
import { useRouter } from 'next/navigation';
import type { Document, Collection } from '@/types';
import { Badge, EmptyState } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils/helpers';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  results: {
    documents: Document[];
    collections: Collection[];
    totalResults: number;
  };
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

  const handleDocumentClick = useCallback(
    (doc: Document) => {
      dispatch(setSelectedDocumentId(doc.id));
      router.push('/documents');
    },
    [dispatch, router]
  );

  const handleCollectionClick = useCallback(
    (collection: Collection) => {
      dispatch(setSelectedCollectionId(collection.id));
      router.push('/collections');
    },
    [dispatch, router]
  );

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

  if (!searchQuery.trim()) {
    return (
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
        title="Ready to search"
        description="Enter a search query above to find documents and collections across your workspace. You can also use filters to narrow your results."
      />
    );
  }

  if (results.totalResults === 0) {
    return (
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
        title="No results found"
        description={`No documents or collections match "${searchQuery}". Try using different keywords or adjusting your filters.`}
      />
    );
  }

  const hasDocuments = results.documents.length > 0;
  const hasCollections = results.collections.length > 0;

  return (
    <div className={styles.results}>
      <div className={styles.resultCount}>
        Found <strong>{results.totalResults}</strong>{' '}
        {results.totalResults === 1 ? 'result' : 'results'}
        {searchQuery && (
          <>
            {' for '}
            <strong>"{searchQuery}"</strong>
          </>
        )}
        {hasDocuments && hasCollections && (
          <span className={styles.breakdown}>
            {' '}
            ({results.collections.length}{' '}
            {results.collections.length === 1 ? 'collection' : 'collections'},{' '}
            {results.documents.length}{' '}
            {results.documents.length === 1 ? 'document' : 'documents'})
          </span>
        )}
      </div>

      {/* Collections Section */}
      {hasCollections && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Collections ({results.collections.length})
          </h3>
          <div className={styles.collectionGrid}>
            {results.collections.map((collection) => (
              <CollectionResultCard
                key={collection.id}
                collection={collection}
                searchQuery={searchQuery}
                onClick={handleCollectionClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Documents Section */}
      {hasDocuments && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Documents ({results.documents.length})
          </h3>
          {results.documents.map((doc) => (
            <DocumentResultCard
              key={doc.id}
              doc={doc}
              searchQuery={searchQuery}
              onClick={handleDocumentClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Memoized collection card
const CollectionResultCard = React.memo(
  ({
    collection,
    searchQuery,
    onClick,
  }: {
    collection: Collection;
    searchQuery: string;
    onClick: (collection: Collection) => void;
  }) => {
    const handleClick = useCallback(() => {
      onClick(collection);
    }, [collection, onClick]);

    const highlightText = (text: string, query: string) => {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };

    return (
      <div className={styles.collectionCard} onClick={handleClick}>
        <div
          className={styles.collectionIcon}
          style={{ background: collection.iconBg }}
        >
          <span>{collection.icon}</span>
        </div>
        <div className={styles.collectionContent}>
          <h4
            className={styles.collectionTitle}
            dangerouslySetInnerHTML={{
              __html: highlightText(collection.name, searchQuery),
            }}
          />
          <p
            className={styles.collectionDescription}
            dangerouslySetInnerHTML={{
              __html: highlightText(collection.description, searchQuery),
            }}
          />
          <div className={styles.collectionMeta}>
            <span>
              📄 {collection.documentCount}{' '}
              {collection.documentCount === 1 ? 'doc' : 'docs'}
            </span>
            <span>•</span>
            <span>
              👥 {collection.contributorCount}{' '}
              {collection.contributorCount === 1
                ? 'contributor'
                : 'contributors'}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

CollectionResultCard.displayName = 'CollectionResultCard';

// Memoized document card
const DocumentResultCard = React.memo(
  ({
    doc,
    searchQuery,
    onClick,
  }: {
    doc: Document;
    searchQuery: string;
    onClick: (doc: Document) => void;
  }) => {
    const handleClick = useCallback(() => {
      onClick(doc);
    }, [doc, onClick]);

    const highlightText = (text: string, query: string) => {
      if (!query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };

    return (
      <div className={styles.resultCard} onClick={handleClick}>
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
    );
  }
);

DocumentResultCard.displayName = 'DocumentResultCard';
