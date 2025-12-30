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
          <a href="#" className={styles.link}>
            Browse docs →
          </a>
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
          <a href="#" className={styles.link}>
            View FAQs →
          </a>
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
          <a href="#" className={styles.link}>
            Contact us →
          </a>
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
          <a href="#" className={styles.link}>
            View shortcuts →
          </a>
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
          <a href="#" className={styles.link}>
            Watch videos →
          </a>
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
          <a href="#" className={styles.link}>
            View changelog →
          </a>
        </Card>
      </div>

      <Card>
        <h3 className={styles.sectionTitle}>Popular Articles</h3>
        <div className={styles.articles}>
          <a href="#" className={styles.article}>
            <h4>Getting Started with Atlas</h4>
            <p>Learn the basics of creating and organizing documents</p>
          </a>
          <a href="#" className={styles.article}>
            <h4>Collaborating with Your Team</h4>
            <p>Best practices for team collaboration and document sharing</p>
          </a>
          <a href="#" className={styles.article}>
            <h4>Using Collections Effectively</h4>
            <p>
              How to organize documents into collections for better discovery
            </p>
          </a>
          <a href="#" className={styles.article}>
            <h4>Advanced Search Tips</h4>
            <p>Master advanced search features to find documents faster</p>
          </a>
        </div>
      </Card>
    </div>
  );
}
