'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedDocumentId } from '@/lib/redux/slices/uiSlice';
import { useGetDocumentsQuery } from '@/lib/redux/api/documentsApi';
import { useGetCollectionsQuery } from '@/lib/redux/api/collectionsApi';
import { useGetActivityQuery } from '@/lib/redux/api/activityApi';
import { Card } from '@/components/ui';
import { StatCard } from '@/components/dashboard/StatCard';
import { formatRelativeTime } from '@/lib/utils/helpers';
import styles from './page.module.css';

/**
 * Dashboard Page
 *
 * Overview page showing:
 * - Key metrics (stat cards) - from real API data
 * - Recent activity feed - from activity API
 * - Popular documents - sorted by views from documents API
 */

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Fetch real data from APIs (now includes merged localStorage docs)
  const { data: documentsData, isLoading: isLoadingDocs } =
    useGetDocumentsQuery({
      status: 'all',
      sort: 'recent',
      q: '',
      page: 1,
      limit: 100, // Get more docs to calculate stats
    });

  const { data: collections, isLoading: isLoadingCollections } =
    useGetCollectionsQuery();

  const { data: activities, isLoading: isLoadingActivity } =
    useGetActivityQuery({
      type: 'all',
    });

  // Handle document click - navigate to documents page with selected doc
  const handleDocumentClick = useCallback(
    (docId: number) => {
      dispatch(setSelectedDocumentId(docId));
      router.push('/documents');
    },
    [dispatch, router]
  );

  // Calculate stats from real data (includes localStorage documents)
  const stats = useMemo(() => {
    const documents = documentsData?.documents || [];
    const totalDocs = documentsData?.pagination.total || 0;
    const collectionsCount = collections?.length || 0;

    // Calculate unique contributors
    const uniqueAuthors = new Set(documents.map((d) => d.author));
    const teamMembersCount = uniqueAuthors.size;

    // Calculate published docs percentage
    const publishedDocs = documents.filter(
      (d) => d.status === 'Published'
    ).length;
    const coveragePercent =
      totalDocs > 0 ? Math.round((publishedDocs / totalDocs) * 100) : 0;

    // Calculate growth (mock for now - would need historical data)
    // Use a fixed timestamp for SSR compatibility
    const now =
      typeof window !== 'undefined'
        ? Date.now()
        : new Date('2026-01-01').getTime();
    const recentDocs = documents.filter((d) => {
      const daysSinceUpdate =
        (now - new Date(d.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate <= 30;
    }).length;
    const growthPercent =
      totalDocs > 0 ? Math.round((recentDocs / totalDocs) * 100) : 0;

    return [
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
        value: totalDocs.toLocaleString(),
        label: 'Total Documents',
        change: `+${growthPercent}% from last month`,
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
        value: collectionsCount.toString(),
        label: 'Active Collections',
        change:
          collectionsCount > 0
            ? `${collectionsCount} total`
            : 'No collections yet',
        changeType: 'neutral' as const,
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
        value: teamMembersCount.toString(),
        label: 'Team Members',
        change: `${teamMembersCount} ${
          teamMembersCount === 1 ? 'contributor' : 'contributors'
        }`,
        changeType: 'neutral' as const,
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
        value: `${coveragePercent}%`,
        label: 'Published Coverage',
        change: `${publishedDocs} of ${totalDocs} published`,
        changeType:
          coveragePercent >= 80 ? ('positive' as const) : ('neutral' as const),
      },
    ];
  }, [documentsData, collections]);

  // Get recent activity (limit to 4 items)
  const recentActivity = useMemo(() => {
    return (activities || []).slice(0, 4);
  }, [activities]);

  // Get popular documents (sorted by views, limit to 3)
  const popularDocs = useMemo(() => {
    const documents = documentsData?.documents || [];
    return [...documents].sort((a, b) => b.views - a.views).slice(0, 3);
  }, [documentsData]);

  const isLoading = isLoadingDocs || isLoadingCollections || isLoadingActivity;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonIcon}></div>
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonValue}></div>
                <div className={styles.skeletonLabel}></div>
                <div className={styles.skeletonChange}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          {recentActivity.length > 0 ? (
            <div className={styles.activityList}>
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className={styles.activityItem}
                  onClick={() => handleDocumentClick(item.documentId)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDocumentClick(item.documentId);
                    }
                  }}
                >
                  <div
                    className={styles.activityAvatar}
                    style={{
                      background: getAvatarColor(item.authorInitials),
                    }}
                  >
                    {item.authorInitials}
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityTitle}>
                      <strong>{item.author}</strong> {item.action}{' '}
                      <em>{item.documentTitle}</em>
                    </div>
                    <div className={styles.activityTime}>
                      {formatRelativeTime(item.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No recent activity</p>
            </div>
          )}
        </Card>
      </section>

      {/* Popular Documents */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Popular Documents</h2>
        <Card>
          {popularDocs.length > 0 ? (
            <div className={styles.popularDocs}>
              {popularDocs.map((doc) => (
                <div
                  key={doc.id}
                  className={styles.popularDocItem}
                  onClick={() => handleDocumentClick(doc.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDocumentClick(doc.id);
                    }
                  }}
                >
                  <div className={styles.popularDocTitle}>{doc.title}</div>
                  <div className={styles.popularDocStats}>
                    👁 {doc.views} views <span>•</span> {doc.author}{' '}
                    <span>•</span>{' '}
                    {formatRelativeTime(doc.createdAt || doc.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No documents yet</p>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

// Helper function to get avatar color (can be moved to utils if needed)
function getAvatarColor(initials: string): string {
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
