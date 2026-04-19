'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [vRes, sRes] = await Promise.all([
          fetch('/api/vehicles'),
          fetch('/api/services'),
        ]);
        const vData = await vRes.json();
        const sData = await sRes.json();
        setVehicles(Array.isArray(vData) ? vData : []);
        setServices(Array.isArray(sData) ? sData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedServiceData = services.find((s) => s.id === selectedService);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: selectedVehicle,
          serviceId: selectedService,
          scheduledDate: date,
          scheduledTime: time,
          address,
          totalPrice: selectedServiceData?.basePrice,
          notes,
        }),
      });

      if (res.ok) {
        router.push('/dashboard/bookings');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = ['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  if (loading) return <div className="loading-spinner" />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Book a Car Wash</h1>
        <p className="page-subtitle">Follow the steps below to schedule your service.</p>
      </div>

      {/* Step Indicators */}
      <div className="booking-steps">
        {['Vehicle', 'Service', 'Schedule', 'Confirm'].map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div className={`booking-step ${step > i + 1 ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="booking-step-number">{step > i + 1 ? '✓' : i + 1}</div>
              <span className="booking-step-label">{label}</span>
            </div>
            {i < 3 && <div className="booking-step-connector" />}
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Step 1: Select Vehicle */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Select Your Vehicle</h3>
            {vehicles.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🚗</div>
                <p className="empty-state-title">No vehicles added</p>
                <p className="empty-state-desc">You need to add a vehicle first before booking.</p>
                <button onClick={() => router.push('/dashboard/vehicles')} className="btn btn-primary btn-sm">
                  Add Vehicle
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    className={`service-option ${selectedVehicle === v.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVehicle(v.id)}
                  >
                    <div className="service-option-title">
                      {v.make} {v.model} {v.year ? `(${v.year})` : ''}
                    </div>
                    <div className="service-option-desc">
                      {v.registrationNumber} • {v.vehicleType} {v.color ? `• ${v.color}` : ''}
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary" disabled={!selectedVehicle} onClick={() => setStep(2)}>
                  Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Service */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Choose a Service</h3>
            <div className="service-selection-grid">
              {services.map((s) => (
                <div
                  key={s.id}
                  className={`service-option ${selectedService === s.id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(s.id)}
                >
                  <div className="service-option-title">{s.name}</div>
                  <div className="service-option-price">₹{s.basePrice}</div>
                  <div className="service-option-desc">{s.description}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    ⏱ {s.durationMinutes} min
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" disabled={!selectedService} onClick={() => setStep(3)}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Pick Date & Time</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 'var(--space-sm)' }}>
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`btn btn-sm ${time === slot ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Service Address</label>
                <input className="form-input" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea className="form-textarea" placeholder="Any special instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" disabled={!date || !time || !address} onClick={() => setStep(4)}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Confirm Your Booking</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ padding: 'var(--space-lg)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-md)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Vehicle:</span>
                  <span>{vehicles.find(v => v.id === selectedVehicle)?.make} {vehicles.find(v => v.id === selectedVehicle)?.model}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Service:</span>
                  <span>{selectedServiceData?.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                  <span>{date}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Time:</span>
                  <span>{time}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                  <span>{address}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Price:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-blue-light)', fontSize: '1.2rem' }}>₹{selectedServiceData?.basePrice}</span>
                </div>
              </div>
              {notes && (
                <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                  <strong>Notes:</strong> {notes}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <button className="btn btn-secondary" onClick={() => setStep(3)}>← Back</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Booking...' : 'Confirm Booking ✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
