'use client';

import { useEffect, useState } from 'react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', basePrice: '', durationMinutes: 30, category: 'exterior_wash' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const srv = await res.json();
        setServices([...services, srv]);
        setForm({ name: '', description: '', basePrice: '', durationMinutes: 30, category: 'exterior_wash' });
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const categoryLabels: Record<string, string> = {
    exterior_wash: '🧽 Exterior',
    interior_cleaning: '🧹 Interior',
    full_wash: '✨ Full Wash',
    detailing: '💎 Detailing',
    subscription_wash: '📅 Subscription',
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Service Management</h1>
          <p className="page-subtitle">Manage your car wash service catalog.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Service'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.1rem' }}>Add New Service</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Service Name</label>
              <input className="form-input" placeholder="e.g. Premium Detailing" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Describe the service..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input className="form-input" type="number" placeholder="499" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (mins)</label>
                <input className="form-input" type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="exterior_wash">Exterior Wash</option>
                <option value="interior_cleaning">Interior Cleaning</option>
                <option value="full_wash">Full Wash</option>
                <option value="detailing">Detailing</option>
                <option value="subscription_wash">Subscription Wash</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Service'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
          {services.map((s) => (
            <div key={s.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                <h4 style={{ fontSize: '1.05rem' }}>{s.name}</h4>
                <span className="badge badge-confirmed">{categoryLabels[s.category] || s.category}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>{s.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--accent-blue-light)' }}>₹{s.basePrice}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱ {s.durationMinutes} min</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
