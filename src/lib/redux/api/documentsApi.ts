import { apiSlice } from './apiSlice';
import type { Document } from '@/types';

export const documentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<
      Document[],
      { status?: string; sort?: string; q?: string }
    >({
      query: ({ status = 'all', sort = 'recent', q = '' } = {}) => {
        const params = new URLSearchParams();
        if (status !== 'all') params.append('status', status);
        if (sort) params.append('sort', sort);
        if (q) params.append('q', q);
        return `/documents?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Document' as const, id })),
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
