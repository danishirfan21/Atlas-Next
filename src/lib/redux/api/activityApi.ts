import { apiSlice } from './apiSlice';
import type { ActivityItem } from '@/types';

export const activityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivity: builder.query<ActivityItem[], { type?: string }>({
      query: ({ type = 'all' } = {}) => {
        const params = new URLSearchParams();
        if (type !== 'all') params.append('type', type);
        return `/activity?${params.toString()}`;
      },
      providesTags: (result, error, { type }) => [
        { type: 'Activity', id: type || 'all' },
      ],
    }),
  }),
});

export const { useGetActivityQuery } = activityApi;
