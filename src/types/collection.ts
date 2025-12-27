// Collection-related types
export interface Collection {
  id: number;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  documentCount: number;
  contributorCount: number;
  createdAt: Date;
  updatedAt: Date;
}
