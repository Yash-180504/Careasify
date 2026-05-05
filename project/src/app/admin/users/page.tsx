'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'customer' | 'admin';
  city: string | null;
  createdAt: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  city: string;
  address: string;
}

const emptyForm: UserForm = { name: '', email: '', password: '', phone: '', role: 'customer', city: '', address: '' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType?.includes('application/json')) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', phone: user.phone || '', role: user.role, city: user.city || '', address: '' });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = '/api/admin/users';
      const method = editingUser ? 'PATCH' : 'POST';
      const body = editingUser
        ? { id: editingUser.id, ...form, password: form.password || undefined }
        : form;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save user');
      }

      setShowModal(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete user');
        return;
      }
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div className="loading-spinner" />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Create, edit, and manage all system users.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Create User</button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Total Users', value: users.length, icon: '👤', color: 'rgba(124,58,237,0.15)' },
          { label: 'Admins', value: users.filter((u) => u.role === 'admin').length, icon: '🛡️', color: 'rgba(245,158,11,0.15)' },
          { label: 'Customers', value: users.filter((u) => u.role === 'customer').length, icon: '🏷️', color: 'rgba(59,130,246,0.15)' },
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

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <h3 className="empty-state-title">No users yet</h3>
          <p className="empty-state-desc">Create your first user to get started.</p>
          <button className="btn btn-primary" onClick={openCreate}>+ Create User</button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }} id="users-table-desktop">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 600 }}>{user.name}</td>
                    <td style={{ fontSize: '0.85rem' }}>{user.email}</td>
                    <td style={{ fontSize: '0.85rem' }}>{user.phone || '—'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{user.city || '—'}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-in-progress' : 'badge-active'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(user)}>Edit</button>
                        {deleteConfirm === user.id ? (
                          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Confirm</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                          </div>
                        ) : (
                          <button className="btn btn-sm" style={{ color: 'var(--accent-rose)' }} onClick={() => setDeleteConfirm(user.id)}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div id="users-cards-mobile">
            {users.map((user) => (
              <div key={user.id} className="card" style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                  <span className={`badge ${user.role === 'admin' ? 'badge-in-progress' : 'badge-active'}`}>{user.role}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
                  {user.phone && <div><strong>Phone:</strong> {user.phone}</div>}
                  {user.city && <div><strong>City:</strong> {user.city}</div>}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openEdit(user)}>Edit</button>
                  {deleteConfirm === user.id ? (
                    <>
                      <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => handleDelete(user.id)}>Confirm</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>✕</button>
                    </>
                  ) : (
                    <button className="btn btn-sm" style={{ flex: 1, color: 'var(--accent-rose)', border: '1px solid var(--border-color)' }} onClick={() => setDeleteConfirm(user.id)}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editingUser ? 'Edit User' : 'Create New User'}</h2>
              <button className="btn btn-icon btn-secondary" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {error && (
              <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#dc2626', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="user-name">Full Name *</label>
                  <input id="user-name" className="form-input" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="user-email">Email *</label>
                  <input id="user-email" className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="user-password">{editingUser ? 'New Password' : 'Password *'}</label>
                  <input id="user-password" className="form-input" type="password" placeholder={editingUser ? 'Leave blank to keep' : 'Min 6 characters'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} {...(!editingUser ? { required: true, minLength: 6 } : {})} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="user-role">Role *</label>
                  <select id="user-role" className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="user-phone">Phone</label>
                  <input id="user-phone" className="form-input" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="user-city">City</label>
                  <input id="user-city" className="form-input" type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="user-address">Address</label>
                <input id="user-address" className="form-input" type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={saving}>
                {saving ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        #users-cards-mobile { display: none; }
        @media (max-width: 1024px) {
          #users-table-desktop { display: none !important; }
          #users-cards-mobile { display: block; }
        }
      `}</style>
    </div>
  );
}
