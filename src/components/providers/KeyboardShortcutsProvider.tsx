'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

/**
 * Global keyboard shortcuts provider
 *
 * Shortcuts:
 * - Cmd/Ctrl + K: Focus search
 * - Cmd/Ctrl + N: New document
 * - Escape: Close modals/cancel edit
 */

export function KeyboardShortcutsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useKeyboardShortcuts([
    // Cmd/Ctrl + K: Focus search
    {
      key: 'k',
      meta: true,
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Search"]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          router.push('/search');
        }
      },
    },

    // Cmd/Ctrl + N: New document/collection
    {
      key: 'n',
      meta: true,
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        if (pathname === '/collections') {
          window.dispatchEvent(new CustomEvent('openNewCollectionModal'));
        } else {
          window.dispatchEvent(new CustomEvent('openNewDocumentModal'));
        }
      },
    },
  ]);

  return <>{children}</>;
}
