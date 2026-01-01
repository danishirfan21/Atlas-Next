'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { useGetCollectionsQuery } from '@/lib/redux/api/collectionsApi';
import { setSelectedCollectionId, addToast } from '@/lib/redux/slices/uiSlice';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { CollectionDetail } from '@/components/collections/CollectionDetail';
import { CreateCollectionModal } from '@/components/collections/CreateCollectionModal';
import { Button, ErrorState, EmptyState } from '@/components/ui';
import styles from './page.module.css';
import { useGetDocumentsQuery } from '@/lib/redux/api/documentsApi';

export default function CollectionsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const dispatch = useAppDispatch();
  const selectedCollectionId = useAppSelector(
    (state) => state.ui.selectedCollectionId
  );

  const initialSelectionRef = useRef<number | null | undefined>(undefined);

  const hasInternalSelectionRef = useRef(false);

  if (initialSelectionRef.current === undefined) {
    initialSelectionRef.current = selectedCollectionId;
  }

  const {
    data: collections,
    isLoading,
    error,
    refetch,
  } = useGetCollectionsQuery();

  const { data: allDocumentsData } = useGetDocumentsQuery({
    status: 'all',
    sort: 'recent',
    q: '',
    page: 1,
    limit: 100,
  });

  // Auto-select first collection on load if none selected
  useEffect(() => {
    if (collections && collections.length > 0 && !selectedCollectionId) {
      dispatch(setSelectedCollectionId(collections[0].id));
      hasInternalSelectionRef.current = true;
    }
  }, [collections, selectedCollectionId, dispatch]);

  useEffect(() => {
    if (selectedCollectionId !== initialSelectionRef.current) {
      hasInternalSelectionRef.current = true;
    }
  }, [selectedCollectionId]);

  useEffect(() => {
    return () => {
      
      if (hasInternalSelectionRef.current || !initialSelectionRef.current) {
        dispatch(setSelectedCollectionId(null));
      }

      initialSelectionRef.current = undefined;
      hasInternalSelectionRef.current = false;
    };
  }, [dispatch]);

  // Listen for Topbar new collection event
  useEffect(() => {
    const handleNewCollectionEvent = () => {
      setShowCreateModal(true);
    };

    window.addEventListener('openNewCollectionModal', handleNewCollectionEvent);
    return () => {
      window.removeEventListener(
        'openNewCollectionModal',
        handleNewCollectionEvent
      );
    };
  }, []);

  // Show error toast
  useEffect(() => {
    if (error) {
      dispatch(
        addToast({
          message: 'Failed to load collections',
          type: 'error',
        })
      );
    }
  }, [error, dispatch]);

  const handleSelectCollection = (id: number) => {
    dispatch(setSelectedCollectionId(id));
  };

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorState
          message="Failed to load collections"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.header}>
            <h1 className={styles.title}>Collections</h1>
          </div>
          <div className={styles.grid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonIcon}></div>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          icon={
            <svg
              width="80"
              height="80"
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
          title="No collections yet"
          description="Collections help you organize documents by topic, team, or project. Create your first collection to get started."
          actionLabel="+ New Collection"
          onAction={() => setShowCreateModal(true)}
        />

        {showCreateModal && (
          <CreateCollectionModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.header}>
            <h1 className={styles.title}>Collections</h1>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              disabled={isLoading}
            >
              + New
            </Button>
          </div>

          <div className={styles.grid}>
            {collections.map((collection) => {
              const collectionDocs =
                allDocumentsData?.documents.filter(
                  (doc) => (doc as any).collectionId === collection.id
                ) || [];

              const actualDocCount = collectionDocs.length;
              const actualContributorCount = new Set(
                collectionDocs.map((d) => d.author)
              ).size;

              return (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  isSelected={collection.id === selectedCollectionId}
                  onClick={() => handleSelectCollection(collection.id)}
                  actualDocCount={actualDocCount}
                  actualContributorCount={actualContributorCount}
                />
              );
            })}
          </div>
        </div>

        <div className={styles.detail}>
          <CollectionDetail />
        </div>
      </div>

      {showCreateModal && (
        <CreateCollectionModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
