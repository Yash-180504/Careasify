'use client';

import { useEffect, useState } from 'react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string | null;
  serviceInterest: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

const statusBadgeMap: Record<string, string> = {
  new: 'badge-pending',
  contacted: 'badge-confirmed',
  resolved: 'badge-completed',
};

const serviceLabels: Record<string, string> = {
  exterior_wash: 'Exterior Wash',
  interior_clean: 'Interior Clean',
  complete_spa: 'Complete Car Spa',
  premium_detailing: 'Premium Detailing',
  subscription: 'Subscription',
  other: 'Other / Custom',
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType?.includes('application/json')) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: status as Inquiry['status'] } : inq))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filtered = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter);

  if (loading) return <div className="loading-spinner" />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customer Inquiries</h1>
        <p className="page-subtitle">Manage contact form submissions and pricing requests.</p>
      </div>

      {/* Stats summary */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Total Inquiries', value: inquiries.length, icon: '📩', color: 'rgba(124,58,237,0.15)' },
          { label: 'New', value: inquiries.filter((i) => i.status === 'new').length, icon: '🔔', color: 'rgba(245,158,11,0.15)' },
          { label: 'Contacted', value: inquiries.filter((i) => i.status === 'contacted').length, icon: '📞', color: 'rgba(59,130,246,0.15)' },
          { label: 'Resolved', value: inquiries.filter((i) => i.status === 'resolved').length, icon: '✅', color: 'rgba(16,185,129,0.15)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">{s.label}</span>
              <div className="stat-card-icon" style={{ background: s.color }}>{s.icon}</div>
            </div>
            <div className="stat-card-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {['all', 'new', 'contacted', 'resolved'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? inquiries.length : inquiries.filter((i) => i.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">No inquiries found</h3>
          <p className="empty-state-desc">
            {filter === 'all' ? 'No customer inquiries yet.' : `No ${filter} inquiries.`}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }} id="inquiry-table-desktop">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Vehicle</th>
                  <th>Service</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => (
                  <tr key={inq.id}>
                    <td style={{ fontWeight: 600 }}>{inq.name}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{inq.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inq.phone}</div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{inq.vehicleType || '—'}</td>
                    <td>{inq.serviceInterest ? (serviceLabels[inq.serviceInterest] || inq.serviceInterest) : '—'}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inq.message || '—'}
                    </td>
                    <td>
                      <span className={`badge ${statusBadgeMap[inq.status]}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={inq.status}
                        onChange={(e) => updateStatus(inq.id, e.target.value)}
                        style={{ padding: '6px 28px 6px 10px', fontSize: '0.8rem', minWidth: 110 }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div id="inquiry-cards-mobile">
            {filtered.map((inq) => (
              <div key={inq.id} className="card" style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{inq.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <span className={`badge ${statusBadgeMap[inq.status]}`}>{inq.status}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
                  <div><strong>Email:</strong> {inq.email}</div>
                  <div><strong>Phone:</strong> {inq.phone}</div>
                  {inq.vehicleType && <div><strong>Vehicle:</strong> <span style={{ textTransform: 'capitalize' }}>{inq.vehicleType}</span></div>}
                  {inq.serviceInterest && <div><strong>Service:</strong> {serviceLabels[inq.serviceInterest] || inq.serviceInterest}</div>}
                  {inq.message && <div><strong>Message:</strong> {inq.message}</div>}
                </div>
                <select
                  className="form-select w-full"
                  value={inq.status}
                  onChange={(e) => updateStatus(inq.id, e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        #inquiry-cards-mobile { display: none; }
        @media (max-width: 1024px) {
          #inquiry-table-desktop { display: none !important; }
          #inquiry-cards-mobile { display: block; }
        }
      `}</style>
    </div>
  );
}
