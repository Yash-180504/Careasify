'use client';

import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account details.</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-full)',
            background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800,
          }}>
            {session?.user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{session?.user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{session?.user?.email}</p>
            <span className="badge badge-active" style={{ marginTop: 4 }}>Customer</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" value={session?.user?.name || ''} readOnly />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={session?.user?.email || ''} readOnly />
          </div>
        </div>

        <p style={{ marginTop: 'var(--space-lg)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Profile editing will be available in a future update.
        </p>
      </div>
    </div>
  );
}
