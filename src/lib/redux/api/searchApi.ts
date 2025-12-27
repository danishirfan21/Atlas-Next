import { apiSlice } from './apiSlice';
import type { Document } from '@/types';

interface SearchParams {
  q?: string;
  status?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const searchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchDocuments: builder.query<Document[], SearchParams>({
      query: ({ q = '', status, author, dateFrom, dateTo } = {}) => {
        const params = new URLSearchParams();
        if (q) params.append('q', q);
        if (status && status !== 'all') params.append('status', status);
        if (author && author !== 'all') params.append('author', author);
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);
        return `/search?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Document' as const, id })),
              { type: 'Search', id: 'LIST' },
            ]
          : [{ type: 'Search', id: 'LIST' }],
    }),
  }),
});

export const { useSearchDocumentsQuery } = searchApi;
