// Activity feed types
export type ActivityAction = 'created' | 'updated' | 'published' | 'commented';

export interface ActivityItem {
  id: number;
  action: ActivityAction;
  author: string;
  authorInitials: string;
  documentTitle: string;
  documentId: number;
  timestamp: Date | string;
}
