'use client';

import React from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { useGetCollectionQuery } from '@/lib/redux/api/collectionsApi';
import { useGetDocumentsQuery } from '@/lib/redux/api/documentsApi';
import { DocumentList } from '@/components/documents/DocumentList';
import styles from './CollectionDetail.module.css';
import { EmptyState } from '../ui';

export function CollectionDetail() {
  const selectedCollectionId = useAppSelector(
    (state) => state.ui.selectedCollectionId
  );

  const { data: collection, isLoading: isLoadingCollection } =
    useGetCollectionQuery(selectedCollectionId!, {
      skip: !selectedCollectionId,
    });

  // Fetch all documents
  const { data: documentsData, isLoading: isLoadingDocuments } =
    useGetDocumentsQuery(
      { status: 'all', sort: 'recent', q: '', page: 1, limit: 100 },
      { skip: !selectedCollectionId }
    );

  // Filter documents by collectionId (client-side filtering)
  const collectionDocuments = React.useMemo(() => {
    if (!documentsData?.documents) return [];
    return documentsData.documents.filter(
      (doc) => (doc as any).collectionId === selectedCollectionId
    );
  }, [documentsData, selectedCollectionId]);

  if (!selectedCollectionId) {
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
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        }
        title="No collection selected"
        description="Select a collection from the sidebar to view its documents and details. Collections help you organize related documents together."
      />
    );
  }

  if (isLoadingCollection || !collection) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonHeader}></div>
          <div className={styles.skeletonText}></div>
          <div className={styles.skeletonText}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div
          className={styles.iconContainer}
          style={{ background: collection.iconBg }}
        >
          <span className={styles.icon}>{collection.icon}</span>
        </div>
        <div className={styles.info}>
          <h2>{collection.name}</h2>
          <p className={styles.description}>{collection.description}</p>
          <div className={styles.stats}>
            <span>📄 {collection.documentCount} documents</span>
            <span>👥 {collection.contributorCount} contributors</span>
            <span>
              📅 Updated {new Date(collection.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.documentsSection}>
        <h3 className={styles.sectionTitle}>Documents in this collection</h3>
        {isLoadingDocuments ? (
          <div>Loading documents...</div>
        ) : (
          <div className={styles.documentsList}>
            {collectionDocuments.length > 0 ? (
              collectionDocuments.map((doc) => (
                <div key={doc.id} className={styles.documentCard}>
                  <h4>{doc.title}</h4>
                  <p>{doc.snippet}</p>
                  <div className={styles.documentMeta}>
                    <span>{doc.author}</span>
                    <span>•</span>
                    <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={
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
                }
                title="No documents yet"
                description="This collection doesn't have any documents yet. Add documents to get started."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
