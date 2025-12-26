import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query API Slice - Base configuration
 * 
 * Why RTK Query?
 * - Automatic caching (no manual cache management)
 * - Automatic refetching on focus/network reconnect
 * - Built-in loading/error states
 * - Optimistic updates support
 * - Request deduplication
 * 
 * Current setup uses mock API. In production:
 * 1. Replace BASE_URL with real API
 * 2. Add authentication headers
 * 3. Add error handling middleware
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // Future: Add auth headers here
    // prepareHeaders: (headers, { getState }) => {
    //   const token = (getState() as RootState).auth.token;
    //   if (token) {
    //     headers.set('authorization', `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),

  /**
   * Tag types for cache invalidation
   * When we mutate a 'Document', we can invalidate all queries tagged with 'Document'
   */
  tagTypes: ['Document', 'Collection', 'Activity', 'Settings'],

  /**
   * Endpoints will be injected here via code splitting
   * Example: documentsApi.ts will inject document endpoints
   */
  endpoints: () => ({}),
});

// Export hooks for usage in components (will be auto-generated per endpoint)
// Example: useGetDocumentsQuery, useCreateDocumentMutation
