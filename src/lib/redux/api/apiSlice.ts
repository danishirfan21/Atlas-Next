import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query API Slice
 *
 * Base configuration for all API endpoints
 * Tag-based cache invalidation
 */

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Document', 'Collection', 'Activity', 'Search'],
  endpoints: () => ({}),
});