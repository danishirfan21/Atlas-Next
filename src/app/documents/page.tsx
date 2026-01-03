'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
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
  const [isMobile, setIsMobile] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedDocumentId = useAppSelector(
    (state) => state.ui.selectedDocumentId
  );
  const filters = useAppSelector((state) => state.ui.documentFilters);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const pagination = useAppSelector((state) => state.ui.documentsPagination);

  const initialSelectionRef = useRef<number | null | undefined>(undefined);
  const hasInternalSelectionRef = useRef(false);

  if (initialSelectionRef.current === undefined) {
    initialSelectionRef.current = selectedDocumentId;
  }

  // READ VIEW MODE FROM REDUX
  const viewMode = useAppSelector(
    (state) => state.ui.viewPreferences.documentsViewMode
  );

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fix hydration: wait for mount before rendering persisted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🎯 READ URL PARAMETER AND AUTO-SELECT DOCUMENT
  useEffect(() => {
    const docIdParam = searchParams.get('doc');
    if (docIdParam) {
      const docId = parseInt(docIdParam);
      if (!isNaN(docId)) {
        console.log('📍 URL parameter detected, selecting document:', docId);
        dispatch(setSelectedDocumentId(docId));
        hasInternalSelectionRef.current = true;

        // Show detail view on mobile when URL has doc parameter
        if (isMobile) {
          setShowDetail(true);
        }
      }
    }
  }, [searchParams, dispatch, isMobile]);

  useEffect(() => {
    return () => {
      if (hasInternalSelectionRef.current || !initialSelectionRef.current) {
        dispatch(setSelectedDocumentId(null));
      }

      initialSelectionRef.current = undefined;
      hasInternalSelectionRef.current = false;
    };
  }, [dispatch]);

  const { data, isLoading, error, refetch } = useGetDocumentsQuery({
    status: filters.status,
    sort: filters.sort,
    q: searchQuery,
    page: pagination.page,
    limit: pagination.limit,
  });

  const documents = data?.documents || [];
  const paginationInfo = data?.pagination;

  // Auto-select first document on desktop only (not on mobile)
  useEffect(() => {
    if (documents && documents.length > 0 && !selectedDocumentId && !isMobile) {
      dispatch(setSelectedDocumentId(documents[0].id));
      hasInternalSelectionRef.current = true;
    }
  }, [documents, selectedDocumentId, dispatch, isMobile]);

  useEffect(() => {
    if (selectedDocumentId !== initialSelectionRef.current) {
      hasInternalSelectionRef.current = true;
    }
  }, [selectedDocumentId]);

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

  // Mobile navigation handlers
  const handleDocumentSelect = (id: number) => {
    dispatch(setSelectedDocumentId(id));

    // On mobile, show detail view
    if (isMobile) {
      setShowDetail(true);
    }
  };

  const handleBackToList = () => {
    setShowDetail(false);
    // Don't clear selection, just hide detail view
  };

  return (
    <>
      <div
        className={`${styles.container} ${showDetail ? styles.showDetail : ''}`}
      >
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
              <DocumentList
                documents={documents}
                isLoading={isLoading}
                onNewDocument={() => setShowCreateModal(true)}
                onSelectDocument={handleDocumentSelect}
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
          <DocumentPreview
            showBackButton={isMobile && showDetail}
            onBackClick={handleBackToList}
          />
        </div>
      </div>

      {showCreateModal && (
        <CreateDocumentModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
