import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{
          height: '32px',
          width: '200px',
          background: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '8px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
        <div style={{
          height: '20px',
          width: '350px',
          background: '#f3f4f6',
          borderRadius: '6px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
      </div>

      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#f3f4f6',
              borderRadius: '8px',
              marginBottom: '16px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
            <div style={{
              height: '20px',
              width: '70%',
              background: '#f3f4f6',
              borderRadius: '6px',
              marginBottom: '12px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
            <div style={{
              height: '16px',
              width: '90%',
              background: '#f3f4f6',
              borderRadius: '6px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
