'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { StatCard } from '@/components/dashboard/StatCard';
import styles from './page.module.css';

/**
 * Dashboard Page
 *
 * Overview page showing:
 * - Key metrics (stat cards)
 * - Recent activity feed
 * - Popular documents
 */

export default function DashboardPage() {
  // Mock data for stats (will be replaced with real data in future)
  const stats = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      ),
      iconBg: '#ede9fe',
      iconColor: '#7c3aed',
      value: '1,247',
      label: 'Total Documents',
      change: '+12% from last month',
      changeType: 'positive' as const,
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      ),
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      value: '42',
      label: 'Active Collections',
      change: '+3 this week',
      changeType: 'positive' as const,
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      iconBg: '#fef3c7',
      iconColor: '#d97706',
      value: '28',
      label: 'Team Members',
      change: '+2 new members',
      changeType: 'positive' as const,
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      value: '94%',
      label: 'Documentation Coverage',
      change: '+5% this quarter',
      changeType: 'positive' as const,
    },
  ];

  // Mock recent activity
  const recentActivity = [
    {
      author: 'Sarah Chen',
      initials: 'SC',
      action: 'updated',
      doc: 'API Integration Guidelines',
      time: '2 hours ago',
      color: '#3b82f6',
    },
    {
      author: 'Marcus Rivera',
      initials: 'MR',
      action: 'created',
      doc: 'Q4 Product Roadmap',
      time: '5 hours ago',
      color: '#10b981',
    },
    {
      author: 'Alex Morgan',
      initials: 'AM',
      action: 'published',
      doc: 'User Research Synthesis',
      time: '1 day ago',
      color: '#f59e0b',
    },
    {
      author: 'David Park',
      initials: 'DP',
      action: 'commented on',
      doc: 'Security Best Practices',
      time: '2 days ago',
      color: '#ec4899',
    },
  ];

  // Mock popular documents
  const popularDocs = [
    { title: 'API Integration Guidelines', views: 287, comments: 12 },
    { title: 'Design System Documentation', views: 213, comments: 8 },
    { title: 'User Research Synthesis', views: 142, comments: 15 },
  ];

  return (
    <div className={styles.container}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <Card>
          <div className={styles.activityList}>
            {recentActivity.map((item, idx) => (
              <div key={idx} className={styles.activityItem}>
                <div
                  className={styles.activityAvatar}
                  style={{ background: item.color }}
                >
                  {item.initials}
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>
                    <strong>{item.author}</strong> {item.action}{' '}
                    <em>{item.doc}</em>
                  </div>
                  <div className={styles.activityTime}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Popular Documents */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Popular Documents</h2>
        <Card>
          <div className={styles.popularDocs}>
            {popularDocs.map((doc, idx) => (
              <div key={idx} className={styles.popularDocItem}>
                <div className={styles.popularDocTitle}>{doc.title}</div>
                <div className={styles.popularDocStats}>
                  👁 {doc.views} views <span>•</span> 💬 {doc.comments} comments
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
