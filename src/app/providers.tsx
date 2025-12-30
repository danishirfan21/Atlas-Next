'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { loadPersistedState } from '@/lib/utils/persistence';
import { rehydrateUiState } from '@/lib/redux/slices/uiSlice';

/**
 * Redux Provider Wrapper
 * 
 * Why separate component?
 * - Next.js app router requires 'use client' for Redux Provider
 * - Keeps root layout as server component
 * - Wraps only the parts that need client-side state
 */

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const persisted = loadPersistedState();
    store.dispatch(rehydrateUiState(persisted));
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
