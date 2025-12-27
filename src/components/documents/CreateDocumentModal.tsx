'use client';

import React, { useState } from 'react';
import { useCreateDocumentMutation } from '@/lib/redux/api/documentsApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedDocumentId, addToast } from '@/lib/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button/Button';
import styles from './CreateDocumentModal.module.css';

interface CreateDocumentModalProps {
  onClose: () => void;
}

export function CreateDocumentModal({ onClose }: CreateDocumentModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [createDocument, { isLoading }] = useCreateDocumentMutation();
  const dispatch = useAppDispatch();

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
      }).unwrap();

      dispatch(setSelectedDocumentId(newDoc.id));
      dispatch(addToast({ message: 'Document created', type: 'success' }));
      onClose();
    } catch (error) {
      dispatch(
        addToast({ message: 'Failed to create document', type: 'error' })
      );
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>New Document</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.formGroup}>
              <label>Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title..."
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label>Content</label>
              <textarea
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
