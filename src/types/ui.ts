// UI state types
export type PageType =
  | 'dashboard'
  | 'documents'
  | 'collections'
  | 'activity'
  | 'search'
  | 'settings'
  | 'help';

export interface UIState {
  currentPage: PageType;
  sidebarCollapsed: boolean;
  searchQuery: string;
  hasUnsavedChanges: boolean;
}

// Toast notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
