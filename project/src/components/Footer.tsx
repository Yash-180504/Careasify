import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Image src="/icons/careas-logo.png" alt="Careasify" width={32} height={32} style={{ borderRadius: 6 }} />
              Careasify
            </div>
            <p className="footer-desc">
              India&apos;s most trusted doorstep car wash &amp; detailing platform. Eco-friendly, convenient, and loved by 10,000+ car owners.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <a href="#" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>📘</a>
              <a href="#" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🐦</a>
              <a href="#" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>📷</a>
              <a href="#" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>▶️</a>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Services</h4>
            <div className="footer-links">
              <Link href="/#services" className="footer-link">Exterior Wash</Link>
              <Link href="/#services" className="footer-link">Interior Cleaning</Link>
              <Link href="/#services" className="footer-link">Full Car Spa</Link>
              <Link href="/#services" className="footer-link">Premium Detailing</Link>
              <Link href="/#contact" className="footer-link">Contact Us</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Company</h4>
            <div className="footer-links">
              <Link href="/#how-it-works" className="footer-link">How It Works</Link>
              <Link href="/#why-us" className="footer-link">Why Choose Us</Link>
              <Link href="/#faq" className="footer-link">FAQs</Link>
              <Link href="/#" className="footer-link">About Us</Link>
              <Link href="/#" className="footer-link">Careers</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Support</h4>
            <div className="footer-links">
              <Link href="/#contact" className="footer-link">Contact Us</Link>
              <a href="tel:+917022099595" className="footer-link">📞 +91 70220 99595</a>
              <a href="mailto:support@careasify.com" className="footer-link">✉️ support@careasify.com</a>
              <Link href="/#" className="footer-link">Terms of Service</Link>
              <Link href="/#" className="footer-link">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Careasify. All rights reserved.</span>
          <span>Made with 💜 for cleaner cars &amp; a greener planet</span>
        </div>
      </div>
    </footer>
  );
}
