// Document-related types
export interface Document {
  id: number;
  title: string;
  snippet: string;
  body: string;
  author: string;
  authorInitials: string;
  updatedAt: Date;
  status: 'Published' | 'Draft' | 'In Review';
  views: number;
}

export type DocumentStatus = 'Published' | 'Draft' | 'In Review';
export type SortOption = 'recent' | 'oldest' | 'title';
export type FilterOption = 'all' | DocumentStatus;
