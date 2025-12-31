import React from 'react';
import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function HelpPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Help Center</h1>
        <p className={styles.subtitle}>
          Get help and learn how to make the most of Atlas
        </p>
      </div>

      <div className={styles.grid}>
        <Card hover>
          <div className={styles.icon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <h3 className={styles.cardTitle}>Documentation</h3>
          <p className={styles.cardDescription}>
            Comprehensive guides and tutorials for using Atlas
          </p>
          <div className={styles.comingSoon}>Coming Soon</div>
        </Card>

        <Card hover>
          <div className={styles.icon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h3 className={styles.cardTitle}>FAQs</h3>
          <p className={styles.cardDescription}>
            Find answers to commonly asked questions
          </p>
          <div className={styles.comingSoon}>Coming Soon</div>
        </Card>

        <Card hover>
          <div className={styles.icon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 className={styles.cardTitle}>Contact Support</h3>
          <p className={styles.cardDescription}>
            Get help from our support team
          </p>
          <div className={styles.comingSoon}>Coming Soon</div>
        </Card>

        <Card hover>
          <div className={styles.icon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <h3 className={styles.cardTitle}>Keyboard Shortcuts</h3>
          <p className={styles.cardDescription}>
            Learn keyboard shortcuts to work faster
          </p>
          <div className={styles.comingSoon}>Coming Soon</div>
        </Card>

        <Card hover>
          <div className={styles.icon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
          </div>
          <h3 className={styles.cardTitle}>Video Tutorials</h3>
          <p className={styles.cardDescription}>
            Watch step-by-step video guides
          </p>
          <div className={styles.comingSoon}>Coming Soon</div>
        </Card>

        <Card hover>
          <div className={styles.icon}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <h3 className={styles.cardTitle}>What's New</h3>
          <p className={styles.cardDescription}>
            See the latest features and updates
          </p>
          <div className={styles.comingSoon}>Coming Soon</div>
        </Card>
      </div>

      <Card className={styles.cardSection}>
        <h3 className={styles.sectionTitle}>Quick Tips</h3>
        <div className={styles.articles}>
          <div className={styles.article}>
            <h4>🚀 Getting Started</h4>
            <p>
              Navigate to Documents to create your first document. Use
              Collections to organize related documents together.
            </p>
          </div>
          <div className={styles.article}>
            <h4>⌨️ Keyboard Shortcuts</h4>
            <p>
              Press <kbd>⌘K</kbd> to quickly focus search, <kbd>⌘N</kbd> to
              create a new document, and <kbd>Esc</kbd> to close modals.
            </p>
          </div>
          <div className={styles.article}>
            <h4>🔍 Search & Filter</h4>
            <p>
              Use the search page to find documents by content, filter by
              status, author, or date range for precise results.
            </p>
          </div>
          <div className={styles.article}>
            <h4>📊 Stay Organized</h4>
            <p>
              Check the Activity feed to track changes, and use the Dashboard to
              monitor your workspace metrics at a glance.
            </p>
          </div>
        </div>
      </Card>

      {/* Feature Preview Banner */}
      <Card>
        <div className={styles.featureBanner}>
          <div className={styles.bannerIcon}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className={styles.bannerContent}>
            <h3>More Help Resources Coming Soon</h3>
            <p>
              We're working on comprehensive documentation, video tutorials, and
              an interactive help center. In the meantime, explore the app and
              use the quick tips above to get started.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
