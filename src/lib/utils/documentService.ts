/**
 * Document Service - Simple localStorage merge + Activity Tracking
 *
 * When creating/updating documents, also create corresponding activities
 */

import type { Document } from '@/types';
import { createActivity } from './activityService';

const STORAGE_KEY = 'atlas_local_documents';

// ============================================
// STORAGE HELPERS
// ============================================

/**
 * Get all local documents from localStorage
 */
export function getLocalDocuments(): Document[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load local documents:', error);
    return [];
  }
}

/**
 * Save all local documents to localStorage
 */
function saveLocalDocuments(documents: Document[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    console.log('💾 Saved local documents:', documents.length);
  } catch (error) {
    console.error('Failed to save local documents:', error);
  }
}

/**
 * Get a single local document by ID
 */
export function getLocalDocument(id: number): Document | null {
  const localDocs = getLocalDocuments();
  return localDocs.find((doc) => doc.id === id) || null;
}

// ============================================
// MERGE LOGIC
// ============================================

/**
 * Merge GitHub documents with local documents
 *
 * Logic:
 * - Local documents override GitHub documents (by ID)
 * - Local-only documents are added to the list
 * - Sort by most recent
 */
export function mergeDocuments(githubDocs: Document[]): Document[] {
  const localDocs = getLocalDocuments();

  if (localDocs.length === 0) {
    return githubDocs; // No local changes
  }

  console.log('🔄 Merging documents:', {
    github: githubDocs.length,
    local: localDocs.length,
  });

  // Create a map of GitHub docs by ID
  const merged = new Map<number, Document>();

  // Add all GitHub docs
  githubDocs.forEach((doc) => {
    merged.set(doc.id, doc);
  });

  // Override/add local docs
  localDocs.forEach((doc) => {
    merged.set(doc.id, doc);
  });

  // Convert back to array and sort by most recent
  const result = Array.from(merged.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  console.log('✅ Merged result:', result.length, 'documents');

  return result;
}

// ============================================
// CRUD OPERATIONS (WITH ACTIVITY TRACKING)
// ============================================

/**
 * Create a new document locally + create activity
 */
export function createLocalDocument(data: Partial<Document>): Document {
  const localDocs = getLocalDocuments();
  const now = new Date().toISOString();

  const newDoc: Document = {
    id: Date.now(), // Unique ID based on timestamp
    title: data.title || 'Untitled Document',
    snippet:
      data.snippet || data.body?.substring(0, 60) + '...' || 'Start writing...',
    body: data.body || '<p>Start writing...</p>',
    author: data.author || 'DK',
    authorInitials: data.authorInitials || 'DK',
    createdAt: now,
    updatedAt: now,
    status: data.status || 'Draft',
    views: 0,
  };

  localDocs.push(newDoc);
  saveLocalDocuments(localDocs);

  // 🎯 CREATE ACTIVITY
  createActivity(
    'created',
    newDoc.id,
    newDoc.title,
    newDoc.author,
    newDoc.authorInitials
  );

  console.log('✨ Created local document:', newDoc.id, newDoc.title);

  return newDoc;
}

/**
 * Update an existing document locally + create activity
 */
export function updateLocalDocument(
  id: number,
  updates: Partial<Document>
): Document | null {
  const localDocs = getLocalDocuments();
  const index = localDocs.findIndex((doc) => doc.id === id);

  if (index === -1) {
    // Document doesn't exist locally yet - add it with updates
    const now = new Date().toISOString();
    const updatedDoc: Document = {
      id,
      title: updates.title || 'Untitled Document',
      snippet: updates.snippet || updates.body?.substring(0, 60) + '...' || '',
      body: updates.body || '',
      author: updates.author || 'DK',
      authorInitials: updates.authorInitials || 'DK',
      createdAt: updates.createdAt || now,
      status: updates.status || 'Draft',
      views: updates.views || 0,
      ...updates,
      updatedAt: now,
    };

    localDocs.push(updatedDoc);
    saveLocalDocuments(localDocs);

    // 🎯 CREATE ACTIVITY (updated, not created)
    createActivity(
      'updated',
      updatedDoc.id,
      updatedDoc.title,
      updatedDoc.author,
      updatedDoc.authorInitials
    );

    console.log('📝 Created and updated local document:', id);
    return updatedDoc;
  }

  // Update existing local document (preserve createdAt)
  const updatedDoc = {
    ...localDocs[index],
    ...updates,
    createdAt: localDocs[index].createdAt, // Don't overwrite createdAt
    updatedAt: new Date().toISOString(),
  };

  localDocs[index] = updatedDoc;
  saveLocalDocuments(localDocs);

  // 🎯 CREATE ACTIVITY
  const action = updates.status === 'Published' ? 'published' : 'updated';
  createActivity(
    action,
    updatedDoc.id,
    updatedDoc.title,
    updatedDoc.author,
    updatedDoc.authorInitials
  );

  console.log('📝 Updated local document:', id, updatedDoc.title);

  return updatedDoc;
}

/**
 * Delete a document locally (no activity needed)
 */
export function deleteLocalDocument(id: number): boolean {
  const localDocs = getLocalDocuments();
  const filtered = localDocs.filter((doc) => doc.id !== id);

  if (filtered.length === localDocs.length) {
    console.warn('Document not found in local storage:', id);
    return false;
  }

  saveLocalDocuments(filtered);
  console.log('🗑️ Deleted local document:', id);

  return true;
}

/**
 * Clear all local documents
 */
export function clearLocalDocuments(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🧹 Cleared all local documents');
  } catch (error) {
    console.error('Failed to clear local documents:', error);
  }
}

// ============================================
// SEARCH HELPER
// ============================================

/**
 * Search documents (works with merged data)
 */
export function searchDocuments(
  documents: Document[],
  query: string
): Document[] {
  if (!query.trim()) return documents;

  const lowerQuery = query.toLowerCase();

  return documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.snippet.toLowerCase().includes(lowerQuery) ||
      doc.body.toLowerCase().includes(lowerQuery)
  );
}
