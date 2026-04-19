'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const sidebarLinks = [
  { href: '/dashboard', icon: '📊', label: 'Overview' },
  { href: '/dashboard/book', icon: '📅', label: 'Book a Wash' },
  { href: '/dashboard/bookings', icon: '📋', label: 'My Bookings' },
  { href: '/dashboard/vehicles', icon: '🚗', label: 'My Vehicles' },
  { href: '/dashboard/subscription', icon: '💳', label: 'Subscription' },
  { href: '/dashboard/profile', icon: '👤', label: 'Profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-section-title">Menu</div>
          <nav className="sidebar-nav">
            {sidebarLinks.map((link) => (
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
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: 'var(--space-md)', display: 'none' }}
            id="sidebar-toggle"
          >
            ☰ Menu
          </button>
          <style>{`
            @media (max-width: 1024px) {
              #sidebar-toggle { display: inline-flex !important; }
            }
          `}</style>
          {children}
        </main>
      </div>
    </>
  );
}
