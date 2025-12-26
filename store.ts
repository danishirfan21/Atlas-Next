import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { uiReducer } from './slices';
import { apiSlice } from './api/apiSlice';

/**
 * Redux Store Configuration
 * 
 * Architecture decisions:
 * 1. RTK Query middleware for automatic cache management
 * 2. setupListeners for refetch on focus/reconnect
 * 3. Future: Add redux-persist for localStorage sync
 * 
 * Store structure:
 * - ui: Global UI state (sidebar, modals, toasts)
 * - api: RTK Query cache (documents, collections, etc.)
 * - Future slices: auth, user, settings
 */

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      // UI state slice
      ui: uiReducer,
      
      // RTK Query API slice (auto-generated reducers)
      [apiSlice.reducerPath]: apiSlice.reducer,
      
      // Future slices will be added here
      // auth: authReducer,
      // settings: settingsReducer,
    },

    // Add RTK Query middleware for caching, invalidation, polling, etc.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),

    // Enable Redux DevTools in development
    devTools: process.env.NODE_ENV !== 'production',
  });

  // Setup listeners for refetchOnFocus and refetchOnReconnect
  setupListeners(store.dispatch);

  return store;
};

// Create store instance
export const store = makeStore();

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
