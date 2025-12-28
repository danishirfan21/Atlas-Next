# Accessibility Guidelines - Atlas

## Keyboard Navigation

### Global Shortcuts
- **Cmd/Ctrl + K**: Focus search input
- **Cmd/Ctrl + N**: New document/collection (context-aware)
- **Escape**: Close modals, cancel edit mode
- **Tab**: Navigate forward through interactive elements
- **Shift + Tab**: Navigate backward through interactive elements

### Document List
- **Arrow Up/Down**: Navigate between documents
- **Enter**: Select and open document
- **Space**: Select document

### Modal Dialogs
- **Tab**: Cycle through form fields
- **Escape**: Close modal
- **Enter**: Submit form (when in input)

## Screen Reader Support

### ARIA Labels
- All interactive elements have descriptive labels
- Navigation landmarks properly labeled
- Modal dialogs have `role="dialog"` and `aria-modal="true"`
- Form inputs have associated `<label>` elements

### Live Regions
- Toast notifications use implicit ARIA live regions
- Status updates announced to screen readers
- Error messages properly associated with inputs

## Focus Management

### Visual Indicators
- 2px blue outline on all focused elements
- Offset for better visibility
- Distinct from hover states

### Focus Trapping
- Modals trap focus within dialog
- Tab cycles through modal elements only
- Escape returns focus to trigger element

### Skip Links
- "Skip to main content" link for keyboard users
- Visible only when focused
- Jumps past navigation to main content

## Color & Contrast

### WCAG AA Compliance
- Text contrast ratio: minimum 4.5:1
- Interactive elements: minimum 3:1
- Focus indicators: minimum 3:1

### Color Independence
- Never convey information by color alone
- Status badges include text labels
- Icons paired with text descriptions

## Motion & Animation

### Reduced Motion
- Respects `prefers-reduced-motion` setting
- Animations disabled for sensitive users
- Transitions shortened to 0.01ms

### Animation Guidelines
- Subtle, purposeful animations
- No auto-playing videos or carousels
- User-triggered animations only

## Forms & Inputs

### Labels & Instructions
- All inputs have visible labels
- Required fields marked with `aria-required`
- Error messages associated with inputs

### Validation
- Inline error messages
- Clear, actionable error text
- Focus moved to first error on submit

### Autocomplete
- Appropriate autocomplete attributes
- Search inputs with `role="search"`
- Debounced to reduce noise

## Testing Checklist

### Keyboard Only
- [ ] Can navigate entire app with keyboard
- [ ] All interactive elements focusable
- [ ] Focus order is logical
- [ ] No keyboard traps (except modals)
- [ ] Skip link works correctly

### Screen Reader
- [ ] All content readable
- [ ] Navigation landmarks clear
- [ ] Form labels announced
- [ ] Button purposes clear
- [ ] Status updates announced

### Visual
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Text resizable to 200%
- [ ] No content loss when zoomed

### Tools Used
- Chrome DevTools Lighthouse
- axe DevTools
- NVDA (Windows)
- VoiceOver (macOS)
- Keyboard only testing

## Browser Support

### Minimum Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Core functionality without JavaScript
- CSS Grid with flexbox fallback
- Modern features with polyfills

## Future Improvements

### Planned
- [ ] High contrast mode support
- [ ] Customizable keyboard shortcuts
- [ ] Voice control commands
- [ ] Screen magnifier optimization

### Under Consideration
- [ ] Right-to-left (RTL) language support
- [ ] Custom focus indicator colors
- [ ] Keyboard navigation hints/tooltips
- [ ] Accessibility settings page

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)

---

**Last Updated**: Step 4.6 Completion
**Maintained By**: Atlas Team