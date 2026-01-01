'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { useGetDocumentsQuery } from '@/lib/redux/api/documentsApi';
import {
  setSelectedDocumentId,
  setDocumentFilters,
  setDocumentsPage,
  resetDocumentsPage,
  addToast,
} from '@/lib/redux/slices/uiSlice';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { CreateDocumentModal } from '@/components/documents/CreateDocumentModal';
import { Pagination, ErrorState } from '@/components/ui';
import styles from './page.module.css';

export default function DocumentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useAppDispatch();
  const selectedDocumentId = useAppSelector(
    (state) => state.ui.selectedDocumentId
  );
  const filters = useAppSelector((state) => state.ui.documentFilters);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const pagination = useAppSelector((state) => state.ui.documentsPagination);

  // READ VIEW MODE FROM REDUX
  const viewMode = useAppSelector(
    (state) => state.ui.viewPreferences.documentsViewMode
  );

  // Fix hydration: wait for mount before rendering persisted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, error, refetch } = useGetDocumentsQuery({
    status: filters.status,
    sort: filters.sort,
    q: searchQuery,
    page: pagination.page,
    limit: pagination.limit,
  });

  const documents = data?.documents || [];
  const paginationInfo = data?.pagination;

  // Restore persisted state on mount
  useEffect(() => {
    if (
      selectedDocumentId &&
      !documents.find((d) => d.id === selectedDocumentId)
    ) {
      // Document exists but not in current filtered view - that's ok
    }
  }, [selectedDocumentId, documents]);

  // Auto-select first document on load if none selected
  useEffect(() => {
    if (documents && documents.length > 0 && !selectedDocumentId) {
      dispatch(setSelectedDocumentId(documents[0].id));
    }
  }, [documents, selectedDocumentId, dispatch]);

  // Reset to page 1 when filters change
  useEffect(() => {
    dispatch(resetDocumentsPage());
  }, [filters.status, filters.sort, searchQuery, dispatch]);

  // Listen for Topbar new document event
  useEffect(() => {
    const handleNewDocumentEvent = () => {
      setShowCreateModal(true);
    };

    window.addEventListener('openNewDocumentModal', handleNewDocumentEvent);
    return () => {
      window.removeEventListener(
        'openNewDocumentModal',
        handleNewDocumentEvent
      );
    };
  }, []);

  // Show error toast on fetch error
  useEffect(() => {
    if (error) {
      dispatch(
        addToast({
          message: 'Failed to load documents',
          type: 'error',
        })
      );
    }
  }, [error, dispatch]);

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(setDocumentFilters({ status: e.target.value as any }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setDocumentFilters({ sort: e.target.value as any }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setDocumentsPage(page));
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.documentList}>
          <div className={styles.filterBar}>
            <select
              className={styles.dropdown}
              value={filters.status}
              onChange={handleStatusFilterChange}
              disabled={isLoading}
            >
              <option value="all">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="In Review">In Review</option>
            </select>
            <select
              className={styles.dropdown}
              value={filters.sort}
              onChange={handleSortChange}
              disabled={isLoading}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {error ? (
            <ErrorState
              message="Failed to load documents"
              onRetry={() => refetch()}
            />
          ) : (
            <>
              {/* PASS VIEW MODE TO DOCUMENT LIST */}
              <DocumentList
                documents={documents}
                isLoading={isLoading}
                onNewDocument={() => setShowCreateModal(true)}
                viewMode={isMounted ? viewMode : 'list'}
              />

              {paginationInfo && !isLoading && (
                <div className={styles.paginationContainer}>
                  <Pagination
                    pagination={paginationInfo}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.documentPreview}>
          <DocumentPreview />
        </div>
      </div>

      {showCreateModal && (
        <CreateDocumentModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
