import { apiSlice } from './apiSlice';
import type { Document, PaginatedDocumentsResponse } from '@/types';

export const documentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<
      PaginatedDocumentsResponse,
      {
        status?: string;
        sort?: string;
        q?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({
        status = 'all',
        sort = 'recent',
        q = '',
        page = 1,
        limit = 10,
      } = {}) => {
        const params = new URLSearchParams();
        if (status !== 'all') params.append('status', status);
        if (sort) params.append('sort', sort);
        if (q) params.append('q', q);
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `/documents?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.documents.map(({ id }) => ({
                type: 'Document' as const,
                id,
              })),
              { type: 'Document', id: 'LIST' },
            ]
          : [{ type: 'Document', id: 'LIST' }],
    }),

    getDocument: builder.query<Document, number>({
      query: (id) => `/documents/${id}`,
      providesTags: (result, error, id) => [{ type: 'Document', id }],
    }),

    createDocument: builder.mutation<Document, Partial<Document>>({
      query: (body) => ({
        url: '/documents',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
      // Optimistic update
      async onQueryStarted(newDoc, { dispatch, queryFulfilled }) {
        // Optimistically add document to cache
        const patchResult = dispatch(
          documentsApi.util.updateQueryData(
            'getDocuments',
            { status: 'all', sort: 'recent', q: '', page: 1, limit: 10 },
            (draft) => {
              // Create optimistic document
              const optimisticDoc: Document = {
                id: Date.now(), // Temporary ID
                title: newDoc.title || 'Untitled Document',
                snippet: newDoc.snippet || 'Start writing...',
                body: newDoc.body || '<p>Start writing...</p>',
                author: newDoc.author || 'DK',
                authorInitials: newDoc.authorInitials || 'DK',
                updatedAt: new Date().toISOString(),
                status: newDoc.status || 'Draft',
                views: 0,
              };
              draft.documents.unshift(optimisticDoc);
              draft.pagination.total += 1;
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

    updateDocument: builder.mutation<
      Document,
      { id: number } & Partial<Document>
    >({
      query: ({ id, ...patch }) => ({
        url: `/documents/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Document', id },
        { type: 'Document', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Update individual document cache
        const patchResult1 = dispatch(
          documentsApi.util.updateQueryData('getDocument', id, (draft) => {
            Object.assign(draft, patch);
            draft.updatedAt = new Date().toISOString();
          })
        );

        // Update document in list cache
        const patchResult2 = dispatch(
          documentsApi.util.updateQueryData(
            'getDocuments',
            { status: 'all', sort: 'recent', q: '', page: 1, limit: 10 },
            (draft) => {
              const doc = draft.documents.find((d) => d.id === id);
              if (doc) {
                Object.assign(doc, patch);
                doc.updatedAt = new Date().toISOString();
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

    deleteDocument: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi;
