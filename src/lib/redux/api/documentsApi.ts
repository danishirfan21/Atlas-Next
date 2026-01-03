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

      transformResponse: (response: PaginatedDocumentsResponse, _meta, arg) => {

        // 1. Merge GitHub docs with localStorage
        const mergedDocuments = mergeDocuments(response.documents);

        // 2. Apply CLIENT-SIDE PAGINATION to merged data
        const { page = 1, limit = 10 } = arg;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedDocs = mergedDocuments.slice(startIndex, endIndex);

        // 3. Recalculate pagination info based on merged data
        const totalPages = Math.ceil(mergedDocuments.length / limit);

        return {
          documents: paginatedDocs,
          pagination: {
            page,
            limit,
            total: mergedDocuments.length,
            totalPages,
            hasNext: endIndex < mergedDocuments.length,
            hasPrev: page > 1,
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
      async queryFn(id, _queryApi, _extraOptions, fetchWithBQ) {
        const localDoc = getLocalDocument(id);
        if (localDoc) {
          return { data: localDoc };
        }

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
          const createdDoc = createLocalDocument(newDoc);
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

      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    updateDocument: builder.mutation<
      Document,
      { id: number } & Partial<Document>
    >({
      async queryFn({ id, ...updates }) {
        console.log('📝 Updating document:', id);

        try {
          const updatedDoc = updateLocalDocument(id, updates);

          if (!updatedDoc) {
            return {
              error: {
                status: 404,
                data: { error: 'Document not found' },
              },
            };
          }

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

      invalidatesTags: (result, error, { id }) => [
        { type: 'Document', id },
        { type: 'Document', id: 'LIST' },
      ],
    }),

    deleteDocument: builder.mutation<{ success: boolean }, number>({
      async queryFn(id) {
        console.log('🗑️ Deleting document:', id);

        try {
          const success = deleteLocalDocument(id);

          if (!success) {
            return {
              error: {
                status: 404,
                data: { error: 'Document not found' },
              },
            };
          }

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
