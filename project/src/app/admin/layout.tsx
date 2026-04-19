'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const adminLinks = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/bookings', icon: '📋', label: 'Bookings' },
  { href: '/admin/staff', icon: '👥', label: 'Staff' },
  { href: '/admin/services', icon: '🧽', label: 'Services' },
  { href: '/admin/customers', icon: '👤', label: 'Customers' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-section-title">Admin Panel</div>
          <nav className="sidebar-nav">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sidebar-link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="dashboard-main">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: 'var(--space-md)', display: 'none' }}
            id="admin-sidebar-toggle"
          >
            ☰ Menu
          </button>
          <style>{`
            @media (max-width: 1024px) {
              #admin-sidebar-toggle { display: inline-flex !important; }
            }
          `}</style>
          {children}
        </main>
      </div>
    </>
  );
}
