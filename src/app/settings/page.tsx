'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setViewPreference,
  toggleDocumentsViewMode,
  addToast,
} from '@/lib/redux/slices/uiSlice';
import { clearPersistedState } from '@/lib/utils/persistence';
import { Card, Button } from '@/components/ui';
import styles from './page.module.css';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const viewPreferences = useAppSelector((state) => state.ui.viewPreferences);
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

    // Reload page to reset state
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your Atlas preferences</p>
      </div>

      <Card className={styles.cardSection}>
        <h2 className={styles.sectionTitle}>View Preferences</h2>

        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <h3>Documents View Mode</h3>
            <p>Choose how documents are displayed in the list</p>
          </div>
          <div className={styles.settingControl}>
            <Button
              variant={
                viewPreferences.documentsViewMode === 'list'
                  ? 'primary'
                  : 'secondary'
              }
              onClick={() => dispatch(toggleDocumentsViewMode())}
            >
              {viewPreferences.documentsViewMode === 'list'
                ? 'List View'
                : 'Grid View'}
            </Button>
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
