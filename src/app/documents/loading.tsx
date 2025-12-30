import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.documentList}>
        <div className={styles.filterBar}>
          <div style={{ 
            width: '100px', 
            height: '32px', 
            background: '#f3f4f6', 
            borderRadius: '6px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}></div>
        </div>
        <div style={{ padding: '20px' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{
              height: '80px',
              marginBottom: '12px',
              background: '#f3f4f6',
              borderRadius: '8px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
