'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';

  const publicLinks = [
    { href: '/#services', label: 'Services' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand">
            <Image src="/icons/icon-192.png" alt="Careasify" width={36} height={36} style={{ borderRadius: 8 }} />
            Careasify
          </Link>

          <div className="navbar-links">
            {publicLinks.map((link) => (
              <Link key={link.href} href={link.href} className="navbar-link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            {session ? (
              <>
                <Link href={isAdmin ? '/admin' : '/dashboard'} className="btn btn-secondary btn-sm">
                  {isAdmin ? '⚙️ Admin' : '📊 Dashboard'}
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-sm" style={{ color: 'var(--text-muted)' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
            <button
              className="navbar-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        {publicLinks.map((link) => (
          <Link key={link.href} href={link.href} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
            {link.label}
          </Link>
        ))}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {session ? (
            <>
              <Link href={isAdmin ? '/admin' : '/dashboard'} className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                {isAdmin ? '⚙️ Admin Panel' : '📊 Dashboard'}
              </Link>
              <button onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false); }} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link href="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
