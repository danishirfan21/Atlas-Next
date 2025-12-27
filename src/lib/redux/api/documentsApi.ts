import { apiSlice } from './apiSlice';
import type { Document, PaginatedDocumentsResponse } from '@/types';

export const documentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<
      PaginatedDocumentsResponse,
      { status?: string; sort?: string; q?: string; page?: number; limit?: number }
    >({
      query: ({ status = 'all', sort = 'recent', q = '', page = 1, limit = 10 } = {}) => {
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
              ...result.documents.map(({ id }) => ({ type: 'Document' as const, id })),
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