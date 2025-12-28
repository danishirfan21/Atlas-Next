import { useEffect, useRef } from 'react';

/**
 * Focus trap for modals and dialogs
 * Keeps focus within the component
 */

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  isActive: boolean = true
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;

    const element = elementRef.current;
    if (!element) return;

    // Get all focusable elements
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on mount
    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTab);

    return () => {
      element.removeEventListener('keydown', handleTab);
    };
  }, [isActive]);

  return elementRef;
}
