import { apiSlice } from './apiSlice';
import type { Collection } from '@/types';

export const collectionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<Collection[], void>({
      query: () => '/collections',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Collection' as const, id })),
              { type: 'Collection', id: 'LIST' },
            ]
          : [{ type: 'Collection', id: 'LIST' }],
    }),

    getCollection: builder.query<Collection, number>({
      query: (id) => `/collections/${id}`,
      providesTags: (result, error, id) => [{ type: 'Collection', id }],
    }),

    createCollection: builder.mutation<Collection, Partial<Collection>>({
      query: (body) => ({
        url: '/collections',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Collection', id: 'LIST' }],
      // Optimistic update
      async onQueryStarted(newCollection, { dispatch, queryFulfilled }) {
        // Optimistically add collection to cache
        const patchResult = dispatch(
          collectionsApi.util.updateQueryData(
            'getCollections',
            undefined,
            (draft) => {
              // Create optimistic collection
              const optimisticCollection: Collection = {
                id: Date.now(), // Temporary ID
                name: newCollection.name || 'Untitled Collection',
                description: newCollection.description || '',
                icon: newCollection.icon || '📁',
                iconBg:
                  newCollection.iconBg ||
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                documentCount: 0,
                contributorCount: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              draft.push(optimisticCollection);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
    }),

    updateCollection: builder.mutation<
      Collection,
      { id: number } & Partial<Collection>
    >({
      query: ({ id, ...patch }) => ({
        url: `/collections/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Collection', id },
        { type: 'Collection', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Update individual collection cache
        const patchResult1 = dispatch(
          collectionsApi.util.updateQueryData('getCollection', id, (draft) => {
            Object.assign(draft, patch);
            draft.updatedAt = new Date();
          })
        );

        // Update collection in list cache
        const patchResult2 = dispatch(
          collectionsApi.util.updateQueryData(
            'getCollections',
            undefined,
            (draft) => {
              const collection = draft.find((c) => c.id === id);
              if (collection) {
                Object.assign(collection, patch);
                collection.updatedAt = new Date();
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback both patches on error
          patchResult1.undo();
          patchResult2.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
} = collectionsApi;
