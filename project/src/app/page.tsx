'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const services = [
  { img: '/images/exterior.png', title: 'Exterior Lesswater Wash', desc: 'Eco-friendly Careasify special dry wash formula that cleans, shines & protects.', duration: '30 min' },  { img: '/images/interior.png', title: 'Interior Deep Clean', desc: 'Full vacuum, dashboard dressing, seat clean & proper boot clean for a showroom-fresh cabin.', duration: '45 min' },
  { img: '/images/fullwash.png', title: 'Complete Car Spa', desc: 'Our most popular package — full interior + exterior cleaning with tire polish.', duration: '60 min' },
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
  { icon: '💬', color: 'amber', title: 'Custom Pricing', desc: 'Get a personalized quote tailored to your vehicle and service needs. Just ask!' },
  { icon: '⭐', color: 'purple', title: 'Trained Professionals', desc: 'Background-verified experts with 200+ hours training and quality certifications.' },
  { icon: '📱', color: 'cyan', title: 'Easy Digital Booking', desc: 'Book in seconds from any device. Real-time tracking and instant confirmations.' },
  { icon: '🛡️', color: 'rose', title: 'Quality Guaranteed', desc: 'Not happy? We\'ll redo the service free. 100% satisfaction guaranteed.' },
];

const testimonials = [
  { name: 'Arjun Mehta', role: 'Creta Owner, Koramangala', text: 'Careasify has been a game-changer! My car looks brand-new every morning. The subscription model saves me so much time and money compared to going to a car wash station.', rating: 5, initials: 'AM' },
  { name: 'Priya Sharma', role: 'i20 Owner, HSR Layout', text: 'I love the waterless cleaning — it\'s eco-friendly AND my car has never been shinier. The team is always punctual, professional, and friendly. Highly recommend!', rating: 5, initials: 'PS' },
  { name: 'Rahul Kumar', role: 'City Owner, Indiranagar', text: 'The premium detailing service was absolutely mind-blowing. They cleaned every single nook and cranny. My 5-year-old car looks like it just came out of the showroom!', rating: 5, initials: 'RK' },
  { name: 'Sneha Reddy', role: 'Seltos Owner, Whitefield', text: 'Booking is super easy and the cleaning quality is consistently excellent. No more wasting weekend mornings at the car wash!', rating: 4, initials: 'SR' },
  { name: 'Vikram Desai', role: 'XUV700 Owner, JP Nagar', text: 'The daily cleaning subscription keeps my SUV spotless. Professional service at an unbeatable price. Best investment for my car\'s maintenance!', rating: 5, initials: 'VD' },
];

const faqs = [
  { q: 'What is Careasify and how does it work?', a: 'Careasify is a premium doorstep car washing platform. Simply <a href="/#contact" style="color: var(--accent-blue); font-weight: 600; text-decoration: underline;">contact us</a>, add your vehicle details, pick a service, and schedule a convenient time. Our trained executive arrives at your location with all equipment needed.' },
  { q: 'What is waterless car washing? Is it safe?', a: 'Waterless cleaning uses a special carnauba wax-based spray formula that encapsulates dirt particles, lifts them safely off the surface, and leaves behind a protective, glossy coat. It\'s 100% paint-safe, eco-friendly, and saves over 150 liters of water per wash compared to traditional methods.' },
  { q: 'How do I get a pricing quote?', a: 'Simply fill out the <a href="/#contact" style="color: var(--accent-blue); font-weight: 600; text-decoration: underline;">contact form</a> on our website or <a href="tel:+917022099595" style="color: var(--accent-blue); font-weight: 600; text-decoration: underline;">call us</a> directly. Our team will provide a personalized quote based on your vehicle type, chosen services, and frequency. We offer flexible plans to suit every budget.' },
  { q: 'Can I book an on-demand wash without a subscription?', a: 'Absolutely! You can book a one-time wash or detailing service anytime. Simply <a href="/#contact" style="color: var(--accent-blue); font-weight: 600; text-decoration: underline;">contact us</a>, select the service, pick your time slot, and we\'ll be there. On-demand bookings are perfect for occasional deep cleans or when guests are coming over!' },
  { q: 'What areas do you currently serve?', a: 'We currently operate in major cities across India including Bangalore, Mumbai, Delhi NCR, Hyderabad, and Pune. We\'re rapidly expanding — enter your city during registration to check availability or get notified when we launch in your area.' },
  { q: 'What if I\'m not satisfied with the service?', a: 'Your satisfaction is our top priority. If you\'re not completely happy with any wash, let us know within 24 hours and we\'ll send our executive to redo it at zero extra cost. We also have a dedicated quality team that monitors every service.' },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', vehicleType: '', service: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', vehicleType: '', service: '', message: '' });
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit. Please try again.');
      setFormStatus('error');
    }
  };

  return (
    <>
      <Navbar />
      <main id="main-content">

      {/* ===== HERO ===== */}
      <section className="hero" aria-label="Hero banner">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Your Car Deserves <span className="text-gradient">Premium Care</span> at Your Doorstep
              </h1>
              <p className="hero-description">
                Professional car wash — delivered to your home, office, or parking spot. Book on-demand or subscribe for daily care. Contact us for custom pricing.
              </p>
              <div className="hero-buttons">
                <Link href="/#contact" className="btn btn-primary btn-lg">
                  Get a Free Quote →
                </Link>
                <Link href="/#services" className="btn btn-secondary btn-lg">
                  Explore Services
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
      <section className="section section-alt" id="services" aria-label="Our services">
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
                    <Link href="/#contact" className="service-card-price" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-blue)', cursor: 'pointer', textDecoration: 'underline' }}>Contact for pricing</Link>
                    <span className="service-card-duration">⏱ {s.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 'var(--space-xl)' }}>
            <Link href="/#contact" className="btn btn-primary">Get a Quote →</Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" id="how-it-works" aria-label="How it works">
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
      <section className="section section-alt" id="why-us" aria-label="Why choose Careasify">
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
                <Link href="/#contact" className="btn btn-primary">
                  Contact Us Today →
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

      {/* ===== CONTACT / PRICING ===== */}
      <section className="section contact-section" id="contact" aria-label="Contact us for pricing">
        <div className="container">
          <div className="text-center">
            <span className="section-badge">💜 Get in Touch</span>
            <h2 className="section-title" style={{ marginTop: 'var(--space-md)' }}>
              For Pricing, Contact Us
            </h2>
            <p className="section-subtitle">
              Fill out the form below and our team will get back to you with a personalized quote within 24 hours.
            </p>
          </div>

          <div className="contact-wrapper">
            <div className="contact-info">
              <div className="contact-pricing-badge">💰 Custom Pricing for Every Need</div>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
                We believe in providing tailored solutions. Whether you need a one-time wash or a monthly subscription, we&apos;ll create a plan that fits your budget and requirements perfectly.
              </p>
              <div className="contact-info-item">
                <div className="contact-info-icon">📞</div>
                <div>
                  <div className="contact-info-title">Call Us</div>
                  <div className="contact-info-text">+91 70220 99595</div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">✉️</div>
                <div>
                  <div className="contact-info-title">Email Us</div>
                  <div className="contact-info-text">support@careasify.com</div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">🕐</div>
                <div>
                  <div className="contact-info-title">Working Hours</div>
                  <div className="contact-info-text">Tues - Sun, 6:00 AM — 8:00 PM</div>
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              {formStatus === 'success' ? (
                <div className="contact-success">
                  <div className="contact-success-icon">🎉</div>
                  <h3 className="contact-success-title">Thank You!</h3>
                  <p className="contact-success-text">
                    Your inquiry has been submitted successfully. Our team will reach out to you within 24 hours with a personalized quote.
                  </p>
                  <button
                    className="btn btn-secondary"
                    style={{ marginTop: 'var(--space-lg)' }}
                    onClick={() => setFormStatus('idle')}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="contact-form-title">Request a Quote</h3>
                  <p className="contact-form-subtitle">Fill in your details and we&apos;ll get back to you shortly.</p>

                  {formStatus === 'error' && (
                    <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#dc2626', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
                      {formError}
                    </div>
                  )}

                  <form className="contact-form" onSubmit={handleFormSubmit}>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="contact-name">Full Name *</label>
                        <input id="contact-name" name="name" className="form-input" type="text" placeholder="John Doe" value={formData.name} onChange={handleFormChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="contact-email">Email *</label>
                        <input id="contact-email" name="email" className="form-input" type="email" placeholder="john@example.com" value={formData.email} onChange={handleFormChange} required />
                      </div>
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="contact-phone">Phone Number *</label>
                        <input id="contact-phone" name="phone" className="form-input" type="tel" placeholder="+91 70220 99595" value={formData.phone} onChange={handleFormChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="contact-vehicle">Vehicle Type</label>
                        <select id="contact-vehicle" name="vehicleType" className="form-select" value={formData.vehicleType} onChange={handleFormChange}>
                          <option value="">Select vehicle type</option>
                          <option value="hatchback">Hatchback</option>
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV / MUV</option>
                          <option value="luxury">Luxury</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-service">Service Interested In</label>
                      <select id="contact-service" name="service" className="form-select" value={formData.service} onChange={handleFormChange}>
                        <option value="">Select a service</option>
                        <option value="exterior_wash">Exterior Waterless Wash</option>
                        <option value="interior_clean">Interior Deep Clean</option>
                        <option value="complete_spa">Complete Car Spa</option>
                        <option value="premium_detailing">Premium Detailing</option>
                        <option value="subscription">Monthly Subscription</option>
                        <option value="other">Other / Custom</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-message">Message / Notes</label>
                      <textarea id="contact-message" name="message" className="form-textarea" placeholder="Tell us about your requirements, preferred schedule, or any questions..." value={formData.message} onChange={handleFormChange} rows={4} />
                    </div>
                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={formStatus === 'loading'}>
                      {formStatus === 'loading' ? 'Submitting...' : 'Submit Inquiry →'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
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
                <div className="faq-answer" dangerouslySetInnerHTML={{ __html: faq.a }} />
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
              Join 10,000+ car owners who wake up to a clean car every morning. Get your free quote today!
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/#contact" className="btn btn-primary btn-lg">
                Contact Us Now →
              </Link>
              <Link href="/#services" className="btn btn-secondary btn-lg">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
