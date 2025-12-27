import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  UIState,
  PageType,
  Toast,
  FilterOption,
  SortOption,
} from '@/types';

/**
 * UI Slice - Manages global UI state
 *
 * Why Redux for UI state?
 * - Centralized state accessible from any component
 * - Time-travel debugging with Redux DevTools
 * - Predictable state updates via actions
 * - Persisted to localStorage for continuity
 */

// Load persisted state from localStorage
const loadPersistedState = () => {
  if (typeof window === 'undefined') return {};

  try {
    const saved = localStorage.getItem('atlas_ui_state');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const persistedState = loadPersistedState();

interface ExtendedUIState extends UIState {
  toasts: Toast[];
  selectedDocumentId: number | null;
  documentFilters: {
    status: FilterOption;
    sort: SortOption;
  };
  isEditingDocument: boolean;
}

const initialState: ExtendedUIState = {
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  searchQuery: '',
  hasUnsavedChanges: false,
  toasts: [],
  selectedDocumentId: persistedState.selectedDocumentId || null,
  documentFilters: persistedState.documentFilters || {
    status: 'all',
    sort: 'recent',
  },
  isEditingDocument: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<PageType>) => {
      state.currentPage = action.payload;
    },

    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
    },

    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      state.toasts.push({ ...action.payload, id });
    },

    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },

    // Documents-specific actions
    setSelectedDocumentId: (state, action: PayloadAction<number | null>) => {
      state.selectedDocumentId = action.payload;
      state.isEditingDocument = false;
      state.hasUnsavedChanges = false;

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          const current = localStorage.getItem('atlas_ui_state');
          const data = current ? JSON.parse(current) : {};
          localStorage.setItem(
            'atlas_ui_state',
            JSON.stringify({
              ...data,
              selectedDocumentId: action.payload,
            })
          );
        } catch {}
      }
    },

    setDocumentFilters: (
      state,
      action: PayloadAction<{ status?: FilterOption; sort?: SortOption }>
    ) => {
      if (action.payload.status !== undefined) {
        state.documentFilters.status = action.payload.status;
      }
      if (action.payload.sort !== undefined) {
        state.documentFilters.sort = action.payload.sort;
      }

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          const current = localStorage.getItem('atlas_ui_state');
          const data = current ? JSON.parse(current) : {};
          localStorage.setItem(
            'atlas_ui_state',
            JSON.stringify({
              ...data,
              documentFilters: state.documentFilters,
            })
          );
        } catch {}
      }
    },

    setIsEditingDocument: (state, action: PayloadAction<boolean>) => {
      state.isEditingDocument = action.payload;
      if (!action.payload) {
        state.hasUnsavedChanges = false;
      }
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
  setSelectedDocumentId,
  setDocumentFilters,
  setIsEditingDocument,
} = uiSlice.actions;

export default uiSlice.reducer;
