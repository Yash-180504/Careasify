'use client';

import { useEffect, useState } from 'react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/bookings').then((r) => r.json()),
      fetch('/api/staff').then((r) => r.json()),
    ])
      .then(([bData, sData]) => {
        setBookings(Array.isArray(bData) ? bData : []);
        setStaffList(Array.isArray(sData) ? sData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings(bookings.map((b) => b.id === id ? { ...b, status } : b));
    }
  };

  const handleAssignStaff = async () => {
    if (!assignModal || !selectedStaff) return;
    const res = await fetch(`/api/bookings/${assignModal}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId: selectedStaff, status: 'confirmed' }),
    });
    if (res.ok) {
      setBookings(bookings.map((b) => b.id === assignModal ? { ...b, staffId: selectedStaff, status: 'confirmed' } : b));
      setAssignModal(null);
      setSelectedStaff('');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Booking Management</h1>
        <p className="page-subtitle">View, manage, and assign staff to bookings.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((f) => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-title">No bookings found</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Vehicle</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Staff</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const assignedStaff = staffList.find((s) => s.id === b.staffId);
                  return (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.userPhone}</div>
                      </td>
                      <td>{b.serviceName}</td>
                      <td>
                        <div>{b.vehicleMake} {b.vehicleModel}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.vehicleReg}</div>
                      </td>
                      <td>
                        <div>{b.scheduledDate}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.scheduledTime}</div>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: '6px 30px 6px 10px', fontSize: '0.8rem', minWidth: '130px' }}
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        {assignedStaff ? (
                          <div>
                            <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{assignedStaff.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{assignedStaff.phone}</div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not assigned</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => { setAssignModal(b.id); setSelectedStaff(b.staffId || ''); }}
                        >
                          {b.staffId ? 'Reassign' : 'Assign'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Staff Modal */}
      {assignModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setAssignModal(null); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Assign Staff</h3>
              <button className="btn btn-icon btn-secondary" onClick={() => setAssignModal(null)}>✕</button>
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
              <label className="form-label">Select Staff Member</label>
              <select className="form-select" value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
                <option value="">Choose a staff member</option>
                {staffList
                  .filter((s) => s.status === 'available')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.specialization} ({s.currentArea})
                    </option>
                  ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <button className="btn btn-secondary" onClick={() => setAssignModal(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={!selectedStaff} onClick={handleAssignStaff}>
                Assign Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
