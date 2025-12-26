# Atlas Architecture Documentation

## 📐 System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                  App Router                          │  │
│  │                                                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│  │  │Dashboard │  │Documents │  │Collections│  ...    │  │
│  │  │  (SSR)   │  │  (SSR)   │  │   (SSR)   │         │  │
│  │  └──────────┘  └──────────┘  └──────────┘         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │            Client-Side State (Redux)                │  │
│  │                                                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│  │  │ UI Slice │  │RTK Query │  │  Future  │         │  │
│  │  │          │  │  Cache   │  │  Slices  │         │  │
│  │  └──────────┘  └──────────┘  └──────────┘         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                  Components                          │  │
│  │                                                      │  │
│  │  Layout  ─────  UI  ─────  Feature-Specific        │  │
│  │  (Sidebar)     (Button)   (StatCard)               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Read Flow (Fetching Data)

```
User Action (Click)
    ↓
Component dispatches RTK Query hook
    ↓
RTK Query checks cache
    ↓
Cache Hit?  ──Yes──> Return cached data
    ↓ No
Fetch from API
    ↓
Store in cache
    ↓
Update component
```

### Write Flow (Mutations)

```
User Action (Save)
    ↓
Component dispatches mutation
    ↓
Optimistic Update (optional)
    ↓
Send request to API
    ↓
Success?  ──Yes──> Invalidate cache tags
    ↓             ──> Refetch affected queries
    ↓ No
Rollback optimistic update
    ↓
Show error toast
```

---

## 🗂️ File Structure Explained

### App Router Pattern

```
app/
├── layout.tsx              # Root layout (persistent)
│   ├── Sidebar             # Always visible
│   └── Topbar              # Always visible
│
├── page.tsx                # Dashboard (/)
│
├── documents/
│   └── page.tsx            # Documents page (/documents)
│
└── [feature]/
    └── page.tsx            # Other pages
```

**Why this structure?**
- Automatic routing (no router config)
- Nested layouts without wrappers
- Code splitting per route
- SEO-friendly URLs

---

## 🔐 State Management Layers

### Layer 1: Server Components (Default)
```typescript
// No state, just pure rendering
export default function Page() {
  return <StaticContent />;
}
```
**Use for:** Static content, layouts

### Layer 2: Client Components (Interactive)
```typescript
'use client';

// Can use React hooks
export function InteractiveButton() {
  const [clicked, setClicked] = useState(false);
  return <button onClick={() => setClicked(true)}>...</button>;
}
```
**Use for:** Forms, modals, interactive UI

### Layer 3: Redux (Global State)
```typescript
'use client';

import { useAppSelector } from '@/lib/redux/hooks';

export function CurrentPage() {
  const page = useAppSelector(state => state.ui.currentPage);
  return <div>{page}</div>;
}
```
**Use for:** UI state, toasts, sidebar state

### Layer 4: RTK Query (Server State)
```typescript
'use client';

import { useGetDocumentsQuery } from '@/lib/redux/api/documentsApi';

export function DocumentList() {
  const { data, isLoading } = useGetDocumentsQuery();
  return <div>{/* render documents */}</div>;
}
```
**Use for:** API data, caching, mutations

---

## 🎨 Component Architecture

### Component Hierarchy

```
App
├── RootLayout
│   ├── Sidebar (Client)
│   │   └── NavItem (Client)
│   │
│   ├── Topbar (Client)
│   │   ├── SearchBar (Client)
│   │   ├── Button (Client)
│   │   └── Avatar (Client)
│   │
│   └── Page Content (Server/Client)
│       ├── Dashboard (Server)
│       │   ├── StatCard (Server)
│       │   └── Card (Server)
│       │
│       └── Documents (Client) [Step 2]
│           ├── DocumentList (Client)
│           └── DocumentPreview (Client)
```

### Component Types

**Presentational Components**
- Pure functions
- No state management
- Receive props, render UI
- Examples: Card, Button, Badge

**Container Components**
- Connect to Redux/RTK Query
- Handle business logic
- Pass data to presentational components
- Examples: DocumentList, Dashboard

**Layout Components**
- Persistent across routes
- Provide structure
- Examples: Sidebar, Topbar

---

## 🔌 Redux Store Structure

```typescript
{
  ui: {
    currentPage: 'dashboard',
    sidebarCollapsed: false,
    searchQuery: '',
    hasUnsavedChanges: false,
    toasts: []
  },
  
  api: {
    queries: {
      // Auto-managed by RTK Query
      'getDocuments(undefined)': {
        status: 'fulfilled',
        data: [...],
        requestId: 'xyz'
      }
    },
    mutations: {
      // Tracked mutations
    }
  },
  
  // Future slices
  auth: { ... },
  settings: { ... }
}
```

---

## 🎯 Performance Optimizations

### 1. Code Splitting
- Automatic per-route splitting
- Dynamic imports for modals
- Lazy loading for heavy components

### 2. Server Components
- No JavaScript shipped to client
- Faster initial page load
- Better SEO

### 3. RTK Query Caching
- Automatic request deduplication
- Configurable cache times
- Background refetching

### 4. CSS Optimization
- CSS Modules tree-shaking
- Critical CSS inlined
- Unused styles removed

---

## 🔒 Type Safety

### Type Flow

```
API Response (unknown)
    ↓
Zod validation (optional)
    ↓
TypeScript types (Document, etc.)
    ↓
Redux store (typed)
    ↓
React components (typed props)
    ↓
Render (type-safe)
```

### Type Definitions

```typescript
// Central type definitions
types/
├── document.ts       # Document, DocumentStatus
├── ui.ts            # PageType, UIState, Toast
└── index.ts         # Export all types
```

---

## 🧪 Testing Strategy (Future)

### Unit Tests
- Components with Jest + Testing Library
- Redux slices with RTK test utils
- Utility functions

### Integration Tests
- User flows (create document, search)
- RTK Query + MSW mocking

### E2E Tests
- Playwright for critical paths
- Dashboard → Create → Edit → Delete

---

## 🚀 Deployment Pipeline (Future)

```
Git Push
    ↓
GitHub Actions
    ↓
Type Check → Lint → Test
    ↓
Build Next.js
    ↓
Deploy to Vercel
    ↓
Cache invalidation
```

---

## 🔄 Future Enhancements

### Phase 1: Foundation (✅ DONE)
- Project setup
- Redux store
- Basic components
- Dashboard page

### Phase 2: Documents CRUD
- RTK Query endpoints
- Document list/preview
- Create/edit/delete
- Filters and sort

### Phase 3: Advanced Features
- Search with highlighting
- Collections management
- Activity feed
- Settings persistence

### Phase 4: Polish
- Keyboard shortcuts
- Offline support
- Real-time updates (WebSocket)
- Analytics

### Phase 5: Scale
- Multi-workspace support
- Team collaboration
- Permissions system
- Audit logs

---

## 📚 Key Patterns Used

### 1. Dependency Injection
```typescript
// Store injected via Provider
<Provider store={store}>
  <App />
</Provider>
```

### 2. Compound Components
```typescript
<Card>
  <Card.Header>...</Card.Header>
  <Card.Body>...</Card.Body>
</Card>
```

### 3. Render Props (Future)
```typescript
<DataFetcher
  endpoint="/documents"
  render={({ data }) => <List items={data} />}
/>
```

### 4. Custom Hooks
```typescript
// Typed Redux hooks
useAppDispatch()
useAppSelector()

// RTK Query auto-generated hooks
useGetDocumentsQuery()
useCreateDocumentMutation()
```

---

## 🎓 Learning Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated:** Step 1 Completion
**Maintained By:** Danish
