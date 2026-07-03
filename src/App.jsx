import React, { useState, useEffect } from 'react';

function App() {
  const [metrics, setMetrics] = useState({ cpu: 0, memory: 0, uptime: 0, platform: 'loading...' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Points to relative URL because backend serves frontend from the same origin
        const res = await fetch('/api/metrics');
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        setError("Could not connect to live container metrics API");
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🚀 Live Container Production Dashboard</h1>
        <p>Streaming actual operating system metrics from inside the running Docker container.</p>
      </header>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>CI/CD Pipeline Status</h3>
          <div style={styles.statusBadge}><span style={styles.greenDot}></span> Live & Healthy</div>
          <p style={styles.cardText}>Engine: <strong>GitHub Actions</strong></p>
          <p style={styles.cardText}>Target Host: <strong>Render Cloud Container</strong></p>
        </div>

        <div style={styles.card}>
          <h3>Container Performance</h3>
          <p style={styles.cardText}>🖥️ Real CPU Load: <strong>{metrics.cpu}%</strong></p>
          <p style={styles.cardText}>💾 Real Memory Allocation: <strong>{metrics.memory}%</strong></p>
          <p style={styles.cardText}>📦 OS Kernel Platform: <strong>{metrics.platform}</strong></p>
        </div>

        <div style={styles.card}>
          <h3>Infrastructure Metadata</h3>
          <p style={styles.cardText}>⏱️ Process Uptime: <strong>{formatUptime(metrics.uptime)}</strong></p>
          <p style={styles.cardText}>🌐 Layer Architecture: <strong>Node + Express API</strong></p>
          <p style={styles.cardText}>🐋 Virtualization: <strong>Docker Engine Container</strong></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '2rem' },
  header: { borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#1e293b', borderRadius: '8px', padding: '1.5rem', border: '1px solid #334155' },
  cardText: { fontSize: '1.1rem', margin: '0.75rem 0', color: '#cbd5e1' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', backgroundColor: '#064e3b', color: '#34d399', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', marginBottom: '1rem' },
  greenDot: { width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '8px' },
  errorAlert: { backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }
};

export default App;