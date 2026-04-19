'use client';

import { useEffect, useState } from 'react';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ make: '', model: '', year: '', registrationNumber: '', vehicleType: 'sedan', color: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = () => {
    fetch('/api/vehicles')
      .then((r) => r.json())
      .then((data) => setVehicles(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, year: form.year ? parseInt(form.year) : null }),
      });
      if (res.ok) {
        const vehicle = await res.json();
        setVehicles([...vehicles, vehicle]);
        setForm({ make: '', model: '', year: '', registrationNumber: '', vehicleType: 'sedan', color: '' });
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this vehicle?')) return;
    const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
  };

  const vehicleEmojis: Record<string, string> = { hatchback: '🚙', sedan: '🚗', suv: '🚐', luxury: '🏎️' };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">My Vehicles</h1>
          <p className="page-subtitle">Manage your registered vehicles.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Vehicle'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: '1.1rem' }}>Add New Vehicle</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Make (Brand)</label>
                <input className="form-input" placeholder="e.g. Hyundai" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Model</label>
                <input className="form-input" placeholder="e.g. Creta" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Registration Number</label>
                <input className="form-input" placeholder="e.g. KA-01-AB-1234" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <select className="form-select" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}>
                  <option value="hatchback">Hatchback</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Year</label>
                <input className="form-input" type="number" placeholder="e.g. 2023" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <input className="form-input" placeholder="e.g. White" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Vehicle'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner" />
      ) : vehicles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🚗</div>
          <p className="empty-state-title">No vehicles added yet</p>
          <p className="empty-state-desc">Add your vehicle to start booking car wash services.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Add Vehicle</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {vehicles.map((v) => (
            <div key={v.id} className="vehicle-card">
              <div className="vehicle-icon">{vehicleEmojis[v.vehicleType] || '🚗'}</div>
              <div className="vehicle-info">
                <div className="vehicle-name">{v.make} {v.model} {v.year ? `(${v.year})` : ''}</div>
                <div className="vehicle-details">{v.vehicleType} {v.color ? `• ${v.color}` : ''}</div>
                <div className="vehicle-reg">{v.registrationNumber}</div>
              </div>
              <div className="vehicle-actions">
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(v.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
