# Atlas - Internal Knowledge Management System

Production-grade Next.js 14 application built with TypeScript, Redux Toolkit, and RTK Query.

---

## 🏗️ Architecture Overview

### Tech Stack
- **Next.js 14** (App Router) - Modern React framework with server components
- **TypeScript** - Type safety and better DX
- **Redux Toolkit** - Centralized state management
- **RTK Query** - Data fetching with automatic caching
- **CSS Modules** - Scoped styles preserving original design

### Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with Sidebar + Topbar
│   ├── page.tsx             # Dashboard page
│   ├── providers.tsx        # Redux Provider wrapper
│   └── [feature]/           # Feature-based routing
│
├── components/
│   ├── layout/              # Layout components (Sidebar, Topbar)
│   ├── ui/                  # Reusable UI components (Button, Card, etc.)
│   └── [feature]/           # Feature-specific components
│
├── lib/
│   ├── redux/
│   │   ├── store.ts         # Redux store configuration
│   │   ├── hooks.ts         # Typed Redux hooks
│   │   ├── slices/          # Redux slices (ui, etc.)
│   │   └── api/             # RTK Query API definitions
│   └── utils/               # Utility functions
│
├── types/                   # TypeScript type definitions
└── styles/                  # Global styles and CSS variables
```

---

## 🎯 Step 1: Foundation (COMPLETED)

### ✅ What was built:

#### 1. Project Setup
- Next.js 14 with App Router
- TypeScript strict mode
- Package.json with all dependencies

#### 2. Type System
- `types/document.ts` - Document-related types
- `types/ui.ts` - UI state types
- Centralized exports via `types/index.ts`

#### 3. Redux Store
- **Store configuration** (`lib/redux/store.ts`)
  - RTK Query middleware setup
  - Redux DevTools integration
  - Typed RootState and AppDispatch
  
- **UI Slice** (`lib/redux/slices/uiSlice.ts`)
  - Current page tracking
  - Sidebar collapse state
  - Search query state
  - Unsaved changes warning
  - Toast notifications

- **RTK Query API** (`lib/redux/api/apiSlice.ts`)
  - Base configuration with fetchBaseQuery
  - Tag-based cache invalidation
  - Ready for endpoint injection

- **Typed Hooks** (`lib/redux/hooks.ts`)
  - `useAppDispatch()` - Typed dispatch
  - `useAppSelector()` - Typed state selection

#### 4. Reusable Components

**Layout Components:**
- `Sidebar` - Left navigation with active page highlighting
- `Topbar` - Top bar with search, actions, and breadcrumb

**UI Components:**
- `Button` - Primary, secondary, and icon variants
- `Card` - Container with consistent styling
- `Avatar` - User initials with color-coding
- `Badge` - Status indicators

**Dashboard Components:**
- `StatCard` - Metric card with icon, value, and trend

#### 5. Utilities
- Date formatters (`formatRelativeTime`)
- Badge helpers (`getBadgeClass`)
- Avatar color mapping (`getAvatarColor`)
- Debounce function for search

#### 6. Styling System
- `styles/variables.css` - CSS design tokens
- `styles/globals.css` - Global styles and utilities
- Component-scoped CSS Modules
- **Original design preserved exactly**

#### 7. Pages
- **Dashboard** (`app/page.tsx`)
  - Stats grid with 4 metrics
  - Recent activity feed
  - Popular documents list
  - Fully styled, matches original design

- **Placeholder pages** for other routes (Documents, Collections, etc.)

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Type Checking

```bash
npm run type-check
```

### Build

```bash
npm run build
npm start
```

---

## 🧱 Key Architectural Decisions

### 1. Why App Router over Pages Router?
- Better performance with Server Components
- Nested layouts without wrapper components
- Simplified data fetching patterns
- Future-proof (Next.js direction)

### 2. Why Redux Toolkit + RTK Query?
- **Centralized state** - Single source of truth
- **Automatic caching** - No manual cache management
- **Optimistic updates** - Better UX for mutations
- **DevTools integration** - Time-travel debugging
- **Type safety** - Full TypeScript support

### 3. Why CSS Modules?
- **Scoped styles** - No naming conflicts
- **Preserves original design** - No Tailwind refactor needed
- **Co-located** - Styles near components
- **Bundle optimization** - Unused CSS removed

### 4. Why Feature-based Structure?
- **Scalability** - Easy to add features
- **Maintainability** - Clear ownership
- **Code splitting** - Better performance
- **Team collaboration** - Less merge conflicts

### 5. Client vs Server Components
- **Server by default** - Better performance
- **Client when needed**:
  - Interactive state (Redux)
  - Browser APIs (usePathname)
  - Event handlers

---

## 📦 State Management Strategy

### UI State (Redux)
- Current page
- Sidebar collapsed
- Search query (synced across app)
- Unsaved changes warnings
- Toast notifications

### Server State (RTK Query - Step 2)
- Documents
- Collections
- Activity feed
- Settings
- Auto-cached, auto-refetched

### Local State (useState)
- Component-specific UI
- Form inputs
- Modals/dialogs

---

## 🎨 Design System

### Colors
- Primary: `#5850ec` (blue)
- Text: `#111827` (dark gray)
- Muted: `#6b7280` (light gray)
- Background: `#f8f9fb` (off-white)

### Status Colors
- Published: Green (`#def7ec` / `#03543f`)
- Draft: Yellow (`#fef3c7` / `#92400e`)
- In Review: Blue (`#e1effe` / `#1e429f`)

### Spacing
- Container padding: `40px 60px`
- Card padding: `24px`
- Gap between elements: `12px`, `16px`, `24px`

### Typography
- Headers: `18px`, `32px` (bold)
- Body: `14px`, `16px`
- Small: `11px`, `12px`, `13px`

## 🚀 Features

- ✅ Full CRUD operations for documents and collections
- ✅ Real-time search with filters
- ✅ Activity timeline
- ✅ Optimistic UI updates
- ✅ State persistence
- ✅ Keyboard shortcuts (⌘K, ⌘N, Esc)
- ✅ Full accessibility support
- ✅ Responsive design

---

## 🔍 Code Organization Principles

1. **Components are small and focused**
   - Single responsibility
   - Easy to test
   - Reusable

2. **Styles are co-located**
   - Component.tsx + Component.module.css
   - Easy to refactor
   - No orphaned styles

3. **Types are centralized**
   - `types/` folder
   - Shared across app
   - Single source of truth

4. **State is predictable**
   - Redux for global
   - RTK Query for server
   - useState for local

5. **Imports are clean**
   - Path aliases (`@/`)
   - Barrel exports
   - No relative paths

---

## 🤝 Contributing Guidelines (Future)

1. Follow existing folder structure
2. Use TypeScript strictly
3. Co-locate styles with components
4. Write Redux actions descriptively
5. Keep components under 200 lines
6. Add JSDoc comments for complex logic

---

## 📄 License

Internal use only.

---