/**
 * Mock Database - In-Memory Data Store
 *
 * Simple in-memory store for development.
 * No external database required.
 * Data resets on server restart.
 */

import type { Document, Collection, ActivityItem } from '@/types';

// In-memory stores
let documents: Document[] = [];
let collections: Collection[] = [];
let activities: ActivityItem[] = [];
let nextDocId = 7;
let nextCollectionId = 7;
let nextActivityId = 20;

// Initialize with seed data
export function initializeDb() {
  const now = new Date();

  documents = [
    {
      id: 1,
      title: 'API Integration Guidelines',
      snippet: 'Comprehensive guide for integrating with our REST API endp...',
      body: `<p>This document provides comprehensive guidelines for integrating with our REST API endpoints. Whether you're building internal tools or partner integrations, following these best practices will ensure secure, reliable, and performant connections.</p>
<p>Our API follows industry-standard REST principles and uses JSON for request and response payloads. All endpoints require authentication via API keys or OAuth 2.0 tokens, depending on your use case and security requirements.</p>
<p>Authentication flows are designed to balance security with developer experience. For server-to-server integrations, we recommend using API keys with appropriate scoping. For user-facing applications, OAuth 2.0 provides the flexibility needed for delegated access while maintaining user privacy and control.</p>
<p>Rate limiting is enforced at the account level with different tiers available based on your subscription plan. Standard accounts receive 1,000 requests per hour, while enterprise customers can request higher limits through our support team. All rate limit information is included in response headers.</p>
<p>Error handling follows HTTP status code conventions. The API returns detailed error messages in JSON format to help with debugging. Common errors include authentication failures (401), insufficient permissions (403), and rate limit exceeded (429).</p>`,
      author: 'Sarah Chen',
      authorInitials: 'SC',
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'Published',
      views: 287,
    },
    {
      id: 2,
      title: 'Q4 Product Roadmap Research',
      snippet:
        'Market analysis and competitive research findings for upcomi...',
      body: `<p>Our Q4 product roadmap is informed by extensive market analysis and competitive research conducted throughout Q3. This document synthesizes key findings and strategic recommendations for the upcoming quarter.</p>
<p>The competitive landscape has shifted significantly with three major players launching AI-powered features. Our analysis indicates that customers are willing to pay premium prices for intelligent automation, but expect seamless integration with existing workflows.</p>
<p>User interviews revealed consistent pain points around data synchronization and mobile accessibility. Teams spending more than 4 hours weekly on manual data entry are showing highest churn risk. Our proposed solutions focus on automated sync and progressive web app capabilities.</p>
<p>Market opportunity analysis suggests a 40% TAM expansion if we successfully execute on enterprise collaboration features. Early adopter programs with 5 strategic accounts are scheduled to begin in late October.</p>
<p>Resource allocation recommendations include doubling the mobile team and establishing a dedicated AI/ML research group. Budget requirements and hiring plans are detailed in the appendix.</p>`,
      author: 'Marcus Rivera',
      authorInitials: 'MR',
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'Draft',
      views: 142,
    },
    {
      id: 3,
      title: 'User Research Synthesis - Mobile App',
      snippet:
        'Summary of user interviews and usability testing sessions con...',
      body: `<p>This synthesis covers findings from 24 user interviews and 12 moderated usability testing sessions conducted between November 15-30. Participants included both power users and occasional users across different team sizes and industries.</p>
<p>The primary insight is that users value speed over feature completeness in mobile contexts. 89% of participants reported using the mobile app exclusively for quick lookups and status updates, not for creating new content or complex workflows.</p>
<p>Usability testing revealed significant friction in the document search experience. Users expected search results to appear instantly and were frustrated by the current 2-3 second delay. Most participants abandoned searches that took longer than 3 seconds.</p>
<p>Navigation patterns showed heavy reliance on recent items and favorites. Very few users explored the full navigation menu. This suggests opportunities to streamline the information architecture and surface relevant content more proactively.</p>
<p>Recommendations include implementing instant search with client-side filtering, redesigning the home screen to prioritize recents and favorites, and simplifying the navigation structure to focus on core use cases.</p>`,
      author: 'Alex Morgan',
      authorInitials: 'AM',
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'In Review',
      views: 98,
    },
    {
      id: 4,
      title: 'Security Best Practices 2025',
      snippet: 'Updated security protocols and compliance requirements for...',
      body: `<p>This document outlines updated security protocols and compliance requirements for all engineering teams effective January 2025. These guidelines reflect new regulatory requirements and lessons learned from recent security audits.</p>
<p>All production systems must implement multi-factor authentication for administrative access. Single sign-on (SSO) integration is required for third-party tools handling customer data. Legacy systems have until March 2025 to complete migration.</p>
<p>Data encryption standards have been updated to require AES-256 for data at rest and TLS 1.3 for data in transit. Database backups must be encrypted separately with keys stored in approved key management systems.</p>
<p>Code review requirements now mandate security-focused review for any changes touching authentication, authorization, or data access layers. Automated security scanning must pass before pull requests can be merged.</p>
<p>Incident response procedures include new notification requirements and escalation paths. All security incidents must be logged in the central tracking system within 1 hour of discovery, regardless of severity.</p>`,
      author: 'David Park',
      authorInitials: 'DP',
      updatedAt: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'Published',
      views: 213,
    },
    {
      id: 5,
      title: 'Design System Documentation',
      snippet: 'Complete reference for UI components, tokens, and design p...',
      body: `<p>The Atlas Design System provides a comprehensive library of reusable components, design tokens, and interaction patterns. This documentation serves as the single source of truth for all product interfaces.</p>
<p>Design tokens define our visual language including colors, typography, spacing, and elevation. All tokens are available in multiple formats (CSS variables, JavaScript, iOS, Android) and automatically sync across platforms.</p>
<p>Component library includes 47 production-ready components covering common UI patterns. Each component includes usage guidelines, accessibility requirements, and code examples. Components are versioned independently to support gradual adoption.</p>
<p>Accessibility is built into every component following WCAG 2.1 Level AA standards. All interactive elements support keyboard navigation, screen readers, and high contrast modes. Automated accessibility testing runs on every commit.</p>
<p>Contribution guidelines outline the process for proposing new components or modifications. Design system team reviews all proposals monthly and maintains a public roadmap of planned additions.</p>`,
      author: 'Emma Wilson',
      authorInitials: 'EW',
      updatedAt: new Date(
        now.getTime() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'Published',
      views: 342,
    },
    {
      id: 6,
      title: 'Customer Feedback Analysis - Dec 2024',
      snippet:
        'Monthly aggregation of customer support tickets, feature req...',
      body: `<p>December feedback analysis covers 1,247 support tickets, 89 feature requests, and 34 bug reports. This month showed a 15% increase in support volume compared to November, primarily driven by questions about new collaborative editing features.</p>
<p>Top requested features include offline mode (mentioned in 23 tickets), better mobile performance (18 tickets), and more flexible permission controls (15 tickets). Offline mode has been added to the Q1 roadmap based on this feedback.</p>
<p>Bug reports clustered around three main areas: sync conflicts in collaborative editing, occasional search index staleness, and notification reliability issues. Engineering has prioritized sync conflict resolution for the January release.</p>
<p>Customer satisfaction scores averaged 4.2/5, down slightly from November's 4.4/5. The decrease correlates with the collaborative editing rollout and associated performance issues. Satisfaction is expected to recover as performance improvements ship.</p>
<p>Notable positive feedback highlighted the new command palette and keyboard shortcuts. Multiple customers mentioned these features significantly improved their daily workflows and reduced reliance on mouse navigation.</p>`,
      author: 'Rachel Kim',
      authorInitials: 'RK',
      updatedAt: new Date(
        now.getTime() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'Draft',
      views: 76,
    },
  ];

  collections = [
    {
      id: 1,
      name: 'Engineering',
      description:
        'Technical documentation, API guides, and architecture decisions',
      icon: '📚',
      iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      documentCount: 42,
      contributorCount: 8,
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      name: 'Product',
      description: 'Roadmaps, feature specs, and user research findings',
      icon: '⭐',
      iconBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      documentCount: 28,
      contributorCount: 5,
      createdAt: new Date(now.getTime() - 80 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    },
    {
      id: 3,
      name: 'Design',
      description: 'Design systems, UI patterns, and brand guidelines',
      icon: '🎨',
      iconBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      documentCount: 19,
      contributorCount: 4,
      createdAt: new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 4,
      name: 'People & Culture',
      description: 'Onboarding guides, team processes, and company policies',
      icon: '👥',
      iconBg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      documentCount: 15,
      contributorCount: 3,
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: 5,
      name: 'Sales & Marketing',
      description: 'Sales playbooks, marketing campaigns, and customer stories',
      icon: '💼',
      iconBg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      documentCount: 33,
      contributorCount: 6,
      createdAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 6,
      name: 'Legal & Compliance',
      description: 'Contracts, policies, and regulatory documentation',
      icon: '⚖️',
      iconBg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      documentCount: 12,
      contributorCount: 2,
      createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  // Add more documents
  documents = documents.concat([
    {
      id: 7,
      title: 'Engineering Onboarding Guide',
      snippet:
        'Complete onboarding checklist for new engineering team members...',
      body: `<p>Welcome to the engineering team! This guide will help you get set up and productive in your first week.</p>
<p>Week 1 priorities include setting up your development environment, getting access to all necessary tools, and meeting your team members.</p>`,
      author: 'Sarah Chen',
      authorInitials: 'SC',
      updatedAt: new Date(
        now.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'Published',
      views: 156,
    },
    {
      id: 8,
      title: 'Sprint Planning Process',
      snippet:
        'How we plan and execute two-week sprints across product teams...',
      body: `<p>Our sprint planning process follows agile best practices with some customizations for our team structure.</p>
<p>Each sprint is two weeks long, starting on Monday and ending on Friday of the second week.</p>`,
      author: 'Marcus Rivera',
      authorInitials: 'MR',
      updatedAt: new Date(
        now.getTime() - 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'Published',
      views: 203,
    },
    {
      id: 9,
      title: 'Code Review Guidelines',
      snippet: 'Standards and best practices for conducting code reviews...',
      body: `<p>Code reviews are essential for maintaining code quality and knowledge sharing across the team.</p>
<p>All pull requests require at least one approval before merging to main.</p>`,
      author: 'David Park',
      authorInitials: 'DP',
      updatedAt: new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'Published',
      views: 178,
    },
    {
      id: 10,
      title: 'Brand Guidelines 2025',
      snippet:
        'Updated brand guidelines including new logo usage and color palette...',
      body: `<p>Our brand has evolved to better reflect our mission and values. These guidelines ensure consistency across all touchpoints.</p>
<p>The primary brand colors are now deeper and more vibrant to stand out in digital contexts.</p>`,
      author: 'Emma Wilson',
      authorInitials: 'EW',
      updatedAt: new Date(
        now.getTime() - 8 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'Draft',
      views: 89,
    },
    {
      id: 11,
      title: 'Remote Work Policy',
      snippet:
        'Flexible remote work options and expectations for hybrid teams...',
      body: `<p>We support flexible work arrangements to help team members achieve work-life balance.</p>
<p>Team members can work remotely up to 3 days per week, with Tuesdays and Thursdays as recommended in-office days.</p>`,
      author: 'Rachel Kim',
      authorInitials: 'RK',
      updatedAt: new Date(
        now.getTime() - 9 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'In Review',
      views: 267,
    },
    {
      id: 12,
      title: 'Incident Response Playbook',
      snippet: 'Step-by-step procedures for handling production incidents...',
      body: `<p>This playbook provides clear procedures for responding to production incidents of varying severity.</p>
<p>The incident commander is responsible for coordinating response efforts and communication.</p>`,
      author: 'David Park',
      authorInitials: 'DP',
      updatedAt: new Date(
        now.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: 'Published',
      views: 312,
    },
  ]);

  // Generate activity feed from documents
  activities = documents
    .flatMap((doc, idx) => [
      {
        id: idx * 2 + 1,
        action:
          doc.status === 'Published'
            ? ('published' as const)
            : ('created' as const),
        author: doc.author,
        authorInitials: doc.authorInitials,
        documentTitle: doc.title,
        documentId: doc.id,
        timestamp: new Date(doc.updatedAt),
      },
      {
        id: idx * 2 + 2,
        action: 'updated' as const,
        author: doc.author,
        authorInitials: doc.authorInitials,
        documentTitle: doc.title,
        documentId: doc.id,
        timestamp: new Date(
          new Date(doc.updatedAt).getTime() - 3 * 60 * 60 * 1000
        ),
      },
    ])
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Initialize on module load
initializeDb();

// Document operations
export const db = {
  documents: {
    getAll: () => [...documents],
    getById: (id: number) => documents.find((d) => d.id === id),
    getPaginated: (page: number = 1, limit: number = 10) => {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDocs = documents.slice(startIndex, endIndex);

      return {
        documents: paginatedDocs,
        pagination: {
          page,
          limit,
          total: documents.length,
          totalPages: Math.ceil(documents.length / limit),
          hasNext: endIndex < documents.length,
          hasPrev: page > 1,
        },
      };
    },
    create: (data: Omit<Document, 'id' | 'updatedAt' | 'views'>) => {
      const doc: Document = {
        ...data,
        id: nextDocId++,
        updatedAt: new Date().toISOString(),
        views: 0,
      };
      documents.unshift(doc);

      // Add activity
      activities.unshift({
        id: nextActivityId++,
        action: 'created',
        author: data.author,
        authorInitials: data.authorInitials,
        documentTitle: data.title,
        documentId: doc.id,
        timestamp: new Date(),
      });

      return doc;
    },
    update: (id: number, data: Partial<Document>) => {
      const idx = documents.findIndex((d) => d.id === id);
      if (idx === -1) return null;

      documents[idx] = {
        ...documents[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // Add activity
      activities.unshift({
        id: nextActivityId++,
        action: data.status === 'Published' ? 'published' : 'updated',
        author: documents[idx].author,
        authorInitials: documents[idx].authorInitials,
        documentTitle: documents[idx].title,
        documentId: documents[idx].id,
        timestamp: new Date(),
      });

      return documents[idx];
    },
    delete: (id: number) => {
      const idx = documents.findIndex((d) => d.id === id);
      if (idx === -1) return false;
      documents.splice(idx, 1);
      return true;
    },
  },

  collections: {
    getAll: () => [...collections],
    getById: (id: number) => collections.find((c) => c.id === id),
    create: (data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) => {
      const collection: Collection = {
        ...data,
        id: nextCollectionId++,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      collections.push(collection);
      return collection;
    },
    update: (id: number, data: Partial<Collection>) => {
      const idx = collections.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      collections[idx] = {
        ...collections[idx],
        ...data,
        updatedAt: new Date(),
      };
      return collections[idx];
    },
  },

  activities: {
    getAll: () => [...activities],
    getFiltered: (action?: string) => {
      if (!action || action === 'all') return [...activities];
      return activities.filter((a) => a.action === action.toLowerCase());
    },
  },
};
