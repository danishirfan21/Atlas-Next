'use client';

import React, { useState, useEffect } from 'react';
import { useCreateCollectionMutation } from '@/lib/redux/api/collectionsApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedCollectionId, addToast } from '@/lib/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button/Button';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import styles from './CreateCollectionModal.module.css';

interface CreateCollectionModalProps {
  onClose: () => void;
}

const ICON_OPTIONS = [
  '📁',
  '📚',
  '⭐',
  '🎨',
  '👥',
  '💼',
  '⚖️',
  '🔧',
  '💡',
  '🎯',
];
const GRADIENT_OPTIONS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

export function CreateCollectionModal({ onClose }: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_OPTIONS[0]);

  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const dispatch = useAppDispatch();

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

    if (!name.trim()) {
      dispatch(
        addToast({ message: 'Please enter a collection name', type: 'warning' })
      );
      return;
    }

    try {
      const newCollection = await createCollection({
        name: name.trim(),
        description: description.trim(),
        icon: selectedIcon,
        iconBg: selectedGradient,
      }).unwrap();

      dispatch(setSelectedCollectionId(newCollection.id));
      dispatch(
        addToast({
          message: 'Collection created successfully',
          type: 'success',
        })
      );
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.data?.error || error?.error || 'Failed to create collection';
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
      aria-labelledby="collection-modal-title"
    >
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="collection-modal-title">New Collection</h2>
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
              <label htmlFor="collection-name">Collection Name</label>
              <input
                id="collection-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name..."
                autoFocus
                aria-required="true"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="collection-description">Description</label>
              <textarea
                id="collection-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label id="icon-label">Icon</label>
              <div
                className={styles.iconGrid}
                role="radiogroup"
                aria-labelledby="icon-label"
              >
                {ICON_OPTIONS.map((icon, idx) => (
                  <button
                    key={icon}
                    type="button"
                    role="radio"
                    aria-checked={icon === selectedIcon}
                    className={`${styles.iconOption} ${
                      icon === selectedIcon ? styles.selectedIcon : ''
                    }`}
                    onClick={() => setSelectedIcon(icon)}
                    aria-label={`Icon option ${idx + 1}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label id="color-label">Color</label>
              <div
                className={styles.gradientGrid}
                role="radiogroup"
                aria-labelledby="color-label"
              >
                {GRADIENT_OPTIONS.map((gradient, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="radio"
                    aria-checked={gradient === selectedGradient}
                    className={`${styles.gradientOption} ${
                      gradient === selectedGradient
                        ? styles.selectedGradient
                        : ''
                    }`}
                    style={{ background: gradient }}
                    onClick={() => setSelectedGradient(gradient)}
                    aria-label={`Color option ${idx + 1}`}
                  />
                ))}
              </div>
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
              {isLoading ? 'Creating...' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
