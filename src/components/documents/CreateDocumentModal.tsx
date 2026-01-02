'use client';

import React, { useState, useEffect } from 'react';
import { useCreateDocumentMutation } from '@/lib/redux/api/documentsApi';
import { useGetCollectionsQuery } from '@/lib/redux/api/collectionsApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedDocumentId, addToast } from '@/lib/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button/Button';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import styles from './CreateDocumentModal.module.css';

interface CreateDocumentModalProps {
  onClose: () => void;
}

export function CreateDocumentModal({ onClose }: CreateDocumentModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [createDocument, { isLoading }] = useCreateDocumentMutation();
  const dispatch = useAppDispatch();

  // Fetch collections for dropdown
  const { data: collections } = useGetCollectionsQuery();

  // Focus trap
  const modalRef = useFocusTrap<HTMLDivElement>(true);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      dispatch(
        addToast({ message: 'Please enter a document title', type: 'warning' })
      );
      return;
    }

    try {
      const newDoc = await createDocument({
        title: title.trim(),
        body: body ? `<p>${body.trim()}</p>` : '<p>Start writing...</p>',
        snippet: body ? body.substring(0, 60) + '...' : 'Start writing...',
        author: 'DK',
        authorInitials: 'DK',
        status: 'Draft',
        collectionId: selectedCollectionId || undefined,
      }).unwrap();

      dispatch(setSelectedDocumentId(newDoc.id));
      dispatch(
        addToast({ message: 'Document created successfully', type: 'success' })
      );
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.data?.error || error?.error || 'Failed to create document';
      dispatch(
        addToast({
          message: `${errorMessage}. Please try again.`,
          type: 'error',
        })
      );
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="modal-title">New Document</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.formGroup}>
              <label htmlFor="doc-title">Document Title</label>
              <input
                id="doc-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title..."
                autoFocus
                aria-required="true"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="doc-collection">Collection (Optional)</label>
              <select
                id="doc-collection"
                value={selectedCollectionId || ''}
                onChange={(e) =>
                  setSelectedCollectionId(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                disabled={!collections || collections.length === 0}
              >
                <option value="">No Collection</option>
                {collections?.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.icon} {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="doc-content">Content</label>
              <textarea
                id="doc-content"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Start writing..."
                rows={8}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Document'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
