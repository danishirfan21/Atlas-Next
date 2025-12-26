import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/Card/Card';
import styles from './page.module.css';

/**
 * Dashboard Page
 * 
 * Overview page with:
 * - Key metrics (documents, views, published, reviews)
 * - Recent activity feed
 * - Popular documents
 * 
 * Future enhancements (Step 2+):
 * - Real data from RTK Query
 * - Interactive charts
 * - Clickable document links
 */

export default function DashboardPage() {
  // Mock data - will be replaced with RTK Query in Step 2
  const stats = {
    totalDocs: 6,
    totalViews: 1158,
    published: 3,
    pendingReview: 1,
  };

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <StatCard
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          }
          iconBg="#eff6ff"
          iconColor="#3b82f6"
          value={stats.totalDocs}
          label="Total Documents"
          change="+2 this week"
          changeType="positive"
        />

        <StatCard
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          }
          iconBg="#f0fdf4"
          iconColor="#10b981"
          value={stats.totalViews}
          label="Total Views"
          change="+8% from last week"
          changeType="positive"
        />

        <StatCard
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          }
          iconBg="#fef3c7"
          iconColor="#f59e0b"
          value={stats.published}
          label="Published"
          change={`${stats.totalDocs - stats.published} in draft`}
          changeType="neutral"
        />

        <StatCard
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          }
          iconBg="#fce7f3"
          iconColor="#ec4899"
          value={stats.pendingReview}
          label="Pending Reviews"
          change={stats.pendingReview > 0 ? 'Needs attention' : 'All clear'}
          changeType={stats.pendingReview > 0 ? 'negative' : 'neutral'}
        />
      </div>

      <Card className={styles.section}>
        <h3 className={styles.sectionTitle}>Recent Activity</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityAvatar} style={{ background: '#3b82f6' }}>
              SC
            </div>
            <div className={styles.activityContent}>
              <div className={styles.activityTitle}>
                <strong>Sarah Chen</strong> published API Integration Guidelines
              </div>
              <div className={styles.activityTime}>2 hours ago</div>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityAvatar} style={{ background: '#10b981' }}>
              MR
            </div>
            <div className={styles.activityContent}>
              <div className={styles.activityTitle}>
                <strong>Marcus Rivera</strong> updated Q4 Product Roadmap Research
              </div>
              <div className={styles.activityTime}>5 hours ago</div>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityAvatar} style={{ background: '#f59e0b' }}>
              AM
            </div>
            <div className={styles.activityContent}>
              <div className={styles.activityTitle}>
                <strong>Alex Morgan</strong> updated User Research Synthesis - Mobile App
              </div>
              <div className={styles.activityTime}>1 day ago</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className={styles.section}>
        <h3 className={styles.sectionTitle}>Most Viewed Documents</h3>
        <div className={styles.popularDocs}>
          <div className={styles.popularDocItem}>
            <div className={styles.popularDocTitle}>Design System Documentation</div>
            <div className={styles.popularDocStats}>
              <span>342 views</span>
              <span>•</span>
              <span>Emma Wilson</span>
            </div>
          </div>

          <div className={styles.popularDocItem}>
            <div className={styles.popularDocTitle}>API Integration Guidelines</div>
            <div className={styles.popularDocStats}>
              <span>287 views</span>
              <span>•</span>
              <span>Sarah Chen</span>
            </div>
          </div>

          <div className={styles.popularDocItem}>
            <div className={styles.popularDocTitle}>Security Best Practices 2025</div>
            <div className={styles.popularDocStats}>
              <span>213 views</span>
              <span>•</span>
              <span>David Park</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
