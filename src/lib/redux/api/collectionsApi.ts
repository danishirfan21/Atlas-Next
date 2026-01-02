import { apiSlice } from './apiSlice';
import type { Collection } from '@/types';
import {
  mergeCollections,
  getLocalCollection,
  createLocalCollection,
  updateLocalCollection,
  deleteLocalCollection,
} from '@/lib/utils/collectionService';

export const collectionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<Collection[], void>({
      query: () => '/collections',

      // 🎯 MERGE localStorage collections with GitHub collections
      transformResponse: (response: Collection[]) => {
        console.log('🔄 Collections API - merging collections...');

        // Merge GitHub collections with localStorage
        const mergedCollections = mergeCollections(response);

        // Sort by most recently updated (already done in mergeCollections)
        mergedCollections.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        return mergedCollections;
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Collection' as const, id })),
              { type: 'Collection', id: 'LIST' },
            ]
          : [{ type: 'Collection', id: 'LIST' }],
    }),

    getCollection: builder.query<Collection, number>({
      // 🎯 Check localStorage first, fallback to API
      async queryFn(id, _queryApi, _extraOptions, fetchWithBQ) {
        // 1. Check localStorage first
        const localCollection = getLocalCollection(id);
        if (localCollection) {
          return { data: localCollection };
        }

        // 2. Fallback to API
        const result = await fetchWithBQ(`/collections/${id}`);

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data as Collection };
      },

      providesTags: (result, error, id) => [{ type: 'Collection', id }],
    }),

    createCollection: builder.mutation<Collection, Partial<Collection>>({
      async queryFn(newCollection) {
        console.log('✨ Creating collection:', newCollection.name);

        try {
          // Create in localStorage
          const createdCollection = createLocalCollection(newCollection);

          // Return the created collection
          return { data: createdCollection };
        } catch (error: any) {
          console.error('❌ Failed to create collection:', error);
          return {
            error: {
              status: 500,
              data: { error: error.message || 'Failed to create collection' },
            },
          };
        }
      },

      // Invalidate cache to trigger refetch (which will merge localStorage)
      invalidatesTags: [{ type: 'Collection', id: 'LIST' }],
    }),

    updateCollection: builder.mutation<
      Collection,
      { id: number } & Partial<Collection>
    >({
      async queryFn({ id, ...updates }) {
        console.log('📝 Updating collection:', id);

        try {
          // Update in localStorage
          const updatedCollection = updateLocalCollection(id, updates);

          if (!updatedCollection) {
            return {
              error: {
                status: 404,
                data: { error: 'Collection not found' },
              },
            };
          }

          // Return the updated collection
          return { data: updatedCollection };
        } catch (error: any) {
          console.error('❌ Failed to update collection:', error);
          return {
            error: {
              status: 500,
              data: { error: error.message || 'Failed to update collection' },
            },
          };
        }
      },

      // Invalidate cache to trigger refetch
      invalidatesTags: (result, error, { id }) => [
        { type: 'Collection', id },
        { type: 'Collection', id: 'LIST' },
      ],
    }),

    deleteCollection: builder.mutation<{ success: boolean }, number>({
      async queryFn(id) {
        console.log('🗑️ Deleting collection:', id);

        try {
          // Delete from localStorage
          const success = deleteLocalCollection(id);

          if (!success) {
            return {
              error: {
                status: 404,
                data: { error: 'Collection not found' },
              },
            };
          }

          // Return success
          return { data: { success: true } };
        } catch (error: any) {
          console.error('❌ Failed to delete collection:', error);
          return {
            error: {
              status: 500,
              data: { error: error.message || 'Failed to delete collection' },
            },
          };
        }
      },

      // Invalidate cache to trigger refetch
      invalidatesTags: [{ type: 'Collection', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionsApi;
