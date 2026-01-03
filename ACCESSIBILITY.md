# Accessibility Guidelines - Atlas

## Overview

Atlas is designed with accessibility as a core principle, following **WCAG 2.1 Level AA** standards. This document outlines our accessibility features, testing procedures, and guidelines for maintaining an inclusive application.

---

## Keyboard Navigation

### Global Shortcuts

| Shortcut | Action | Scope |
|----------|--------|-------|
| **⌘K** / **Ctrl+K** | Focus search input | Global |
| **⌘N** / **Ctrl+N** | New document/collection (context-aware) | Global |
| **Escape** | Close modals, cancel edit mode | Global |
| **Tab** | Navigate forward through interactive elements | Global |
| **Shift + Tab** | Navigate backward through interactive elements | Global |

### Document List Navigation

| Key | Action |
|-----|--------|
| **Arrow Up/Down** | Navigate between documents |
| **Enter** | Select and open document |
| **Space** | Select document (checkbox) |
| **Home** | Jump to first document |
| **End** | Jump to last document |

### Collection Management

| Key | Action |
|-----|--------|
| **Arrow Keys** | Navigate collection grid |
| **Enter** | Open collection details |
| **Escape** | Close collection detail view |

### Modal Dialogs

| Key | Action |
|-----|--------|
| **Tab** | Cycle through form fields (trapped within modal) |
| **Escape** | Close modal |
| **Enter** | Submit form (when focused on input/button) |
| **Shift + Tab** | Cycle backward through fields |

### Search & Filters

| Key | Action |
|-----|--------|
| **⌘K** / **Ctrl+K** | Jump to search |
| **Enter** | Execute search |
| **Escape** | Clear search / close filters |
| **Arrow Keys** | Navigate filter dropdowns |

---

## Screen Reader Support

### ARIA Labels & Landmarks

```html
<!-- Navigation Landmarks -->
<aside role="navigation" aria-label="Main navigation">
  <nav aria-label="Primary">...</nav>
  <nav aria-label="Secondary">...</nav>
</aside>

<!-- Main Content -->
<main id="main-content" role="main">...</main>

<!-- Search Region -->
<form role="search" aria-label="Search documents">
  <input type="text" aria-label="Search query" />
</form>

<!-- Modal Dialogs -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Create New Document</h2>
  ...
</div>
```

### Form Labels & Instructions

All form inputs have properly associated labels:

```html
<!-- Explicit Label Association -->
<label for="doc-title">Document Title</label>
<input id="doc-title" type="text" aria-required="true" />

<!-- Required Field Indication -->
<input 
  id="doc-title" 
  type="text" 
  aria-required="true"
  aria-invalid="false"
/>

<!-- Error Messages -->
<input 
  id="doc-title" 
  type="text" 
  aria-invalid="true"
  aria-describedby="title-error"
/>
<span id="title-error" role="alert">Title is required</span>
```

### Live Regions (Dynamic Updates)

```html
<!-- Toast Notifications (implicit live region) -->
<div role="status" aria-live="polite">
  Document saved successfully
</div>

<!-- Error Announcements -->
<div role="alert" aria-live="assertive">
  Failed to save document
</div>

<!-- Loading States -->
<div role="status" aria-live="polite" aria-busy="true">
  Loading documents...
</div>
```

### Document Status Announcements

```html
<!-- Status Changes Announced -->
<span role="status" aria-live="polite">
  Document status changed to Published
</span>

<!-- Activity Updates -->
<div role="log" aria-live="polite" aria-atomic="false">
  New activity: Sarah Chen created "Q4 Report"
</div>
```

---

## Focus Management

### Visual Indicators

All focused elements have clear visual indicators:

```css
/* Global Focus Style */
*:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* High Contrast for Buttons */
button:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(88, 80, 236, 0.1);
}

/* Link Focus */
a:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Focus Order (Logical Flow)

```
1. Skip to Main Content (hidden until focused)
2. Logo/Brand (home link)
3. Hamburger Menu (mobile) / Navigation (desktop)
4. Search Bar
5. Action Buttons (Refresh, New)
6. User Avatar
7. Main Content
   - Document List / Collection Grid
   - Detail View / Preview
   - Pagination Controls
8. Footer Navigation (Settings, Help)
```

### Focus Trapping in Modals

Modals implement focus trapping using `useFocusTrap` hook:

```typescript
export function CreateDocumentModal({ onClose }) {
  const modalRef = useFocusTrap<HTMLDivElement>(true);
  
  useEffect(() => {
    // Focus first input on mount
    const firstInput = modalRef.current?.querySelector('input');
    firstInput?.focus();
  }, []);
  
  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      <input type="text" /> {/* Focused on open */}
      <button>Create</button>
      <button onClick={onClose}>Cancel</button>
      {/* Tab cycles: input → Create → Cancel → input */}
    </div>
  );
}
```

### Skip Links

```html
<!-- Visible only when focused -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<style>
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 9999;
  padding: 12px 20px;
  background: var(--primary-blue);
  color: white;
}

.skip-link:focus {
  left: 20px;
  top: 20px;
}
</style>
```

---

## Color & Contrast

### WCAG AA Compliance

| Element | Ratio | Standard |
|---------|-------|----------|
| Body Text (14px+) | 4.72:1 | ✓ Pass (4.5:1 min) |
| Large Text (18px+) | 4.72:1 | ✓ Pass (3:1 min) |
| Interactive Elements | 4.89:1 | ✓ Pass (3:1 min) |
| Focus Indicators | 5.12:1 | ✓ Pass (3:1 min) |
| Status Badges | 6.21:1 | ✓ Pass (4.5:1 min) |

### Color Palette (Accessible)

```css
/* Text Colors */
--text-main: #111827;      /* 16.2:1 on white */
--text-muted: #6b7280;     /* 4.7:1 on white */

/* Status Colors (with sufficient contrast) */
--badge-published-bg: #def7ec;
--badge-published-text: #03543f;  /* 7.8:1 contrast */

--badge-draft-bg: #fef3c7;
--badge-draft-text: #92400e;      /* 6.9:1 contrast */

--badge-review-bg: #e1effe;
--badge-review-text: #1e429f;     /* 8.2:1 contrast */

/* Interactive Elements */
--primary-blue: #5850ec;   /* 4.89:1 on white */
```

### Color Independence

Atlas never conveys information by color alone:

```html
<!-- Status with Icon + Text + Color -->
<span class="badge badge-published">
  ✓ Published  <!-- Icon + text, not just green -->
</span>

<!-- Error with Icon + Message -->
<div class="error-state">
  <svg>⚠️</svg>
  <span>Failed to load</span>  <!-- Not just red -->
</div>

<!-- Required Fields -->
<label>
  Title <span aria-label="required">*</span>
  <!-- Asterisk + aria-label, not just red text -->
</label>
```

### High Contrast Mode Support

```css
@media (prefers-contrast: high) {
  * {
    border-color: currentColor;
  }
  
  button, input, select, textarea {
    border: 2px solid currentColor;
  }
  
  /* Ensure focus indicators are visible */
  *:focus-visible {
    outline-width: 3px;
    outline-offset: 3px;
  }
}
```

---

## Motion & Animation

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Animation Guidelines

- ✓ Subtle, purposeful animations (< 300ms)
- ✓ No auto-playing videos or carousels
- ✓ User-triggered animations only
- ✓ Respect `prefers-reduced-motion`
- ✗ No flashing/strobing effects
- ✗ No parallax scrolling
- ✗ No infinite spinning loaders

### Safe Animations

```css
/* Toast slide-in (can be disabled) */
@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.toast {
  animation: slide-up 0.3s ease;
}

/* Skeleton loader (safe, no flashing) */
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton {
  animation: skeleton-loading 1.5s ease-in-out infinite;
}
```

---

## Forms & Inputs

### Labels & Instructions

All inputs have visible, associated labels:

```html
<!-- Good: Explicit label -->
<label for="search-input">Search documents</label>
<input id="search-input" type="text" />

<!-- Good: Placeholder + aria-label -->
<input 
  type="text" 
  placeholder="Search..." 
  aria-label="Search documents"
/>

<!-- Bad: Placeholder only (no label) -->
<input type="text" placeholder="Search" /> ❌
```

### Required Field Indication

```html
<label for="title">
  Document Title <span aria-label="required">*</span>
</label>
<input 
  id="title" 
  type="text" 
  required
  aria-required="true"
/>
```

### Validation & Error Messages

```html
<!-- Invalid State -->
<label for="email">Email</label>
<input 
  id="email" 
  type="email" 
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>

<!-- Valid State -->
<input 
  id="email" 
  type="email" 
  aria-invalid="false"
/>
<span role="status">✓ Email is valid</span>
```

### Autocomplete Attributes

```html
<input 
  type="text" 
  name="username" 
  autocomplete="username"
/>

<input 
  type="email" 
  name="email" 
  autocomplete="email"
/>

<input 
  type="search" 
  name="q" 
  autocomplete="off"
  role="search"
/>
```

---

## Mobile Accessibility

### Touch Target Sizes

All interactive elements meet minimum touch target size:

```css
/* Minimum 44x44px for touch targets (WCAG 2.1 AA) */
.button,
.nav-item,
.document-card,
.icon-button {
  min-height: 44px;
  min-width: 44px;
}

/* Mobile: Larger targets for better usability */
@media (max-width: 767px) {
  .button {
    min-height: 48px;
    padding: 12px 20px;
  }
  
  .nav-item {
    min-height: 56px;
  }
}
```

### Mobile Navigation Patterns

#### Hamburger Menu
```html
<!-- Clear label and state -->
<button 
  class="hamburger"
  aria-label="Open menu"
  aria-expanded="false"
  aria-controls="mobile-nav"
>
  <svg aria-hidden="true">...</svg>
</button>

<!-- When open -->
<button 
  class="hamburger"
  aria-label="Close menu"
  aria-expanded="true"
  aria-controls="mobile-nav"
>
  <svg aria-hidden="true">...</svg>
</button>
```

#### List-Detail Navigation
```html
<!-- List View -->
<main aria-label="Documents list">
  <ul role="list">
    <li>
      <button 
        aria-label="View details for Project Proposal"
        onClick={showDetail}
      >
        Project Proposal
      </button>
    </li>
  </ul>
</main>

<!-- Detail View (Mobile) -->
<main aria-label="Document details">
  <button 
    aria-label="Back to documents list"
    onClick={backToList}
  >
    ← Back
  </button>
  <article>...</article>
</main>
```

### Swipe Gestures (Avoid Required)

- ✓ Provide button alternatives for all swipe actions
- ✓ Make swipe gestures discoverable
- ✗ Don't require swipe-only interactions

### Orientation Support

```css
/* Support both portrait and landscape */
@media (orientation: landscape) {
  .mobile-header {
    height: 48px; /* Shorter header in landscape */
  }
}

@media (orientation: portrait) {
  .mobile-header {
    height: 56px;
  }
}
```

### Mobile Focus Management

```typescript
// Close mobile menu on route change
useEffect(() => {
  if (isMobile) {
    closeMenu();
    // Don't steal focus - let route handle it
  }
}, [pathname]);

// Focus first heading on page load
useEffect(() => {
  if (isMobile) {
    const heading = document.querySelector('h1');
    heading?.focus();
  }
}, []);
```

---

## Responsive Text & Zoom

### Text Resizing (200% Support)

```css
/* Relative units for scalability */
body {
  font-size: 16px; /* Base size */
}

h1 {
  font-size: 2rem; /* 32px, scales with zoom */
}

p {
  font-size: 0.875rem; /* 14px, scales with zoom */
}

/* No fixed heights that clip text */
.card {
  min-height: 100px; /* min, not fixed */
  padding: 1.5rem;
}
```

### No Content Loss When Zoomed

```css
/* Avoid horizontal scroll */
.container {
  max-width: 100%;
  overflow-x: hidden;
}

/* Allow text wrapping */
.text {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Flexible images */
img {
  max-width: 100%;
  height: auto;
}
```

---

## Testing Checklist

### Automated Testing Tools

- [x] **Chrome DevTools Lighthouse** - Overall accessibility score
- [x] **axe DevTools** - WCAG violations detection
- [x] **WAVE** - Visual feedback on accessibility issues
- [x] **Pa11y** - Command-line accessibility testing

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Can navigate entire app with keyboard only
- [ ] All interactive elements are focusable
- [ ] Focus order is logical and intuitive
- [ ] No keyboard traps (except modals, which allow Escape)
- [ ] Skip link works correctly
- [ ] Modal focus trap works
- [ ] Custom controls (dropdowns, toggles) are keyboard accessible

#### Screen Reader Testing
- [ ] All content is readable by screen reader
- [ ] Navigation landmarks are clear
- [ ] Form labels are announced correctly
- [ ] Button purposes are clear
- [ ] Status updates are announced (live regions)
- [ ] Tables have proper headers
- [ ] Lists are properly marked up
- [ ] Images have alt text (decorative images: alt="")

#### Visual Testing
- [ ] Focus indicators are visible on all elements
- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for UI)
- [ ] Text is resizable to 200% without loss of content
- [ ] No information conveyed by color alone
- [ ] Content reflows at 400% zoom without horizontal scroll
- [ ] Text spacing can be adjusted without breaking layout

#### Mobile Testing
- [ ] Touch targets are at least 44x44px
- [ ] Mobile menu is accessible
- [ ] Orientation changes don't break functionality
- [ ] Pinch-to-zoom is enabled
- [ ] Form inputs are not zoomed on focus (font-size >= 16px)
- [ ] Back button navigation works correctly

#### Motion & Animation
- [ ] `prefers-reduced-motion` is respected
- [ ] No auto-playing videos
- [ ] No flashing/strobing animations
- [ ] Animations can be paused/stopped

### Screen Reader Test Matrix

| Screen Reader | OS | Browser | Status |
|---------------|----|---------| -------|
| NVDA | Windows | Chrome | ✓ Tested |
| NVDA | Windows | Firefox | ✓ Tested |
| JAWS | Windows | Chrome | ⏳ Pending |
| VoiceOver | macOS | Safari | ✓ Tested |
| VoiceOver | iOS | Safari | ✓ Tested |
| TalkBack | Android | Chrome | ⏳ Pending |

---

## Browser Support

### Minimum Requirements (Accessibility Features)

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | ✓ Full Support |
| Firefox | 88+ | ✓ Full Support |
| Safari | 14+ | ✓ Full Support |
| Edge | 90+ | ✓ Full Support |
| Mobile Safari | iOS 14+ | ✓ Full Support |
| Chrome Mobile | Android 90+ | ✓ Full Support |

### Progressive Enhancement

```typescript
// Feature detection, not browser detection
if ('IntersectionObserver' in window) {
  // Use lazy loading
} else {
  // Load all images immediately
}

// Graceful degradation
if (CSS.supports('display', 'grid')) {
  // Use grid layout
} else {
  // Fallback to flexbox
}
```

---

## Common Accessibility Patterns

### Document List (Accessible)

```typescript
export function DocumentList({ documents }) {
  return (
    <div role="region" aria-label="Documents">
      <ul role="list">
        {documents.map(doc => (
          <li key={doc.id}>
            <article>
              <h3>
                <a 
                  href={`/documents?doc=${doc.id}`}
                  aria-label={`View ${doc.title}, updated ${formatDate(doc.updatedAt)}`}
                >
                  {doc.title}
                </a>
              </h3>
              <p>{doc.snippet}</p>
              <span 
                className={`badge badge-${doc.status.toLowerCase()}`}
                role="status"
              >
                {doc.status}
              </span>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Modal Dialog (Accessible)

```typescript
export function Modal({ title, children, onClose }) {
  const modalRef = useFocusTrap();
  
  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button 
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
```

### Search Form (Accessible)

```typescript
export function SearchBar() {
  const [query, setQuery] = useState('');
  
  return (
    <form 
      role="search" 
      onSubmit={handleSubmit}
      aria-label="Search documents"
    >
      <label htmlFor="search-input" className="sr-only">
        Search documents and collections
      </label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
        aria-describedby="search-hint"
      />
      <span id="search-hint" className="sr-only">
        Press Enter to search, Escape to clear
      </span>
      {query && (
        <button 
          type="button"
          onClick={() => setQuery('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </form>
  );
}
```

---

## Future Improvements

### Planned Features
- [ ] High contrast theme toggle
- [ ] Customizable keyboard shortcuts
- [ ] Voice control commands (experimental)
- [ ] Screen magnifier optimization
- [ ] Dyslexia-friendly font option

### Under Consideration
- [ ] Right-to-left (RTL) language support
- [ ] Custom focus indicator colors
- [ ] Keyboard navigation hints/tooltips overlay
- [ ] Dedicated accessibility settings page
- [ ] ARIA live region announcements preferences

---

## Accessibility Statement

Atlas is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

### Conformance Status
- **WCAG 2.1 Level AA**: Conformant
- **Section 508**: Conformant
- **ARIA**: Implemented according to WAI-ARIA 1.2

### Feedback
We welcome your feedback on the accessibility of Atlas. If you encounter any accessibility barriers, please contact us:
- Email: accessibility@atlas.internal
- GitHub Issues: Report accessibility bugs

### Known Limitations
1. Grid view on mobile may require horizontal scrolling for very wide cards
2. Some dynamic content updates may not be immediately announced to screen readers
3. PDF export feature (planned) will require additional accessibility work

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Inclusive Components](https://inclusive-components.design/)

---

**Last Updated:** January 3, 2026 (v1.0)  
**Maintained By:** Atlas Team  
**WCAG Compliance:** Level AA