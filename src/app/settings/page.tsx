'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setViewPreference,
  toggleDocumentsViewMode,
  setUserProfile,
  addToast,
} from '@/lib/redux/slices/uiSlice';
import { clearPersistedState } from '@/lib/utils/persistence';
import { Card, Button, Avatar } from '@/components/ui';
import styles from './page.module.css';

const AVATAR_OPTIONS = [
  'DK',
  'JD',
  'AM',
  'SC',
  'MR',
  'EW',
  'RK',
  'DP',
  'AB',
  'CD',
  'EF',
  'GH',
];

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const viewPreferences = useAppSelector((state) => state.ui.viewPreferences);
  const userProfile = useAppSelector((state) => state.ui.userProfile);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearState = () => {
    clearPersistedState();
    dispatch(
      addToast({
        message: 'All saved preferences cleared. Refresh to reset.',
        type: 'success',
      })
    );
    setShowConfirm(false);

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleAvatarChange = (initials: string) => {
    dispatch(setUserProfile({ initials }));
    dispatch(
      addToast({
        message: 'Avatar updated',
        type: 'success',
      })
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your Atlas preferences</p>
      </div>

      {/* Profile Section */}
      <Card className={styles.cardSection}>
        <h2 className={styles.sectionTitle}>Profile</h2>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <h3>Avatar</h3>
            <p>Choose your profile avatar initials</p>
          </div>
        </div>

        {/* IMPROVED: Always-visible avatar grid with inline preview */}
        <div className={styles.avatarSection}>
          {/* Large preview - updates instantly */}
          <div className={styles.avatarPreview}>
            <Avatar initials={userProfile.initials} size="lg" />
            <span className={styles.avatarPreviewLabel}>Current Avatar</span>
          </div>

          {/* Always-visible grid - no toggle needed */}
          <div className={styles.avatarGrid}>
            {AVATAR_OPTIONS.map((initials) => (
              <button
                key={initials}
                className={`${styles.avatarOption} ${
                  userProfile.initials === initials
                    ? styles.avatarOptionActive
                    : ''
                }`}
                onClick={() => handleAvatarChange(initials)}
              >
                <Avatar initials={initials} size="md" />
                <span className={styles.avatarLabel}>{initials}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className={styles.cardSection}>
        <h2 className={styles.sectionTitle}>View Preferences</h2>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <h3>Documents View Mode</h3>
            <p>Choose how documents are displayed in the list</p>
          </div>
          <div className={styles.settingControl}>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleOption} ${
                  viewPreferences.documentsViewMode === 'list'
                    ? styles.toggleOptionActive
                    : ''
                }`}
                onClick={() => {
                  if (viewPreferences.documentsViewMode !== 'list') {
                    dispatch(toggleDocumentsViewMode());
                    dispatch(
                      addToast({
                        message: 'Switched to List View',
                        type: 'success',
                      })
                    );
                  }
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                List
              </button>
              <button
                className={`${styles.toggleOption} ${
                  viewPreferences.documentsViewMode === 'grid'
                    ? styles.toggleOptionActive
                    : ''
                }`}
                onClick={() => {
                  if (viewPreferences.documentsViewMode !== 'grid') {
                    dispatch(toggleDocumentsViewMode());
                    dispatch(
                      addToast({
                        message: 'Switched to Grid View',
                        type: 'success',
                      })
                    );
                  }
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Grid
              </button>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <h3>Theme</h3>
            <p>Choose your interface theme (coming soon)</p>
          </div>
          <div className={styles.settingControl}>
            <select
              className={styles.select}
              value={viewPreferences.theme}
              disabled
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className={styles.sectionTitle}>Data & Storage</h2>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <h3>Clear Saved Preferences</h3>
            <p>
              Reset all saved preferences including selected documents, filters,
              and view settings. This will reload the page.
            </p>
          </div>
          <div className={styles.settingControl}>
            {showConfirm ? (
              <div className={styles.confirmButtons}>
                <Button variant="primary" onClick={handleClearState}>
                  Yes, Clear All
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="secondary" onClick={() => setShowConfirm(true)}>
                Clear Preferences
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
