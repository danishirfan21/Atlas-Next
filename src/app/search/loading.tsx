import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div style={{
        marginBottom: '32px'
      }}>
        <div style={{
          height: '48px',
          background: '#f3f4f6',
          borderRadius: '12px',
          marginBottom: '24px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
        <div style={{
          height: '40px',
          width: '200px',
          background: '#f3f4f6',
          borderRadius: '8px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
      </div>
      <div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            height: '120px',
            background: '#f3f4f6',
            borderRadius: '12px',
            marginBottom: '16px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}></div>
        ))}
      </div>
    </div>
  );
}
