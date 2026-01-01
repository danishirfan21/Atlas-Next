'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/redux/hooks';
import styles from './Topbar.module.css';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { capitalizeFirst } from '@/lib/utils/helpers';

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const reduxSearchQuery = useAppSelector((state) => state.ui.searchQuery);
  const userInitials = useAppSelector((state) => state.ui.userProfile.initials);

  const [localSearchQuery, setLocalSearchQuery] = useState('');

  useEffect(() => {
    if (pathname === '/search') {
      setLocalSearchQuery(reduxSearchQuery);
    } else {
      setLocalSearchQuery('');
    }
  }, [pathname, reduxSearchQuery]);

  const pageName =
    pathname === '/' ? 'Dashboard' : capitalizeFirst(pathname.slice(1));

  const handleRefresh = () => {
    window.location.reload();
  };

  const handlePrimaryAction = () => {
    if (pathname === '/documents') {
      const event = new CustomEvent('openNewDocumentModal');
      window.dispatchEvent(event);
    } else if (pathname === '/collections') {
      const event = new CustomEvent('openNewCollectionModal');
      window.dispatchEvent(event);
    } else {
      router.push('/documents');
    }
  };

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearchQuery(e.target.value);
    },
    []
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = localSearchQuery.trim();

    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/search');
    }
  };

  const handleClear = useCallback(() => {
    setLocalSearchQuery('');
  }, []);

  const handleAvatarClick = useCallback(() => {
    router.push('/settings');
  }, [router]);

  return (
    <header className={styles.topbar}>
      <div className={styles.breadcrumb}>
        Workspace / <span className={styles.activeCrumb}>{pageName}</span>
      </div>

      <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
        <svg
          className={styles.searchIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search documents..."
          className={styles.searchInput}
          value={localSearchQuery}
          onChange={handleSearchChange}
        />
        {localSearchQuery && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
        )}
        <span className={styles.searchShortcut}>⌘K</span>
      </form>

      <div className={styles.actions}>
        <Button variant="icon" onClick={handleRefresh}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>Refresh</span>
        </Button>

        <Button variant="primary" onClick={handlePrimaryAction}>
          + New {pathname === '/collections' ? 'Collection' : 'Document'}
        </Button>

        <div
          onClick={handleAvatarClick}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAvatarClick();
            }
          }}
          aria-label="Open settings"
          title="Settings"
        >
          <Avatar initials={userInitials} size="sm" />
        </div>
      </div>
    </header>
  );
}
