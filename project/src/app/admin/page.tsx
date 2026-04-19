'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner" />;

  const statCards = [
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: '📅', color: 'rgba(59,130,246,0.15)' },
    { label: 'Pending', value: stats?.pendingBookings || 0, icon: '⏳', color: 'rgba(245,158,11,0.15)' },
    { label: 'Completed', value: stats?.completedBookings || 0, icon: '✅', color: 'rgba(16,185,129,0.15)' },
    { label: 'Customers', value: stats?.totalCustomers || 0, icon: '👤', color: 'rgba(139,92,246,0.15)' },
    { label: 'Available Staff', value: `${stats?.availableStaff || 0}/${stats?.totalStaff || 0}`, icon: '👥', color: 'rgba(6,182,212,0.15)' },
    { label: 'Revenue', value: `₹${Number(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: 'rgba(16,185,129,0.15)' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of your business operations.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">{s.label}</span>
              <div className="stat-card-icon" style={{ background: s.color }}>{s.icon}</div>
            </div>
            <div className="stat-card-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <Link href="/admin/bookings" className="btn btn-primary">📋 Manage Bookings</Link>
            <Link href="/admin/staff" className="btn btn-secondary">👥 Manage Staff</Link>
            <Link href="/admin/services" className="btn btn-secondary">🧽 Manage Services</Link>
            <Link href="/admin/customers" className="btn btn-secondary">👤 View Customers</Link>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.1rem' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <span>Database</span>
              <span className="badge badge-active">Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <span>Active Subscriptions</span>
              <span style={{ fontWeight: 600 }}>{stats?.activeSubscriptions || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <span>Staff on Duty</span>
              <span style={{ fontWeight: 600 }}>{(stats?.totalStaff || 0) - (stats?.availableStaff || 0)} busy / {stats?.totalStaff || 0} total</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
