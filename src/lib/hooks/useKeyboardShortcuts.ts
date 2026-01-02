import { useEffect, useCallback } from 'react';

/**
 * Keyboard shortcuts hook
 * Handles global keyboard navigation and shortcuts
 */

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: (e: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutHandler[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (!e.key) continue; // Skip if key is undefined
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? e.ctrlKey : true;
        const metaMatches = shortcut.meta ? e.metaKey : true;
        const shiftMatches = shortcut.shift ? e.shiftKey : true;

        if (keyMatches && ctrlMatches && metaMatches && shiftMatches) {
          shortcut.handler(e);
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Common keyboard shortcuts
 */
export const SHORTCUTS = {
  SEARCH: { key: 'k', meta: true, ctrl: true },
  NEW_DOCUMENT: { key: 'n', meta: true, ctrl: true },
  SAVE: { key: 's', meta: true, ctrl: true },
  ESCAPE: { key: 'Escape' },
  CLOSE: { key: 'Escape' },
};
