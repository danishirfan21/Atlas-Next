import { apiSlice } from './apiSlice';
import type { ActivityItem } from '@/types';
import { mergeActivities, filterActivities } from '@/lib/utils/activityService';

export const activityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivity: builder.query<ActivityItem[], { type?: string }>({
      query: ({ type = 'all' } = {}) => {
        const params = new URLSearchParams();
        if (type !== 'all') params.append('type', type);
        return `/activity?${params.toString()}`;
      },

      // 🎯 MERGE localStorage activities with GitHub activities
      transformResponse: (response: ActivityItem[], _meta, arg) => {
        console.log('🔄 Activity API - merging activities...');

        // Merge GitHub activities with localStorage
        const mergedActivities = mergeActivities(response);

        // Apply filter if needed
        const filteredActivities = filterActivities(
          mergedActivities,
          arg.type || 'all'
        );

        return filteredActivities;
      },

      providesTags: (result, error, { type }) => [
        { type: 'Activity', id: type || 'all' },
      ],
    }),
  }),
});

export const { useGetActivityQuery } = activityApi;
