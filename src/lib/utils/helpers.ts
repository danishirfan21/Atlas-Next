/**
 * Format a date as relative time (e.g., "2 hours ago")
 * Returns a static formatted date during SSR to prevent hydration issues
 */
export function formatRelativeTime(date: Date | string, nowOverride?: Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // During SSR, return ISO date string to prevent hydration mismatch
  if (typeof window === 'undefined' && !nowOverride) {
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
  
  const now = nowOverride || new Date();
  const diff = now.getTime() - dateObj.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Get badge CSS class based on document status
 */
export function getBadgeClass(status: string): string {
  const statusMap: Record<string, string> = {
    Published: 'badge-published',
    Draft: 'badge-draft',
    'In Review': 'badge-review',
  };
  return statusMap[status] || 'badge-draft';
}

/**
 * Capitalize first letter of string
 */
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get avatar color by initials
 */
export function getAvatarColor(initials: string): string {
  const colors: Record<string, string> = {
    SC: '#3b82f6',
    MR: '#10b981',
    AM: '#f59e0b',
    DP: '#ec4899',
    EW: '#8b5cf6',
    RK: '#06b6d4',
    DK: '#5850ec',
  };
  return colors[initials] || '#6b7280';
}

/**
 * Debounce function for search and other delayed actions
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
