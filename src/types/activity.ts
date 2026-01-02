// Activity feed types
export type ActivityAction = 'created' | 'updated' | 'published' | 'commented';

export interface ActivityItem {
  id: number;
  action: ActivityAction;
  author: string;
  authorInitials: string;
  documentTitle: string;
  documentId?: number;
  collectionId?: number;
  timestamp: Date | string;
}
