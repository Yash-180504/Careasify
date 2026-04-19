'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsRes, vehiclesRes] = await Promise.all([
          fetch('/api/bookings'),
          fetch('/api/vehicles'),
        ]);
        const bookingsData = await bookingsRes.json();
        const vehiclesData = await vehiclesRes.json();
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {session?.user?.name || 'User'} 👋</h1>
        <p className="page-subtitle">Here&apos;s an overview of your car care activity.</p>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Total Bookings</span>
                <div className="stat-card-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>📅</div>
              </div>
              <div className="stat-card-value">{bookings.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Upcoming</span>
                <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>⏳</div>
              </div>
              <div className="stat-card-value">{pendingBookings.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">Completed</span>
                <div className="stat-card-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>✅</div>
              </div>
              <div className="stat-card-value">{completedBookings.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">My Vehicles</span>
                <div className="stat-card-icon" style={{ background: 'rgba(139,92,246,0.15)' }}>🚗</div>
              </div>
              <div className="stat-card-value">{vehicles.length}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.1rem' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <Link href="/dashboard/book" className="btn btn-primary">📅 Book a Wash</Link>
                <Link href="/dashboard/vehicles" className="btn btn-secondary">🚗 Add Vehicle</Link>
                <Link href="/dashboard/subscription" className="btn btn-secondary">💳 View Plans</Link>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.1rem' }}>Recent Bookings</h3>
              {bookings.length === 0 ? (
                <div className="empty-state" style={{ padding: 'var(--space-lg)' }}>
                  <div className="empty-state-icon">📋</div>
                  <p className="empty-state-desc">No bookings yet</p>
                  <Link href="/dashboard/book" className="btn btn-primary btn-sm">Book Your First Wash</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {bookings.slice(0, 4).map((b) => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.serviceName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.scheduledDate} • {b.scheduledTime}</div>
                      </div>
                      <span className={`badge badge-${b.status === 'in_progress' ? 'in-progress' : b.status}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <style>{`
            @media (max-width: 768px) {
              div[style*="grid-template-columns: 1fr 1fr"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
