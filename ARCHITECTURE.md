# Atlas Architecture Documentation

## 📐 System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Next.js 14 App                               │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                  App Router (SSR + Client)                    │ │
│  │                                                                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │ │
│  │  │Dashboard │  │Documents │  │Collections│  │ Activity │     │ │
│  │  │  (SSR)   │  │ (Hybrid) │  │ (Hybrid)  │  │ (Client) │     │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │ │
│  │                                                                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │ │
│  │  │  Search  │  │ Settings │  │   Help   │                   │ │
│  │  │ (Client) │  │ (Client) │  │  (SSR)   │                   │ │
│  │  └──────────┘  └──────────┘  └──────────┘                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │            Client-Side State (Redux Toolkit)                  │ │
│  │                                                                │ │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────────┐            │ │
│  │  │ UI Slice │  │  RTK Query   │  │ Persistence │            │ │
│  │  │          │  │   Cache      │  │   Layer     │            │ │
│  │  │ - Pages  │  │              │  │             │            │ │
│  │  │ - Search │  │ - Documents  │  │ - Filters   │            │ │
│  │  │ - Filters│  │ - Collections│  │ - Selections│            │ │
│  │  │ - Toasts │  │ - Activity   │  │ - Prefs     │            │ │
│  │  └──────────┘  └──────────────┘  └─────────────┘            │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                  Component Architecture                        │ │
│  │                                                                │ │
│  │  Layout ──────── UI ──────── Feature-Specific                │ │
│  │  (Sidebar)     (Button)    (DocumentList, StatCard)          │ │
│  │  (Topbar)      (Card)      (CollectionCard, ActivityTimeline)│ │
│  │               (Pagination)  (SearchResults)                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                  Data Layer (Hybrid Storage)                  │ │
│  │                                                                │ │
│  │  ┌────────────────┐         ┌─────────────────┐              │ │
│  │  │ GitHub (JSON)  │         │  LocalStorage   │              │ │
│  │  │                │         │                 │              │ │
│  │  │ - Baseline Data│◄───────►│ - User Changes  │              │ │
│  │  │ - 50 Docs      │  Merge  │ - CRUD Ops      │              │ │
│  │  │ - 8 Collections│         │ - Activity      │              │ │
│  │  │ - Activities   │         │ - Preferences   │              │ │
│  │  └────────────────┘         └─────────────────┘              │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Architecture

### 1. Read Flow (Fetching Data with LocalStorage Merge)

```
User Action (Navigate to /documents)
    ↓
Component dispatches RTK Query hook
    ↓
RTK Query checks cache
    ↓
Cache Hit? ──Yes──> Return cached data
    ↓ No
Fetch from API (GitHub)
    ↓
API returns GitHub data
    ↓
transformResponse merges with localStorage
    ↓
  ┌─────────────────────────────────┐
  │  Merge Logic (documentService)  │
  │                                 │
  │  1. Get GitHub docs (50)        │
  │  2. Get localStorage docs (5)   │
  │  3. Override by ID              │
  │  4. Sort by updatedAt          │
  │  5. Apply filters               │
  │  6. Client-side pagination      │
  └─────────────────────────────────┘
    ↓
Store in RTK Query cache
    ↓
Update component with merged data
```

### 2. Write Flow (Mutations with LocalStorage + Activity Tracking)

```
User Action (Save Document)
    ↓
Component dispatches mutation
    ↓
Optimistic Update (immediate UI feedback)
    ↓
queryFn executes
    ↓
  ┌──────────────────────────────────────┐
  │  documentService.createLocalDocument │
  │                                      │
  │  1. Create document object           │
  │  2. Add to localStorage array        │
  │  3. Create activity entry            │
  │  4. Save both to localStorage        │
  │  5. Return new document              │
  └──────────────────────────────────────┘
    ↓
Success? ──Yes──> Invalidate cache tags
    ↓             ──> Refetch affected queries
    ↓             ──> Merge runs again (includes new doc)
    ↓ No
Rollback optimistic update
    ↓
Show error toast
```

### 3. Pagination Flow (Client-Side with Merge)

```
User clicks "Page 2"
    ↓
Dispatch setDocumentsPage(2)
    ↓
Component re-renders with new page param
    ↓
RTK Query refetches (cache may be used)
    ↓
API returns ALL filtered docs (no server pagination)
    ↓
transformResponse merges with localStorage
    ↓
  ┌────────────────────────────────────┐
  │  Client-Side Pagination            │
  │                                    │
  │  mergedDocs = 55 total             │
  │  page = 2, limit = 10              │
  │  startIndex = (2-1) * 10 = 10      │
  │  endIndex = 10 + 10 = 20           │
  │  return docs.slice(10, 20)         │
  │                                    │
  │  pagination: {                     │
  │    page: 2,                        │
  │    totalPages: 6,                  │
  │    hasNext: true,                  │
  │    hasPrev: true                   │
  │  }                                 │
  └────────────────────────────────────┘
    ↓
Component renders page 2 (docs 11-20)
```

---

## 🗂️ File Structure Explained

### App Router Pattern (Next.js 14)

```
app/
├── layout.tsx              # Root layout (persistent across routes)
│   ├── Providers           # Redux Provider
│   ├── Sidebar             # Left navigation (mobile: overlay)
│   ├── Topbar              # Top bar with search
│   ├── ToastContainer      # Global notifications
│   └── children            # Page content
│
├── page.tsx                # Dashboard (/) - SSR with client components
│
├── documents/
│   ├── page.tsx            # Documents CRUD (/documents)
│   └── loading.tsx         # Skeleton while loading
│
├── collections/
│   ├── page.tsx            # Collections management (/collections)
│   └── loading.tsx         # Loading skeleton
│
├── activity/
│   ├── page.tsx            # Activity feed (/activity)
│   └── loading.tsx         # Loading state
│
├── search/
│   ├── page.tsx            # Advanced search (/search?q=...)
│   └── loading.tsx         # Search skeleton
│
├── settings/
│   ├── page.tsx            # User preferences (/settings)
│   └── loading.tsx         # Settings loader
│
├── help/
│   └── page.tsx            # Help center (/help) - SSR
│
└── providers.tsx           # Redux Provider wrapper (client)
```

**Why this structure?**
- ✅ Automatic routing (no router config)
- ✅ Nested layouts without wrappers
- ✅ Code splitting per route
- ✅ SEO-friendly URLs
- ✅ Built-in loading/error states
- ✅ Server components by default

---

## 🔐 State Management Layers

### Layer 1: Server Components (Default - No State)
```typescript
// Pure rendering, no state needed
export default function HelpPage() {
  return <StaticContent />;
}
```
**Use for:** Static content, layouts, help pages

### Layer 2: Client Components (Local State)
```typescript
'use client';

// React hooks for component-specific state
export function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  return <div>...</div>;
}
```
**Use for:** Modals, forms, dropdowns, temporary UI state

### Layer 3: Redux (Global UI State)
```typescript
'use client';

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';

export function DocumentFilters() {
  const filters = useAppSelector(state => state.ui.documentFilters);
  const dispatch = useAppDispatch();
  
  return <select value={filters.status} onChange={...} />;
}
```
**Use for:** 
- Selected document/collection IDs
- Filter states (persisted)
- Sidebar collapsed state
- Search query
- View preferences (grid/list)
- User profile (avatar)
- Toast notifications

### Layer 4: RTK Query (Server/Cached State)
```typescript
'use client';

import { useGetDocumentsQuery } from '@/lib/redux/api/documentsApi';

export function DocumentList() {
  const { data, isLoading } = useGetDocumentsQuery({
    status: 'all',
    sort: 'recent',
    page: 1,
    limit: 10
  });
  
  return <div>{/* render documents */}</div>;
}
```
**Use for:** 
- API data fetching
- Automatic caching (60s)
- Background refetching
- Optimistic updates
- Cache invalidation

### Layer 5: LocalStorage (Persistent State)
```typescript
// Via utility services
import { createLocalDocument, getLocalDocuments } from '@/lib/utils/documentService';

// CRUD operations that persist
const newDoc = createLocalDocument({ title: 'New Doc' });
const allDocs = getLocalDocuments(); // Merged with GitHub data
```
**Use for:**
- User-created documents
- User-created collections
- Activity tracking
- Preferences persistence
- Offline-first data

---

## 🎨 Component Architecture

### Component Hierarchy

```
App
├── RootLayout
│   ├── Providers (Redux)
│   │   └── KeyboardShortcutsProvider
│   │       └── MobileMenuProvider
│   │           ├── Sidebar (Client) ◄──── Mobile: Overlay
│   │           │   └── NavItem (Links)
│   │           │
│   │           ├── Topbar (Client)
│   │           │   ├── Hamburger Menu (Mobile Only)
│   │           │   ├── Breadcrumb (Desktop/Tablet)
│   │           │   ├── SearchBar
│   │           │   ├── Refresh Button
│   │           │   ├── New Button (Context-aware)
│   │           │   └── Avatar (Click → Settings)
│   │           │
│   │           └── Page Content
│   │               ├── Dashboard (Server + Client)
│   │               │   ├── StatCard (Server) × 4
│   │               │   ├── ActivityList (Client)
│   │               │   └── PopularDocs (Client)
│   │               │
│   │               ├── Documents (Client)
│   │               │   ├── FilterBar
│   │               │   ├── DocumentList
│   │               │   │   ├── Grid View (Mobile adapts)
│   │               │   │   └── List View
│   │               │   ├── Pagination
│   │               │   └── DocumentPreview
│   │               │       └── Mobile: Back Button
│   │               │
│   │               ├── Collections (Client)
│   │               │   ├── CollectionCard Grid
│   │               │   └── CollectionDetail
│   │               │       ├── Mobile: Back Button
│   │               │       └── DocumentsList
│   │               │
│   │               ├── Activity (Client)
│   │               │   ├── ActivityFilters
│   │               │   └── ActivityTimeline
│   │               │       └── Click → Navigate
│   │               │
│   │               ├── Search (Client)
│   │               │   ├── SearchBar
│   │               │   ├── SearchFilters
│   │               │   └── SearchResults
│   │               │       ├── Collections Section
│   │               │       └── Documents Section
│   │               │
│   │               ├── Settings (Client)
│   │               │   ├── Avatar Selector
│   │               │   ├── View Mode Toggle
│   │               │   └── Clear Preferences
│   │               │
│   │               └── Help (Server)
│   │                   └── Static Cards
│   │
│   └── Global Components
│       ├── ToastContainer
│       ├── PersistenceIndicator
│       └── ErrorBoundary
```

### Component Types & Patterns

#### 1. **Presentational Components** (Pure, Reusable)
```typescript
// Example: Card.tsx
interface CardProps {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = false }: CardProps) {
  return <div className={clsx(styles.card, hover && styles.hover)}>{children}</div>;
}
```
- Pure functions, no state
- Receive props, render UI
- Examples: Card, Button, Badge, Avatar

#### 2. **Container Components** (Connected to State)
```typescript
// Example: DocumentList.tsx
export function DocumentList() {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(state => state.ui.selectedDocumentId);
  const { data, isLoading } = useGetDocumentsQuery({ ... });
  
  return <div>{/* render with state */}</div>;
}
```
- Connect to Redux/RTK Query
- Handle business logic
- Pass data to presentational components
- Examples: DocumentList, CollectionDetail, ActivityTimeline

#### 3. **Layout Components** (Persistent Structure)
```typescript
// Example: Sidebar.tsx
export function Sidebar() {
  const pathname = usePathname();
  const { isMenuOpen, closeMenu } = useMobileMenu();
  
  return (
    <aside className={`${styles.sidebar} ${isMenuOpen ? styles.open : ''}`}>
      {/* Navigation items */}
    </aside>
  );
}
```
- Persistent across routes
- Provide app structure
- Examples: Sidebar, Topbar, RootLayout

#### 4. **Modal Components** (Overlay UI)
```typescript
// Example: CreateDocumentModal.tsx
export function CreateDocumentModal({ onClose }: Props) {
  const modalRef = useFocusTrap<HTMLDivElement>(true);
  const [createDocument] = useCreateDocumentMutation();
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div ref={modalRef} className={styles.modal}>
        {/* Form with focus trap */}
      </div>
    </div>
  );
}
```
- Focus trap for accessibility
- Keyboard navigation (Esc to close)
- Examples: CreateDocumentModal, CreateCollectionModal

---

## 🔌 Redux Store Structure

```typescript
{
  ui: {
    // Navigation & UI State
    currentPage: 'documents',
    sidebarCollapsed: false,
    searchQuery: '',
    hasUnsavedChanges: false,
    
    // Document Management
    selectedDocumentId: 123,
    documentFilters: {
      status: 'all',      // 'all' | 'Published' | 'Draft' | 'In Review'
      sort: 'recent'      // 'recent' | 'oldest' | 'title'
    },
    isEditingDocument: false,
    documentsPagination: {
      page: 1,
      limit: 10
    },
    
    // Collections
    selectedCollectionId: 45,
    
    // Search
    searchFilters: {
      status: 'all',
      author: 'all',
      dateFrom: '',
      dateTo: ''
    },
    
    // User Preferences (Persisted)
    viewPreferences: {
      documentsViewMode: 'list',  // 'list' | 'grid'
      theme: 'light'              // 'light' | 'dark' (future)
    },
    userProfile: {
      initials: 'DK'
    },
    
    // Notifications
    toasts: [
      { id: 'toast-1', message: 'Document saved', type: 'success' }
    ]
  },
  
  api: {
    // Auto-managed by RTK Query
    queries: {
      'getDocuments({"status":"all","sort":"recent","page":1,"limit":10})': {
        status: 'fulfilled',
        data: {
          documents: [...],
          pagination: { page: 1, totalPages: 6, ... }
        },
        endpointName: 'getDocuments',
        requestId: 'xyz123',
        startedTimeStamp: 1234567890,
        fulfilledTimeStamp: 1234567891
      },
      'getCollections(undefined)': { ... },
      'getActivity({"type":"all"})': { ... }
    },
    mutations: {
      'createDocument': { ... },
      'updateDocument': { ... }
    },
    provided: {
      Document: {
        LIST: [...],
        123: { ... }
      },
      Collection: { ... }
    }
  }
}
```

---

## 🎯 Data Service Layer Architecture

### Service Pattern (documentService.ts, collectionService.ts, activityService.ts)

```typescript
// Document Service Architecture
┌─────────────────────────────────────────────────┐
│         documentService.ts                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Storage Helpers                                │
│  ├── getLocalDocuments(): Document[]           │
│  ├── saveLocalDocuments(docs: Document[])      │
│  └── getLocalDocument(id): Document | null     │
│                                                 │
│  Merge Logic                                    │
│  └── mergeDocuments(github, local): Document[] │
│      1. Create Map of GitHub docs by ID        │
│      2. Override with localStorage docs         │
│      3. Add localStorage-only docs             │
│      4. Sort by updatedAt (desc)               │
│      5. Return merged array                    │
│                                                 │
│  CRUD Operations (+ Activity Tracking)          │
│  ├── createLocalDocument(data)                 │
│  │   ├── Generate ID (Date.now())              │
│  │   ├── Create document object                │
│  │   ├── Save to localStorage                  │
│  │   └── createActivity('created', ...)        │
│  │                                              │
│  ├── updateLocalDocument(id, updates)          │
│  │   ├── Find or create in localStorage        │
│  │   ├── Merge updates                         │
│  │   ├── Save to localStorage                  │
│  │   └── createActivity('updated', ...)        │
│  │                                              │
│  └── deleteLocalDocument(id)                   │
│      ├── Filter from localStorage array        │
│      └── Save updated array                    │
│                                                 │
│  Search Helper                                  │
│  └── searchDocuments(docs, query)              │
│      └── Filter by title/snippet/body          │
└─────────────────────────────────────────────────┘
```

### Activity Tracking Architecture

```typescript
// Automatic Activity Creation
┌──────────────────────────────────────────────┐
│  User Action: Create Document                │
└──────────────┬───────────────────────────────┘
               ↓
┌──────────────────────────────────────────────┐
│  documentService.createLocalDocument()       │
│                                              │
│  1. Create document                          │
│  2. Save to localStorage                     │
│  3. Call: createActivity(                    │
│      action: 'created',                      │
│      documentId: newDoc.id,                  │
│      documentTitle: newDoc.title,            │
│      author: 'DK'                            │
│    )                                         │
└──────────────┬───────────────────────────────┘
               ↓
┌──────────────────────────────────────────────┐
│  activityService.createActivity()            │
│                                              │
│  1. Load existing activities                 │
│  2. Create new activity object:              │
│     {                                        │
│       id: Date.now(),                        │
│       action: 'created',                     │
│       documentId: 123,                       │
│       documentTitle: 'My Doc',               │
│       author: 'DK',                          │
│       timestamp: '2026-01-03T...'            │
│     }                                        │
│  3. Append to activities array               │
│  4. Save to localStorage                     │
└──────────────┬───────────────────────────────┘
               ↓
┌──────────────────────────────────────────────┐
│  Activity Feed Auto-Updates                  │
│                                              │
│  - RTK Query invalidates 'Activity' tag      │
│  - Activity page refetches                   │
│  - mergeActivities(github, local)            │
│  - New activity appears in timeline          │
└──────────────────────────────────────────────┘
```

---

## 🎯 Performance Optimizations

### 1. Code Splitting
```typescript
// Automatic route-based splitting
app/
├── page.tsx           → chunk: page.js
├── documents/page.tsx → chunk: documents-page.js
├── collections/       → chunk: collections-page.js
└── activity/          → chunk: activity-page.js

// Dynamic imports for modals
const CreateDocumentModal = dynamic(
  () => import('@/components/documents/CreateDocumentModal'),
  { loading: () => <Spinner /> }
);
```

### 2. Server Components (Zero JS)
```typescript
// Server Component - No JavaScript sent to client
export default function HelpPage() {
  return <StaticHelpContent />; // Pure HTML
}

// Client Component - JavaScript included
'use client';
export function InteractiveForm() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={...} />;
}
```

### 3. RTK Query Caching Strategy
```typescript
// API Slice Configuration
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  
  // Cache for 60 seconds after last use
  keepUnusedDataFor: 60,
  
  // Refetch if data older than 30 seconds
  refetchOnMountOrArgChange: 30,
  
  // Refetch when window regains focus
  refetchOnFocus: true,
  
  // Refetch when reconnecting
  refetchOnReconnect: true,
  
  // Tag-based invalidation
  tagTypes: ['Document', 'Collection', 'Activity', 'Search']
});
```

### 4. Prefetching on Hover
```typescript
// DocumentCard.tsx
const prefetchDocument = documentsApi.usePrefetch('getDocument');

const handleMouseEnter = useCallback(() => {
  // Prefetch if cache older than 10s
  prefetchDocument(doc.id, { ifOlderThan: 10 });
}, [doc.id, prefetchDocument]);

return <div onMouseEnter={handleMouseEnter}>...</div>;
```

### 5. Hydration Optimization
```typescript
// Prevent hydration mismatches
export function DocumentList() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Show skeleton during SSR
  if (!isMounted) {
    return <SkeletonLoader />;
  }
  
  // Render persisted state only on client
  return <ActualContent viewMode={isMounted ? viewMode : 'list'} />;
}
```

### 6. Client-Side Pagination (Optimized for Small Datasets)
```typescript
// Why client-side?
// - LocalStorage can't be accessed in API routes (server-side)
// - Dataset size: ~50-200 documents (acceptable for client-side)
// - Benefits: Instant page changes, no network latency
// - Trade-off: All data loaded upfront, but cached by RTK Query

transformResponse: (response, _meta, arg) => {
  // 1. Merge GitHub + localStorage (O(n))
  const merged = mergeDocuments(response.documents);
  
  // 2. Client-side pagination (O(1))
  const { page = 1, limit = 10 } = arg;
  const start = (page - 1) * limit;
  const paginated = merged.slice(start, start + limit);
  
  // 3. Recalculate pagination info
  return {
    documents: paginated,
    pagination: {
      page,
      totalPages: Math.ceil(merged.length / limit),
      hasNext: start + limit < merged.length,
      hasPrev: page > 1
    }
  };
}
```

---

## 🔒 Type Safety Flow

```
┌─────────────────────────────────────────────────────┐
│  1. API Response (unknown)                          │
│     GitHub JSON: documents.json                     │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│  2. Type Definition (types/document.ts)             │
│                                                     │
│     interface Document {                            │
│       id: number;                                   │
│       title: string;                                │
│       body: string;                                 │
│       status: 'Published' | 'Draft' | 'In Review'; │
│       ...                                           │
│     }                                               │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│  3. RTK Query Type Inference                        │
│                                                     │
│     useGetDocumentsQuery<                          │
│       PaginatedDocumentsResponse,                   │
│       QueryParams                                   │
│     >                                               │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│  4. Redux Store (Typed)                             │
│                                                     │
│     RootState = {                                   │
│       ui: UIState,                                  │
│       api: ApiState<Document[]>                     │
│     }                                               │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│  5. Component Props (Typed)                         │
│                                                     │
│     interface DocumentListProps {                   │
│       documents: Document[];                        │
│       isLoading: boolean;                           │
│       onSelect: (id: number) => void;              │
│     }                                               │
└─────────────────┬───────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────┐
│  6. Render (100% Type Safe)                         │
│                                                     │
│     {documents.map(doc =>                          │
│       <DocumentCard                                 │
│         key={doc.id}                               │
│         title={doc.title}  // ✓ Type checked       │
│         status={doc.status} // ✓ Autocomplete      │
│       />                                            │
│     )}                                              │
└─────────────────────────────────────────────────────┘
```

---

## 📱 Mobile Architecture Patterns

### 1. List-Detail Navigation Pattern

```typescript
// Mobile: List → Detail → Back to List
// Desktop: List + Detail (side-by-side)

export function DocumentsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleDocumentSelect = (id: number) => {
    dispatch(setSelectedDocumentId(id));
    if (isMobile) setShowDetail(true); // Show detail view
  };
  
  const handleBackToList = () => {
    setShowDetail(false); // Show list view
    // Don't clear selection - preserve state
  };
  
  return (
    <div className={`${styles.container} ${showDetail ? styles.showDetail : ''}`}>
      <div className={styles.documentList}>
        {/* List: visible by default on mobile */}
      </div>
      
      <div className={styles.documentPreview}>
        {/* Mobile back button */}
        {isMobile && showDetail && (
          <button onClick={handleBackToList}>← Back</button>
        )}
        {/* Detail: hidden by default on mobile */}
      </div>
    </div>
  );
}
```

### 2. Responsive CSS Strategy

```css
/* Mobile First - Base styles for mobile */
.container {
  display: flex;
  position: relative;
}

.documentList {
  width: 100%;
  height: 100%;
}

.documentPreview {
  display: none; /* Hidden by default on mobile */
}

/* Show detail view when active */
.container.showDetail .documentList {
  display: none;
}

.container.showDetail .documentPreview {
  display: block;
  width: 100%;
}

/* Tablet - Split view with collapsed sidebar */
@media (min-width: 768px) {
  .documentList {
    width: 320px;
    border-right: 1px solid var(--border-color);
  }
  
  .documentPreview {
    display: block; /* Always visible */
    flex: 1;
  }
  
  /* Override mobile classes */
  .container.showDetail .documentList {
    display: flex;
  }
}

/* Desktop - Full features */
@media (min-width: 1100px) {
  .documentList {
    width: 380px;
  }
}
```

### 3. Mobile Menu Provider Pattern

```typescript
// Context for mobile menu state
const MobileMenuContext = createContext<{
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}>();

export function MobileMenuProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <MobileMenuContext.Provider value={{
      isMenuOpen,
      openMenu: () => setIsMenuOpen(true),
      closeMenu: () => setIsMenuOpen(false),
      toggleMenu: () => setIsMenuOpen(prev => !prev)
    }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

// Usage in Topbar (hamburger)
export function Topbar() {
  const { toggleMenu } = useMobileMenu();
  
  return (
    <button className={styles.hamburger} onClick={toggleMenu}>
      ☰
    </button>
  );
}

// Usage in Sidebar (overlay)
export function Sidebar() {
  const { isMenuOpen, closeMenu } = useMobileMenu();
  
  return (
    <>
      <div className={styles.overlay} onClick={closeMenu} />
      <aside className={`${styles.sidebar} ${isMenuOpen ? styles.open : ''}`}>
        ...
      </aside>
    </>
  );
}
```

---

## 🧪 Testing Strategy (Planned)

### Unit Tests (Component Level)
```typescript
// DocumentCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DocumentCard } from './DocumentCard';

describe('DocumentCard', () => {
  it('highlights search query', () => {
    render(<DocumentCard doc={mockDoc} searchQuery="test" />);
    expect(screen.getByText(/test/i)).toHaveClass('highlighted');
  });
  
  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<DocumentCard doc={mockDoc} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(mockDoc.id);
  });
});
```

### Integration Tests (Feature Level)
```typescript
// documents.integration.test.tsx
import { renderWithProviders } from '@/test-utils';
import { DocumentsPage } from '@/app/documents/page';
import { server } from '@/mocks/server';

describe('Documents CRUD Flow', () => {
  it('creates, edits, and deletes a document', async () => {
    const { user } = renderWithProviders(<DocumentsPage />);
    
    // Create
    await user.click(screen.getByText('+ New Document'));
    await user.type(screen.getByLabelText('Title'), 'Test Doc');
    await user.click(screen.getByText('Create'));
    
    // Edit
    await user.click(screen.getByText('Test Doc'));
    await user.click(screen.getByText('Edit'));
    await user.type(screen.getByLabelText('Body'), 'Content');
    await user.click(screen.getByText('Save'));
    
    // Delete
    await user.click(screen.getByText('Delete'));
    await user.click(screen.getByText('Confirm'));
    
    expect(screen.queryByText('Test Doc')).not.toBeInTheDocument();
  });
});
```

### E2E Tests (User Journey)
```typescript
// e2e/search-workflow.spec.ts
import { test, expect } from '@playwright/test';

test('search and filter workflow', async ({ page }) => {
  await page.goto('/');
  
  // Navigate to search
  await page.click('[data-testid="search-nav"]');
  
  // Type search query
  await page.fill('[placeholder*="Search"]', 'architecture');
  
  // Apply filters
  await page.selectOption('[name="status"]', 'Published');
  await page.selectOption('[name="author"]', 'Sarah Chen');
  
  // Verify results
  await expect(page.locator('[data-testid="search-result"]')).toContainText('architecture');
  await expect(page.locator('[data-testid="status-badge"]')).toHaveText('Published');
  
  // Click result
  await page.click('[data-testid="search-result"]:first-child');
  
  // Verify navigation
  await expect(page).toHaveURL(/\/documents\?doc=\d+/);
});
```

---

## 🚀 Deployment Architecture (Future)

### Current (Static)
```
GitHub Pages / Vercel
├── Static HTML/CSS/JS
├── GitHub-hosted JSON (mock data)
└── Client-side only
```

### Future (Full Stack)
```
┌─────────────────────────────────────────────────┐
│               Vercel Edge Network               │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Next.js App (SSR + Static)            │   │
│  │                                         │   │
│  │  - Server Components                    │   │
│  │  - API Routes                           │   │
│  │  - ISR (Incremental Static Regeneration)│   │
│  └───────────────┬─────────────────────────┘   │
│                  │                              │
└──────────────────┼──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│            Database (PostgreSQL)                │
│                                                 │
│  Tables:                                        │
│  - users                                        │
│  - documents                                    │
│  - collections                                  │
│  - activities                                   │
│  - permissions                                  │
└─────────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│         Additional Services                     │
│                                                 │
│  - Redis (Session + Cache)                     │
│  - S3 (File Uploads)                           │
│  - Algolia (Full-text Search)                  │
│  - WebSocket (Real-time)                       │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Future Enhancements

### Phase 1: Foundation ✅ COMPLETE
- Project setup with Next.js 14
- Redux store with RTK Query
- UI components library
- Dashboard page

### Phase 2: Documents CRUD ✅ COMPLETE
- Documents API with RTK Query
- Document list/detail views
- Create/edit/delete operations
- LocalStorage persistence
- Activity tracking

### Phase 3: Advanced Features ✅ COMPLETE
- Collections management
- Advanced search with filters
- Activity feed
- Mobile responsive design
- Pagination system
- Grid/List views
- Avatar customization

### Phase 4: Backend Integration 📋 PLANNED
- PostgreSQL database
- Authentication (NextAuth.js)
- Real API routes
- File uploads to S3
- Server-side pagination
- Full-text search (Algolia)

### Phase 5: Collaboration 📋 PLANNED
- Real-time updates (WebSocket)
- Multi-user editing
- Comments & annotations
- Permissions system
- Team workspaces
- Activity notifications

### Phase 6: Advanced Editor 📋 PLANNED
- Rich text editor (TipTap)
- Markdown support
- Code syntax highlighting
- Embedded media
- Document templates
- Version history

---

## 📚 Key Architectural Patterns

### 1. Dependency Injection
```typescript
// Redux store injected via Provider
<Provider store={store}>
  <App />
</Provider>
```

### 2. Compound Components
```typescript
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### 3. Custom Hooks (Composition)
```typescript
// Typed Redux hooks
const dispatch = useAppDispatch();
const state = useAppSelector(state => state.ui);

// RTK Query hooks
const { data, isLoading } = useGetDocumentsQuery({ ... });
const [createDoc] = useCreateDocumentMutation();

// Custom hooks
const { isMenuOpen, toggleMenu } = useMobileMenu();
const modalRef = useFocusTrap<HTMLDivElement>(true);
```

### 4. Service Layer Pattern
```typescript
// Business logic separated from components
documentService.ts
├── getLocalDocuments()
├── createLocalDocument()
├── updateLocalDocument()
├── deleteLocalDocument()
└── mergeDocuments()
```

### 5. Provider Pattern (Context)
```typescript
// Global state without prop drilling
<MobileMenuProvider>
  <Sidebar />  {/* Can access menu state */}
  <Topbar />   {/* Can access menu state */}
</MobileMenuProvider>
```

---

## 🎓 Learning Resources

- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Server Components](https://react.dev/reference/react/use-server)

---

**Last Updated:** January 3, 2026 (v1.0 - Production Ready)  
**Maintained By:** Danish Irfan