import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query API Slice
 *
 * Base configuration for all API endpoints
 * - Tag-based cache invalidation
 * - Request deduplication (automatic)
 * - Configurable cache times
 */

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Document', 'Collection', 'Activity', 'Search'],

  // Cache configuration
  keepUnusedDataFor: 60, // Cache data for 60 seconds after last use
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  refetchOnFocus: true, // Refetch when window regains focus
  refetchOnReconnect: true, // Refetch when reconnecting to internet

  endpoints: () => ({}),
});
