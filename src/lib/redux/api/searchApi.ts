import { apiSlice } from './apiSlice';
import type { Document, Collection } from '@/types';
import { mergeDocuments, searchDocuments } from '@/lib/utils/documentService';
import {
  mergeCollections,
  searchCollections,
} from '@/lib/utils/collectionService';

interface SearchParams {
  q?: string;
  status?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface SearchResults {
  documents: Document[];
  collections: Collection[];
  totalResults: number;
}

export const searchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchDocumentsAndCollections: builder.query<SearchResults, SearchParams>({
      query: ({ q = '', status, author, dateFrom, dateTo } = {}) => {
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (status && status !== 'all') params.append('status', status);
        if (author && author !== 'all') params.append('author', author);
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);
        return `/search?${params.toString()}`;
      },

      transformResponse: (response: SearchResults, _meta, arg) => {
        console.log('🔍 Search - merging documents and collections...');

        // Merge GitHub documents with localStorage
        const mergedDocuments = mergeDocuments(response.documents);

        // 🎯 MERGE GitHub collections with localStorage
        const mergedCollections = mergeCollections(response.collections);

        // Apply client-side search on merged data if query exists
        const searchedDocuments = arg.q
          ? searchDocuments(mergedDocuments, arg.q)
          : mergedDocuments;

        // 🎯 APPLY client-side search on merged collections
        const searchedCollections = arg.q
          ? searchCollections(mergedCollections, arg.q)
          : mergedCollections;

        return {
          documents: searchedDocuments,
          collections: searchedCollections,
          totalResults: searchedDocuments.length + searchedCollections.length,
        };
      },

      providesTags: (result) => {
        if (!result) return [{ type: 'Search', id: 'LIST' }];

        return [
          // Tag documents
          ...result.documents.map(({ id }) => ({
            type: 'Document' as const,
            id,
          })),
          // Tag collections
          ...result.collections.map(({ id }) => ({
            type: 'Collection' as const,
            id,
          })),
          { type: 'Search', id: 'LIST' },
        ];
      },
    }),
  }),
});

export const { useSearchDocumentsAndCollectionsQuery } = searchApi;
