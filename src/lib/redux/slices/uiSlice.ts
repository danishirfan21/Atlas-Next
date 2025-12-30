import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  UIState,
  PageType,
  Toast,
  FilterOption,
  SortOption,
} from '@/types';
import {
  savePersistedState,
} from '@/lib/utils/persistence';
import type { PersistedState } from '@/lib/utils/persistence';

/**
 * UI Slice - Manages global UI state
 *
 * Features:
 * - Centralized state accessible from any component
 * - Time-travel debugging with Redux DevTools
 * - Predictable state updates via actions
 * - Persisted to localStorage for continuity
 */

interface ExtendedUIState extends UIState {
  toasts: Toast[];
  selectedDocumentId: number | null;
  documentFilters: {
    status: FilterOption;
    sort: SortOption;
  };
  isEditingDocument: boolean;
  selectedCollectionId: number | null;
  searchFilters: {
    status: string;
    author: string;
    dateFrom: string;
    dateTo: string;
  };
  documentsPagination: {
    page: number;
    limit: number;
  };
  viewPreferences: {
    documentsViewMode: 'list' | 'grid';
    theme: 'light' | 'dark';
  };
}

const initialState: ExtendedUIState = {
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  searchQuery: '',
  hasUnsavedChanges: false,
  toasts: [],
  selectedDocumentId: null,
  documentFilters: {
    status: 'all',
    sort: 'recent',
  },
  isEditingDocument: false,
  selectedCollectionId: null,
  searchFilters: {
    status: 'all',
    author: 'all',
    dateFrom: '',
    dateTo: '',
  },
  documentsPagination: {
    page: 1,
    limit: 10,
  },
  viewPreferences: {
    documentsViewMode: 'list',
    theme: 'light',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    rehydrateUiState: (
      state,
      action: PayloadAction<PersistedState>
    ) => {
      const persisted = action.payload;

      if (persisted.sidebarCollapsed !== undefined) {
        state.sidebarCollapsed = persisted.sidebarCollapsed;
      }

      if (persisted.selectedDocumentId !== undefined) {
        state.selectedDocumentId = persisted.selectedDocumentId;
      }

      if (persisted.selectedCollectionId !== undefined) {
        state.selectedCollectionId = persisted.selectedCollectionId;
      }

      if (persisted.documentFilters !== undefined) {
        state.documentFilters = {
          ...state.documentFilters,
          ...persisted.documentFilters,
        };
      }

      if (persisted.viewPreferences !== undefined) {
        state.viewPreferences = {
          ...state.viewPreferences,
          ...persisted.viewPreferences,
        };
      }
    },

    setCurrentPage: (state, action: PayloadAction<PageType>) => {
      state.currentPage = action.payload;
    },

    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;

      // Persist to localStorage
      savePersistedState({ sidebarCollapsed: state.sidebarCollapsed });
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
      savePersistedState({ selectedDocumentId: action.payload });
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
      savePersistedState({ documentFilters: state.documentFilters });
    },

    setIsEditingDocument: (state, action: PayloadAction<boolean>) => {
      state.isEditingDocument = action.payload;
      if (!action.payload) {
        state.hasUnsavedChanges = false;
      }
    },

    setSelectedCollectionId: (state, action: PayloadAction<number | null>) => {
      state.selectedCollectionId = action.payload;

      // Persist to localStorage
      savePersistedState({ selectedCollectionId: action.payload });
    },

    setSearchFilters: (
      state,
      action: PayloadAction<
        Partial<{
          status: string;
          author: string;
          dateFrom: string;
          dateTo: string;
        }>
      >
    ) => {
      state.searchFilters = {
        ...state.searchFilters,
        ...action.payload,
      };
    },

    resetSearchFilters: (state) => {
      state.searchFilters = {
        status: 'all',
        author: 'all',
        dateFrom: '',
        dateTo: '',
      };
    },

    setDocumentsPage: (state, action: PayloadAction<number>) => {
      state.documentsPagination.page = action.payload;
    },

    resetDocumentsPage: (state) => {
      state.documentsPagination.page = 1;
    },

    // View preferences
    setViewPreference: (
      state,
      action: PayloadAction<{
        key: keyof ExtendedUIState['viewPreferences'];
        value: string;
      }>
    ) => {
      const { key, value } = action.payload;
      (state.viewPreferences as any)[key] = value;

      // Persist to localStorage
      savePersistedState({ viewPreferences: state.viewPreferences });
    },

    toggleDocumentsViewMode: (state) => {
      state.viewPreferences.documentsViewMode =
        state.viewPreferences.documentsViewMode === 'list' ? 'grid' : 'list';

      // Persist to localStorage
      savePersistedState({ viewPreferences: state.viewPreferences });
    },
  },
});

export const {
  rehydrateUiState,
  setCurrentPage,
  toggleSidebar,
  setSearchQuery,
  setUnsavedChanges,
  addToast,
  removeToast,
  setSelectedDocumentId,
  setDocumentFilters,
  setIsEditingDocument,
  setSelectedCollectionId,
  setSearchFilters,
  resetSearchFilters,
  setDocumentsPage,
  resetDocumentsPage,
  setViewPreference,
  toggleDocumentsViewMode,
} = uiSlice.actions;

export default uiSlice.reducer;
