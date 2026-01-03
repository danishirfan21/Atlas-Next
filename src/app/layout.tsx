import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Topbar } from '@/components/layout/Topbar/Topbar';
import { ToastContainer } from '@/components/ui/Toast/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary/ErrorBoundary';
import { PersistenceIndicator } from '@/components/ui/PersistenceIndicator/PersistenceIndicator';
import { KeyboardShortcutsProvider } from '@/components/providers/KeyboardShortcutsProvider';
import { MobileMenuProvider } from '@/components/providers/MobileMenuProvider';
import { Providers } from './providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Atlas - Internal Knowledge Management',
  description: 'Production-grade knowledge management system',
};

// Loading component that matches your loading.tsx styles
function PageLoader() {
  return (
    <div
      style={{
        padding: '40px 60px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background:
                  'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-loading 1.5s ease-in-out infinite',
                flexShrink: 0,
              }}
            ></div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: '32px',
                  width: '60%',
                  marginBottom: '8px',
                  background:
                    'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-loading 1.5s ease-in-out infinite',
                  borderRadius: '4px',
                }}
              ></div>
              <div
                style={{
                  height: '14px',
                  width: '80%',
                  marginBottom: '8px',
                  background:
                    'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-loading 1.5s ease-in-out infinite',
                  borderRadius: '4px',
                }}
              ></div>
              <div
                style={{
                  height: '12px',
                  width: '50%',
                  background:
                    'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-loading 1.5s ease-in-out infinite',
                  borderRadius: '4px',
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
            <KeyboardShortcutsProvider>
              <MobileMenuProvider>
                {/* Layout wrapper with mobile support */}
                <div
                  style={{
                    display: 'flex',
                    height: '100vh',
                    overflow: 'hidden',
                  }}
                >
                  {/* Sidebar - Managed by MobileMenuProvider */}
                  <Sidebar />

                  {/* Main Content Area */}
                  <main
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      minWidth: 0, // Important for flexbox text overflow
                    }}
                  >
                    {/* Top Bar - Managed by MobileMenuProvider */}
                    <Topbar />

                    {/* Page Content - Scrollable with Suspense */}
                    <div
                      id="main-content"
                      style={{ flex: 1, overflow: 'auto' }}
                      role="main"
                    >
                      <ErrorBoundary>
                        {/* SUSPENSE BOUNDARY - Shows skeleton while navigating/loading */}
                        <Suspense fallback={<PageLoader />}>
                          {children}
                        </Suspense>
                      </ErrorBoundary>
                    </div>
                  </main>
                </div>

                {/* Toast Notifications */}
                <ToastContainer />

                {/* Persistence Indicator */}
                <PersistenceIndicator />
              </MobileMenuProvider>
            </KeyboardShortcutsProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
