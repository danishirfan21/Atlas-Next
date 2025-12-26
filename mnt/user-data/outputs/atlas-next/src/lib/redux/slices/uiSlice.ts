import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState, PageType, Toast } from '@/types';

/**
 * UI Slice - Manages global UI state
 * 
 * Why Redux for UI state?
 * - Centralized state accessible from any component
 * - Time-travel debugging with Redux DevTools
 * - Predictable state updates via actions
 */

const initialState: UIState & { toasts: Toast[] } = {
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  searchQuery: '',
  hasUnsavedChanges: false,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Set current active page
     */
    setCurrentPage: (state, action: PayloadAction<PageType>) => {
      state.currentPage = action.payload;
    },

    /**
     * Toggle sidebar collapsed state (for mobile/responsive)
     */
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    /**
     * Set search query (synced across app)
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    /**
     * Track unsaved changes (warn before navigation)
     */
    setUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
    },

    /**
     * Add toast notification
     */
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      state.toasts.push({ ...action.payload, id });
    },

    /**
     * Remove toast notification
     */
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const {
  setCurrentPage,
  toggleSidebar,
  setSearchQuery,
  setUnsavedChanges,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
