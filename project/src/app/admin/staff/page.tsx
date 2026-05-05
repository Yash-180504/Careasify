'use client';

import { useEffect, useState } from 'react';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', specialization: '', currentArea: '', status: 'available' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = () => {
    fetch('/api/staff')
      .then(async (r) => {
        const ct = r.headers.get('content-type');
        if (r.ok && ct?.includes('application/json')) return r.json();
        return [];
      })
      .then((data) => setStaffList(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const member = await res.json();
        setStaffList([...staffList, member]);
        setForm({ name: '', phone: '', email: '', specialization: '', currentArea: '', status: 'available' });
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const res = await fetch(`/api/staff/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setStaffList(staffList.map((s) => s.id === id ? { ...s, status } : s));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this staff member?')) return;
    const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setStaffList(staffList.filter((s) => s.id !== id));
    }
  };

  const statusColors: Record<string, string> = { available: 'badge-available', busy: 'badge-busy', off_duty: 'badge-off-duty' };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">Add, manage, and track staff availability.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Staff'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.1rem' }}>Add New Staff Member</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input className="form-input" placeholder="e.g. Exterior Wash" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Area</label>
                <input className="form-input" placeholder="e.g. Koramangala" value={form.currentArea} onChange={(e) => setForm({ ...form, currentArea: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="off_duty">Off Duty</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Staff Member'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Area</th>
                  <th>Rating</th>
                  <th>Jobs</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>{s.phone}</td>
                    <td>{s.specialization || '—'}</td>
                    <td>{s.currentArea || '—'}</td>
                    <td>⭐ {s.rating || '5.00'}</td>
                    <td>{s.totalJobs || 0}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '6px 30px 6px 10px', fontSize: '0.8rem', minWidth: '120px' }}
                        value={s.status}
                        onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="off_duty">Off Duty</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
