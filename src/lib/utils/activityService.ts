/**
 * Activity Service - Track activities for localStorage documents
 *
 * When creating/updating localStorage documents, we also create
 * corresponding activity entries so they show up in the activity feed.
 */

import type { ActivityItem } from '@/types';

const STORAGE_KEY = 'atlas_local_activities';

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Get all local activities from localStorage
 */
export function getLocalActivities(): ActivityItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load local activities:', error);
    return [];
  }
}

/**
 * Save all local activities to localStorage
 */
function saveLocalActivities(activities: ActivityItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    console.log('💾 Saved local activities:', activities.length);
  } catch (error) {
    console.error('Failed to save local activities:', error);
  }
}

// ============================================
// MERGE LOGIC
// ============================================

/**
 * Merge GitHub activities with local activities
 * Sort by most recent
 */
export function mergeActivities(
  githubActivities: ActivityItem[]
): ActivityItem[] {
  const localActivities = getLocalActivities();

  if (localActivities.length === 0) {
    return githubActivities;
  }

  console.log('🔄 Merging activities:', {
    github: githubActivities.length,
    local: localActivities.length,
  });

  // Combine and sort by timestamp (most recent first)
  const merged = [...githubActivities, ...localActivities].sort((a, b) => {
    const aTime = new Date(a.timestamp).getTime();
    const bTime = new Date(b.timestamp).getTime();
    return bTime - aTime; // Descending (newest first)
  });

  console.log('✅ Merged activities:', merged.length);

  return merged;
}

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Create an activity entry for a document action
 */
export function createActivity(
  action: 'created' | 'updated' | 'published' | 'commented',
  documentId: number,
  documentTitle: string,
  author: string = 'DK',
  authorInitials: string = 'DK'
): ActivityItem {
  const localActivities = getLocalActivities();

  const newActivity: ActivityItem = {
    id: Date.now(), // Unique ID based on timestamp
    action,
    author,
    authorInitials,
    documentTitle,
    documentId,
    timestamp: new Date().toISOString(),
  };

  localActivities.push(newActivity);
  saveLocalActivities(localActivities);

  console.log(`✨ Created ${action} activity for document:`, documentTitle);

  return newActivity;
}

/**
 * Clear all local activities
 */
export function clearLocalActivities(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🧹 Cleared all local activities');
  } catch (error) {
    console.error('Failed to clear local activities:', error);
  }
}

/**
 * Search/filter activities
 */
export function filterActivities(
  activities: ActivityItem[],
  type: string
): ActivityItem[] {
  if (type === 'all') return activities;

  return activities.filter((activity) => activity.action === type);
}
