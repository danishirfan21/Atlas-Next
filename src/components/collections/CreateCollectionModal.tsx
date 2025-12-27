'use client';

import React, { useState } from 'react';
import { useCreateCollectionMutation } from '@/lib/redux/api/collectionsApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedCollectionId, addToast } from '@/lib/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button/Button';
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
      dispatch(addToast({ message: 'Collection created', type: 'success' }));
      onClose();
    } catch (error) {
      dispatch(
        addToast({ message: 'Failed to create collection', type: 'error' })
      );
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>New Collection</h2>
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
              <label>Collection Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name..."
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Icon</label>
              <div className={styles.iconGrid}>
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`${styles.iconOption} ${
                      icon === selectedIcon ? styles.selectedIcon : ''
                    }`}
                    onClick={() => setSelectedIcon(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Color</label>
              <div className={styles.gradientGrid}>
                {GRADIENT_OPTIONS.map((gradient, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.gradientOption} ${
                      gradient === selectedGradient
                        ? styles.selectedGradient
                        : ''
                    }`}
                    style={{ background: gradient }}
                    onClick={() => setSelectedGradient(gradient)}
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
