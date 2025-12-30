import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Activity Feed</h1>
          <p className={styles.subtitle}>Track all changes across your workspace</p>
        </div>
      </div>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb'
      }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#f3f4f6'
            }}></div>
            <div style={{ flex: 1 }}>
              <div style={{
                height: '16px',
                width: '60%',
                background: '#f3f4f6',
                borderRadius: '4px',
                marginBottom: '8px'
              }}></div>
              <div style={{
                height: '14px',
                width: '40%',
                background: '#f3f4f6',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
