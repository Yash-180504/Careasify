'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const services = [
  { img: '/images/exterior.png', title: 'Exterior Waterless Wash', desc: 'Eco-friendly carnauba wax formula that cleans, shines & protects — no water needed.', price: '₹299', duration: '30 min' },
  { img: '/images/interior.png', title: 'Interior Deep Clean', desc: 'Full vacuum, dashboard dressing, seat clean & air freshener for a showroom-fresh cabin.', price: '₹399', duration: '45 min' },
  { img: '/images/fullwash.png', title: 'Complete Car Spa', desc: 'Our most popular package — full interior + exterior cleaning with tire polish.', price: '₹599', duration: '60 min' },
  { img: '/images/detailing.png', title: 'Premium Detailing', desc: 'Machine polish, ceramic coating, engine bay clean & paint correction for the ultimate finish.', price: '₹1,999', duration: '3 hrs' },
];

const steps = [
  { num: '01', icon: '📋', title: 'Choose Service', desc: 'Browse our range of professional wash & detailing packages.' },
  { num: '02', icon: '📅', title: 'Pick Your Slot', desc: 'Select a convenient date & time — same-day bookings available.' },
  { num: '03', icon: '🏠', title: 'We Come To You', desc: 'Our trained executive arrives at your doorstep, fully equipped.' },
  { num: '04', icon: '✨', title: 'Love Your Car', desc: 'Relax while we transform your ride from dusty to dazzling.' },
];

const features = [
  { icon: '🌿', color: 'emerald', title: 'Eco-Friendly', desc: 'Waterless technology saves 150L per wash. Good for your car, great for the planet.' },
  { icon: '🏠', color: 'blue', title: 'Doorstep Service', desc: 'No commute needed. We wash your car wherever it is — home, office, or parking.' },
  { icon: '💰', color: 'amber', title: 'Transparent Pricing', desc: 'What you see is what you pay. No hidden charges, surprise fees, or upsells.' },
  { icon: '⭐', color: 'purple', title: 'Trained Professionals', desc: 'Background-verified experts with 200+ hours training and quality certifications.' },
  { icon: '📱', color: 'cyan', title: 'Easy Digital Booking', desc: 'Book in seconds from any device. Real-time tracking and instant confirmations.' },
  { icon: '🛡️', color: 'rose', title: 'Quality Guaranteed', desc: 'Not happy? We\'ll redo the service free. 100% satisfaction guaranteed.' },
];

type VehicleType = 'hatchback' | 'sedan' | 'suv';

const plans = [
  {
    name: 'Weekly Wash',
    frequency: 'weekly',
    prices: { hatchback: 599, sedan: 749, suv: 899 },
    features: ['1× Exterior wash per week', '1× Interior vacuum per week', 'Dashboard dressing', 'Real-time app tracking'],
    tier: 'basic',
  },
  {
    name: 'Alternate Day Care',
    frequency: 'alternate',
    prices: { hatchback: 999, sedan: 1199, suv: 1499 },
    features: ['3× Exterior wash per week', '1× Interior vacuum per week', 'Dashboard & tire dressing', 'Priority scheduling', 'App tracking & reports'],
    tier: 'standard',
    featured: true,
  },
  {
    name: 'Daily Shine Plan',
    frequency: 'daily',
    prices: { hatchback: 1499, sedan: 1799, suv: 2199 },
    features: ['6× Exterior wash per week', '1× Interior vacuum per week', 'Dashboard & tire dressing', 'Monthly full detailing', 'Priority support', 'App tracking & reports'],
    tier: 'premium',
  },
];

const testimonials = [
  { name: 'Arjun Mehta', role: 'Creta Owner, Koramangala', text: 'Careasify has been a game-changer! My car looks brand-new every morning. The subscription model saves me so much time and money compared to going to a car wash station.', rating: 5, initials: 'AM' },
  { name: 'Priya Sharma', role: 'i20 Owner, HSR Layout', text: 'I love the waterless cleaning — it\'s eco-friendly AND my car has never been shinier. The team is always punctual, professional, and friendly. Highly recommend!', rating: 5, initials: 'PS' },
  { name: 'Rahul Kumar', role: 'City Owner, Indiranagar', text: 'The premium detailing service was absolutely mind-blowing. They cleaned every single nook and cranny. My 5-year-old car looks like it just came out of the showroom!', rating: 5, initials: 'RK' },
  { name: 'Sneha Reddy', role: 'Seltos Owner, Whitefield', text: 'Booking is super easy and the cleaning quality is consistently excellent. No more wasting weekend mornings at the car wash!', rating: 4, initials: 'SR' },
  { name: 'Vikram Desai', role: 'XUV700 Owner, JP Nagar', text: 'The daily cleaning subscription keeps my SUV spotless. Professional service at an unbeatable price. Best investment for my car\'s maintenance!', rating: 5, initials: 'VD' },
];

const faqs = [
  { q: 'What is Careasify and how does it work?', a: 'Careasify is a premium doorstep car washing and detailing platform. Simply create an account, add your vehicle, pick a service, and schedule a convenient time. Our trained executive arrives at your location with all equipment needed — no water connection required from your end.' },
  { q: 'What is waterless car washing? Is it safe?', a: 'Waterless cleaning uses a special carnauba wax-based spray formula that encapsulates dirt particles, lifts them safely off the surface, and leaves behind a protective, glossy coat. It\'s 100% paint-safe, eco-friendly, and saves over 150 liters of water per wash compared to traditional methods.' },
  { q: 'How does the subscription model work?', a: 'Choose a plan — Daily (6×/week), Alternate Days (3×/week), or Weekly (1×/week). Pay a fixed monthly fee and enjoy regular doorstep cleaning. All plans include interior vacuum cleaning once per week. No long-term contracts — cancel anytime.' },
  { q: 'Can I book an on-demand wash without a subscription?', a: 'Absolutely! You can book a one-time wash or detailing service anytime. Simply log in, select the service, pick your time slot, and we\'ll be there. On-demand bookings are perfect for occasional deep cleans or when guests are coming over!' },
  { q: 'What areas do you currently serve?', a: 'We currently operate in major cities across India including Bangalore, Mumbai, Delhi NCR, Hyderabad, and Pune. We\'re rapidly expanding — enter your city during registration to check availability or get notified when we launch in your area.' },
  { q: 'What if I\'m not satisfied with the service?', a: 'Your satisfaction is our top priority. If you\'re not completely happy with any wash, let us know within 24 hours and we\'ll send our executive to redo it at zero extra cost. We also have a dedicated quality team that monitors every service.' },
];

export default function HomePage() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('sedan');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">🌿 Eco-Friendly • Saves 150L Water Per Wash</div>
              <h1 className="hero-title">
                Your Car Deserves <span className="text-gradient">Premium Care</span> at Your Doorstep
              </h1>
              <p className="hero-description">
                Professional car wash &amp; detailing — delivered to your home, office, or parking spot. Book on-demand or subscribe for daily care starting at just ₹599/month.
              </p>
              <div className="hero-buttons">
                <Link href="/register" className="btn btn-primary btn-lg">
                  Book Your First Wash →
                </Link>
                <Link href="/#pricing" className="btn btn-secondary btn-lg">
                  View Subscription Plans
                </Link>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-number">10,000+</div>
                  <div className="hero-stat-label">Happy Car Owners</div>
                </div>
                <div>
                  <div className="hero-stat-number">50,000+</div>
                  <div className="hero-stat-label">Cars Cleaned</div>
                </div>
                <div>
                  <div className="hero-stat-number">4.9 ★</div>
                  <div className="hero-stat-label">Customer Rating</div>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <Image src="/images/hero.png" alt="Professional doorstep car wash service by Careasify" width={600} height={420} priority style={{ objectFit: 'cover', width: '100%', height: 'auto' }} />
                <div className="hero-image-badge">
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Trusted Service</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Professionals • Insured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section section-alt" id="services">
        <div className="container">
          <div className="text-center">
            <span className="section-badge">✨ Our Services</span>
            <h2 className="section-title" style={{ marginTop: 'var(--space-md)' }}>
              Professional Car Care, Simplified
            </h2>
            <p className="section-subtitle">
              From quick exterior washes to full premium detailing — pick what your car needs.
            </p>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div key={i} className="service-card">
                <Image src={s.img} alt={s.title} width={400} height={220} className="service-card-image" style={{ objectFit: 'cover' }} />
                <div className="service-card-body">
                  <h4 className="service-card-title">{s.title}</h4>
                  <p className="service-card-desc">{s.desc}</p>
                  <div className="service-card-footer">
                    <span className="service-card-price">{s.price}</span>
                    <span className="service-card-duration">⏱ {s.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-xl)' }}>
            <Link href="/register" className="btn btn-primary">Explore All Services →</Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="text-center">
            <span className="section-badge">🔄 Simple Process</span>
            <h2 className="section-title" style={{ marginTop: 'var(--space-md)' }}>
              How Careasify Works
            </h2>
            <p className="section-subtitle">
              Get your car sparkling clean in 4 easy steps — takes less than 60 seconds to book.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card animate-fadeInUp" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="step-number">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section section-alt" id="why-us">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3xl)', alignItems: 'center' }}>
            <div>
              <span className="section-badge">💡 Why Careasify</span>
              <h2 className="section-title" style={{ marginTop: 'var(--space-md)' }}>
                We&apos;re Not Just a Car Wash — We&apos;re Your Car&apos;s Best Friend
              </h2>
              <p style={{ marginTop: 'var(--space-md)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                With 10,000+ happy customers and a 4.9-star rating, Careasify delivers a level of care and convenience that traditional car washes simply cannot match.
              </p>
              <div style={{ marginTop: 'var(--space-xl)' }}>
                <Link href="/register" className="btn btn-primary">
                  Start Today — It&apos;s Free →
                </Link>
              </div>
            </div>
            <div className="about-image">
              <Image src="/images/team.png" alt="Careasify team of professional car wash technicians" width={600} height={400} style={{ objectFit: 'cover', width: '100%', height: 'auto' }} />
            </div>
          </div>
          <div className="features-grid" style={{ marginTop: 'var(--space-3xl)' }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className={`feature-icon ${f.color}`}>{f.icon}</div>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="text-center">
            <span className="section-badge">💳 Subscription Plans</span>
            <h2 className="section-title" style={{ marginTop: 'var(--space-md)' }}>
              Choose Your Perfect Plan
            </h2>
            <p className="section-subtitle">
              Regular car care at fixed monthly prices. Interior vacuum included in every plan. Cancel anytime.
            </p>

            <div className="pricing-toggle" style={{ marginTop: 'var(--space-lg)' }}>
              {(['hatchback', 'sedan', 'suv'] as VehicleType[]).map((type) => (
                <button
                  key={type}
                  className={`pricing-toggle-btn ${selectedVehicle === type ? 'active' : ''}`}
                  onClick={() => setSelectedVehicle(type)}
                >
                  {type === 'hatchback' ? '🚙 Hatchback' : type === 'sedan' ? '🚗 Sedan' : '🚐 SUV/MUV'}
                </button>
              ))}
            </div>
          </div>

          <div className="pricing-cards">
            {plans.map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                <div className="pricing-plan-name">{plan.name}</div>
                <div className="pricing-price">
                  <span className="pricing-currency">₹</span>
                  <span className="pricing-amount">{plan.prices[selectedVehicle]}</span>
                  <span className="pricing-period">/month</span>
                </div>
                <div className="pricing-features">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="pricing-feature">
                      <span className="check-icon">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register" className={`btn w-full ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center" style={{ marginTop: 'var(--space-xl)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            💡 All plans are month-to-month. No lock-in contracts. Free to cancel anytime.
          </p>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="text-center">
            <span className="section-badge">💬 Customer Love</span>
            <h2 className="section-title" style={{ marginTop: 'var(--space-md)' }}>
              Hear From Our Happy Customers
            </h2>
            <p className="section-subtitle">
              Join 10,000+ car owners who trust Careasify for their daily car care.
            </p>
          </div>
          <div className="testimonials-track" style={{ marginTop: 'var(--space-xl)' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section" id="faq">
        <div className="container">
          <div className="text-center">
            <span className="section-badge">❓ Got Questions?</span>
            <h2 className="section-title" style={{ marginTop: 'var(--space-md)' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container">
          <div>
            <h2 className="cta-title">
              Ready for a Sparkling Clean Car Every Day?
            </h2>
            <p className="cta-description">
              Join 10,000+ car owners who wake up to a clean car every morning. First wash is on us!
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary btn-lg">
                Get Started Free →
              </Link>
              <Link href="/#pricing" className="btn btn-secondary btn-lg">
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
