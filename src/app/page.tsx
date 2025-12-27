'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { useGetDocumentsQuery } from '@/lib/redux/api/documentsApi';
import {
  setSelectedDocumentId,
  setDocumentFilters,
} from '@/lib/redux/slices/uiSlice';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { CreateDocumentModal } from '@/components/documents/CreateDocumentModal';
import styles from './page.module.css';

export default function DocumentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const dispatch = useAppDispatch();
  const selectedDocumentId = useAppSelector(
    (state) => state.ui.selectedDocumentId
  );
  const filters = useAppSelector((state) => state.ui.documentFilters);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);

  const { data: documents, isLoading } = useGetDocumentsQuery({
    status: filters.status,
    sort: filters.sort,
    q: searchQuery,
  });

  // Auto-select first document on load if none selected
  useEffect(() => {
    if (documents && documents.length > 0 && !selectedDocumentId) {
      dispatch(setSelectedDocumentId(documents[0].id));
    }
  }, [documents, selectedDocumentId, dispatch]);

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

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    dispatch(setDocumentFilters({ status: e.target.value as any }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setDocumentFilters({ sort: e.target.value as any }));
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
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          <DocumentList
            documents={documents || []}
            isLoading={isLoading}
            onNewDocument={() => setShowCreateModal(true)}
          />
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
