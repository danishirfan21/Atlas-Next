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
          width: '300px',
          background: '#f3f4f6',
          borderRadius: '6px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        marginBottom: '16px'
      }}>
        <div style={{
          height: '24px',
          width: '180px',
          background: '#f3f4f6',
          borderRadius: '6px',
          marginBottom: '20px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}></div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            marginBottom: '24px'
          }}>
            <div style={{
              height: '18px',
              width: '150px',
              background: '#f3f4f6',
              borderRadius: '6px',
              marginBottom: '8px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
            <div style={{
              height: '40px',
              background: '#f3f4f6',
              borderRadius: '8px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
