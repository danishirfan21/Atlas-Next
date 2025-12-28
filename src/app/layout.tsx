import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Topbar } from '@/components/layout/Topbar/Topbar';
import { ToastContainer } from '@/components/ui/Toast/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary/ErrorBoundary';
import { Providers } from './providers';
import '@/styles/globals.css';
import { PersistenceIndicator } from '@/components/ui/PersistenceIndicator/PersistenceIndicator';

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
        <ErrorBoundary>
          <Providers>
            <div
              style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}
            >
              {/* Left Sidebar - Fixed width, always visible */}
              <Sidebar />

              {/* Main Content Area */}
              <main
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Top Bar - Fixed height */}
                <Topbar />

                {/* Page Content - Scrollable */}
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <ErrorBoundary>{children}</ErrorBoundary>
                </div>
              </main>
            </div>

            {/* Toast Notifications */}
            <ToastContainer />

            {/* Persistence Indicator */}
            <PersistenceIndicator />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
