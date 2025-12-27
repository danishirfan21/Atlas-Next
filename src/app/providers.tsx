'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';

/**
 * Redux Provider Wrapper
 * 
 * Why separate component?
 * - Next.js app router requires 'use client' for Redux Provider
 * - Keeps root layout as server component
 * - Wraps only the parts that need client-side state
 */

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
