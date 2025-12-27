'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import {
  useGetDocumentQuery,
  useUpdateDocumentMutation,
} from '@/lib/redux/api/documentsApi';
import {
  setIsEditingDocument,
  setUnsavedChanges,
  addToast,
} from '@/lib/redux/slices/uiSlice';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { formatRelativeTime } from '@/lib/utils/helpers';
import styles from './DocumentPreview.module.css';

export function DocumentPreview() {
  const dispatch = useAppDispatch();
  const selectedDocumentId = useAppSelector(
    (state) => state.ui.selectedDocumentId
  );
  const isEditing = useAppSelector((state) => state.ui.isEditingDocument);
  const hasUnsavedChanges = useAppSelector(
    (state) => state.ui.hasUnsavedChanges
  );

  const { data: document, isLoading } = useGetDocumentQuery(
    selectedDocumentId!,
    {
      skip: !selectedDocumentId,
    }
  );

  const [updateDocument, { isLoading: isUpdating }] =
    useUpdateDocumentMutation();

  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (document && isEditing) {
      setEditTitle(document.title);
      // Strip HTML tags for editing
      const text = document.body
        .replace(/<[^>]*>/g, '\n')
        .replace(/\n\n+/g, '\n')
        .trim();
      setEditBody(text);
    }
  }, [document, isEditing]);

  const handleEdit = () => {
    dispatch(setIsEditingDocument(true));
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!confirm('Discard unsaved changes?')) return;
    }
    dispatch(setIsEditingDocument(false));
    dispatch(setUnsavedChanges(false));
  };

  const handleSave = async () => {
    if (!document) return;

    try {
      // Convert plain text back to HTML paragraphs
      const htmlBody = editBody
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => `<p>${line}</p>`)
        .join('');

      await updateDocument({
        id: document.id,
        title: editTitle,
        body: htmlBody,
        snippet: editBody.substring(0, 60) + '...',
      }).unwrap();

      dispatch(setIsEditingDocument(false));
      dispatch(setUnsavedChanges(false));
      dispatch(
        addToast({ message: 'Document saved successfully', type: 'success' })
      );
    } catch (error) {
      dispatch(addToast({ message: 'Failed to save document', type: 'error' }));
      console.error('Save error:', error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTitle(e.target.value);
    dispatch(setUnsavedChanges(true));
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditBody(e.target.value);
    dispatch(setUnsavedChanges(true));
  };

  if (!selectedDocumentId) {
    return (
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
        <h3>No document selected</h3>
        <p>Select a document from the list to view its contents</p>
      </div>
    );
  }

  if (isLoading || !document) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonMeta}></div>
          <div className={styles.skeletonBody}></div>
          <div className={styles.skeletonBody}></div>
          <div className={styles.skeletonBody}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {isEditing ? (
          <textarea
            ref={titleRef}
            className={styles.titleEdit}
            value={editTitle}
            onChange={handleTitleChange}
            rows={2}
          />
        ) : (
          <h2>{document.title}</h2>
        )}
        <div className={styles.meta}>
          {document.author} • Updated{' '}
          {formatRelativeTime(new Date(document.updatedAt))} •{' '}
          <Badge status={document.status} />
        </div>
      </div>

      <div className={styles.body}>
        {isEditing ? (
          <textarea
            ref={bodyRef}
            className={styles.bodyEdit}
            value={editBody}
            onChange={handleBodyChange}
            rows={20}
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: document.body }} />
        )}
      </div>

      <div className={styles.footer}>
        {isEditing ? (
          <>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isUpdating || !hasUnsavedChanges}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={handleEdit}>
              Edit Document
            </Button>
            <Button variant="secondary">Share</Button>
          </>
        )}
      </div>
    </div>
  );
}
