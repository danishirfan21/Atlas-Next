/**
 * LocalStorage Persistence Utilities
 *
 * Safe localStorage operations with error handling
 * Automatic JSON serialization/deserialization
 */

import type { FilterOption, SortOption } from '@/types';

const STORAGE_KEY = 'atlas_ui_state';

export interface PersistedState {
  selectedDocumentId?: number | null;
  selectedCollectionId?: number | null;
  documentFilters?: {
    status: FilterOption;
    sort: SortOption;
  };
  sidebarCollapsed?: boolean;
  viewPreferences?: {
    documentsViewMode?: 'list' | 'grid';
    theme?: 'light' | 'dark';
  };
  userProfile?: {
    initials?: string;
  };
}

/**
 * Load persisted state from localStorage
 */
export function loadPersistedState(): PersistedState {
  if (typeof window === 'undefined') return {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn('Failed to load persisted state:', error);
    return {};
  }
}

/**
 * Save state to localStorage
 */
export function savePersistedState(state: PersistedState): void {
  if (typeof window === 'undefined') return;

  try {
    const current = loadPersistedState();
    const updated = { ...current, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save persisted state:', error);
  }
}

/**
 * Clear all persisted state
 */
export function clearPersistedState(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear persisted state:', error);
  }
}

/**
 * Get a specific value from persisted state
 */
export function getPersistedValue<K extends keyof PersistedState>(
  key: K
): PersistedState[K] | undefined {
  const state = loadPersistedState();
  return state[key];
}

/**
 * Set a specific value in persisted state
 */
export function setPersistedValue<K extends keyof PersistedState>(
  key: K,
  value: PersistedState[K]
): void {
  savePersistedState({ [key]: value });
}
