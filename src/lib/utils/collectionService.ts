/**
 * Collection Service - localStorage merge + Activity Tracking
 *
 * When creating/updating collections, also create corresponding activities
 */

import type { Collection, ActivityItem } from '@/types';

const STORAGE_KEY = 'atlas_local_collections';
const ACTIVITY_STORAGE_KEY = 'atlas_local_activities';

// ============================================
// HELPER: Activity Storage
// ============================================

function getLocalActivities(): ActivityItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load activities:', error);
    return [];
  }
}

function saveLocalActivities(activities: ActivityItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Failed to save activities:', error);
  }
}

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Get all local collections from localStorage
 */
export function getLocalCollections(): Collection[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load local collections:', error);
    return [];
  }
}

/**
 * Save all local collections to localStorage
 */
function saveLocalCollections(collections: Collection[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    console.log('💾 Saved local collections:', collections.length);
  } catch (error) {
    console.error('Failed to save local collections:', error);
  }
}

/**
 * Get a single local collection by ID
 */
export function getLocalCollection(id: number): Collection | null {
  const localCollections = getLocalCollections();
  return localCollections.find((col) => col.id === id) || null;
}

// ============================================
// MERGE LOGIC
// ============================================

/**
 * Merge GitHub collections with local collections
 *
 * Logic:
 * - Local collections override GitHub collections (by ID)
 * - Local-only collections are added to the list
 * - Sort by most recently updated
 */
export function mergeCollections(
  githubCollections: Collection[]
): Collection[] {
  const localCollections = getLocalCollections();

  if (localCollections.length === 0) {
    return githubCollections; // No local changes
  }

  console.log('🔄 Merging collections:', {
    github: githubCollections.length,
    local: localCollections.length,
  });

  // Create a map of GitHub collections by ID
  const merged = new Map<number, Collection>();

  // Add all GitHub collections
  githubCollections.forEach((col) => {
    merged.set(col.id, col);
  });

  // Override/add local collections
  localCollections.forEach((col) => {
    merged.set(col.id, col);
  });

  // Convert back to array and sort by most recent
  const result = Array.from(merged.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  console.log('✅ Merged result:', result.length, 'collections');

  return result;
}

// ============================================
// CRUD OPERATIONS (WITH ACTIVITY TRACKING)
// ============================================

/**
 * Create a new collection locally + create activity
 */
export function createLocalCollection(data: Partial<Collection>): Collection {
  const localCollections = getLocalCollections();
  const now = new Date();

  const newCollection: Collection = {
    id: Date.now(), // Unique ID based on timestamp
    name: data.name || 'Untitled Collection',
    description: data.description || '',
    icon: data.icon || '📁',
    iconBg: data.iconBg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    documentCount: data.documentCount || 0,
    contributorCount: data.contributorCount || 1,
    createdAt: now,
    updatedAt: now,
  };

  localCollections.push(newCollection);
  saveLocalCollections(localCollections);

  // 🎯 CREATE ACTIVITY for collection
  const activities = getLocalActivities();
  const newActivity: ActivityItem = {
    id: Date.now() + 1, // Ensure unique ID
    action: 'created',
    author: 'DK',
    authorInitials: 'DK',
    documentTitle: `Collection: ${newCollection.name}`,
    collectionId: newCollection.id,
    timestamp: new Date().toISOString(),
  };
  activities.push(newActivity);
  saveLocalActivities(activities);

  console.log(
    '✨ Created local collection:',
    newCollection.id,
    newCollection.name
  );

  return newCollection;
}

/**
 * Update an existing collection locally + create activity
 */
export function updateLocalCollection(
  id: number,
  updates: Partial<Collection>
): Collection | null {
  const localCollections = getLocalCollections();
  const index = localCollections.findIndex((col) => col.id === id);

  if (index === -1) {
    // Collection doesn't exist locally yet - add it with updates
    const now = new Date();
    const updatedCollection: Collection = {
      id,
      name: updates.name || 'Untitled Collection',
      description: updates.description || '',
      icon: updates.icon || '📁',
      iconBg:
        updates.iconBg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      documentCount: updates.documentCount || 0,
      contributorCount: updates.contributorCount || 1,
      createdAt: updates.createdAt || now,
      updatedAt: now,
      ...updates,
    };

    localCollections.push(updatedCollection);
    saveLocalCollections(localCollections);

    // 🎯 CREATE ACTIVITY for collection update
    const activities = getLocalActivities();
    const newActivity: ActivityItem = {
      id: Date.now() + 1,
      action: 'updated',
      author: 'DK',
      authorInitials: 'DK',
      documentTitle: `Collection: ${updatedCollection.name}`,
      collectionId: updatedCollection.id,
      timestamp: new Date().toISOString(),
    };
    activities.push(newActivity);
    saveLocalActivities(activities);

    console.log('📝 Created and updated local collection:', id);
    return updatedCollection;
  }

  // Update existing local collection (preserve createdAt)
  const updatedCollection = {
    ...localCollections[index],
    ...updates,
    createdAt: localCollections[index].createdAt, // Don't overwrite createdAt
    updatedAt: new Date(),
  };

  localCollections[index] = updatedCollection;
  saveLocalCollections(localCollections);

  // 🎯 CREATE ACTIVITY for collection update
  const activities = getLocalActivities();
  const newActivity: ActivityItem = {
    id: Date.now() + 1,
    action: 'updated',
    author: 'DK',
    authorInitials: 'DK',
    documentTitle: `Collection: ${updatedCollection.name}`,
    collectionId: updatedCollection.id,
    timestamp: new Date().toISOString(),
  };
  activities.push(newActivity);
  saveLocalActivities(activities);

  console.log('📝 Updated local collection:', id, updatedCollection.name);

  return updatedCollection;
}

/**
 * Delete a collection locally (no activity needed)
 */
export function deleteLocalCollection(id: number): boolean {
  const localCollections = getLocalCollections();
  const filtered = localCollections.filter((col) => col.id !== id);

  if (filtered.length === localCollections.length) {
    console.warn('Collection not found in local storage:', id);
    return false;
  }

  saveLocalCollections(filtered);
  console.log('🗑️ Deleted local collection:', id);

  return true;
}

/**
 * Clear all local collections
 */
export function clearLocalCollections(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🧹 Cleared all local collections');
  } catch (error) {
    console.error('Failed to clear local collections:', error);
  }
}

// ============================================
// SEARCH HELPER
// ============================================

/**
 * Search collections (works with merged data)
 */
export function searchCollections(
  collections: Collection[],
  query: string
): Collection[] {
  if (!query.trim()) return collections;

  const lowerQuery = query.toLowerCase();

  return collections.filter(
    (col) =>
      col.name.toLowerCase().includes(lowerQuery) ||
      col.description.toLowerCase().includes(lowerQuery)
  );
}
