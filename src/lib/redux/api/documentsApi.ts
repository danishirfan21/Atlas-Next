import { apiSlice } from './apiSlice';
import type { Document, PaginatedDocumentsResponse } from '@/types';
import {
  mergeDocuments,
  getLocalDocument,
  createLocalDocument,
  updateLocalDocument,
  deleteLocalDocument,
} from '@/lib/utils/documentService';

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

      transformResponse: (response: PaginatedDocumentsResponse) => {
        // Merge GitHub docs with local docs
        const mergedDocuments = mergeDocuments(response.documents);

        // Sort by most recent (already done in mergeDocuments, but ensure it)
        mergedDocuments.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        return {
          documents: mergedDocuments,
          pagination: {
            ...response.pagination,
            total: mergedDocuments.length,
            totalPages: Math.ceil(
              mergedDocuments.length / response.pagination.limit
            ),
          },
        };
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
      // 🎯 SIMPLE: Check localStorage first, fallback to API
      async queryFn(id, _queryApi, _extraOptions, fetchWithBQ) {

        // 1. Check localStorage first
        const localDoc = getLocalDocument(id);
        if (localDoc) {
          return { data: localDoc };
        }

        // 2. Fallback to API
        const result = await fetchWithBQ(`/documents/${id}`);

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data as Document };
      },

      providesTags: (result, error, id) => [{ type: 'Document', id }],
    }),

    createDocument: builder.mutation<Document, Partial<Document>>({
      async queryFn(newDoc) {
        console.log('✨ Creating document:', newDoc.title);

        try {
          // Create in localStorage
          const createdDoc = createLocalDocument(newDoc);

          // Return the created document
          return { data: createdDoc };
        } catch (error: any) {
          console.error('❌ Failed to create document:', error);
          return {
            error: {
              status: 500,
              data: { error: error.message || 'Failed to create document' },
            },
          };
        }
      },

      // Invalidate cache to trigger refetch (which will merge localStorage)
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    updateDocument: builder.mutation<
      Document,
      { id: number } & Partial<Document>
    >({
      async queryFn({ id, ...updates }) {
        console.log('📝 Updating document:', id);

        try {
          // Update in localStorage
          const updatedDoc = updateLocalDocument(id, updates);

          if (!updatedDoc) {
            return {
              error: {
                status: 404,
                data: { error: 'Document not found' },
              },
            };
          }

          // Return the updated document
          return { data: updatedDoc };
        } catch (error: any) {
          console.error('❌ Failed to update document:', error);
          return {
            error: {
              status: 500,
              data: { error: error.message || 'Failed to update document' },
            },
          };
        }
      },

      // Invalidate cache to trigger refetch
      invalidatesTags: (result, error, { id }) => [
        { type: 'Document', id },
        { type: 'Document', id: 'LIST' },
      ],
    }),

    deleteDocument: builder.mutation<{ success: boolean }, number>({
      async queryFn(id) {
        console.log('🗑️ Deleting document:', id);

        try {
          // Delete from localStorage
          const success = deleteLocalDocument(id);

          if (!success) {
            return {
              error: {
                status: 404,
                data: { error: 'Document not found' },
              },
            };
          }

          // Return success
          return { data: { success: true } };
        } catch (error: any) {
          console.error('❌ Failed to delete document:', error);
          return {
            error: {
              status: 500,
              data: { error: error.message || 'Failed to delete document' },
            },
          };
        }
      },

      // Invalidate cache to trigger refetch
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
