import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Topbar } from '@/components/layout/Topbar/Topbar';
import { Providers } from './providers';
import '@/styles/globals.css';

/**
 * Root Layout
 * 
 * Architecture decisions:
 * 1. Server component by default (better performance)
 * 2. Providers wrapper for client-side Redux
 * 3. Persistent sidebar + topbar layout
 * 4. Global styles imported once
 * 
 * Layout structure matches original design:
 * [Sidebar] [Main Content]
 *           [Topbar]
 *           [Page Content]
 */

export const metadata: Metadata = {
  title: 'Atlas - Internal Knowledge Management',
  description: 'Production-grade knowledge management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Left Sidebar - Fixed width, always visible */}
            <Sidebar />

            {/* Main Content Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Top Bar - Fixed height */}
              <Topbar />

              {/* Page Content - Scrollable */}
              <div style={{ flex: 1, overflow: 'auto' }}>
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
