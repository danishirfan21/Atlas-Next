'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setSearchQuery } from '@/lib/redux/slices/uiSlice';
import { debounce } from '@/lib/utils/helpers';
import styles from './Topbar.module.css';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { capitalizeFirst } from '@/lib/utils/helpers';

/**
 * Topbar Component
 * 
 * Top navigation bar with:
 * - Breadcrumb showing current page
 * - Debounced global search (300ms)
 * - Refresh button
 * - Primary action button (context-aware)
 * - User avatar
 */

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const globalSearchQuery = useAppSelector((state) => state.ui.searchQuery);
  
  const [localSearchQuery, setLocalSearchQuery] = useState(globalSearchQuery);
  
  // Get page name from pathname
  const pageName = pathname === '/' 
    ? 'Dashboard' 
    : capitalizeFirst(pathname.slice(1));

  const handleRefresh = () => {
    window.location.reload();
  };

  const handlePrimaryAction = () => {
    // Context-aware action based on current page
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

  // Memoized debounced search function (only recreates if dispatch changes)
  const debouncedDispatch = useMemo(
    () => debounce((value: string) => {
      dispatch(setSearchQuery(value));
    }, 300),
    [dispatch]
  );

  // Optimized search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    debouncedDispatch(value);
  }, [debouncedDispatch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearchQuery));
    
    // Navigate to search page if not already there
    if (pathname !== '/search') {
      router.push('/search');
    }
  };

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
        <span className={styles.searchShortcut}>⌘K</span>
      </form>

      <div className={styles.actions}>
        <Button variant="icon" onClick={handleRefresh}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>Refresh</span>
        </Button>

        <Button variant="primary" onClick={handlePrimaryAction}>
          + New {pathname === '/collections' ? 'Collection' : 'Document'}
        </Button>

        <Avatar initials="DK" size="sm" />
      </div>
    </header>
  );
}