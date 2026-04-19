'use client';

import { useEffect, useState } from 'react';

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleType, setVehicleType] = useState<'hatchback' | 'sedan' | 'suv'>('sedan');

  useEffect(() => {
    fetch('/api/subscriptions')
      .then((r) => r.json())
      .then((data) => setPlans(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const priceKey = `price${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}` as 'priceHatchback' | 'priceSedan' | 'priceSuv';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Subscription Plans</h1>
        <p className="page-subtitle">Choose a plan for regular car cleaning at your doorstep.</p>
      </div>

      <div className="pricing-toggle" style={{ marginBottom: 'var(--space-xl)' }}>
        {(['hatchback', 'sedan', 'suv'] as const).map((type) => (
          <button
            key={type}
            className={`pricing-toggle-btn ${vehicleType === type ? 'active' : ''}`}
            onClick={() => setVehicleType(type)}
          >
            {type === 'hatchback' ? '🚙 Hatchback' : type === 'sedan' ? '🚗 Sedan' : '🚐 SUV'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <div className="pricing-cards">
          {plans.map((plan, i) => (
            <div key={plan.id} className={`pricing-card ${plan.frequency === 'alternate_days' ? 'featured' : ''}`}>
              <div className="pricing-plan-name">{plan.name}</div>
              <div className="pricing-price">
                <span className="pricing-currency">₹</span>
                <span className="pricing-amount">{plan[priceKey]}</span>
                <span className="pricing-period">/month</span>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="check-icon">✓</span>
                  <span>Exterior: {plan.exteriorCleanings}</span>
                </div>
                <div className="pricing-feature">
                  <span className="check-icon">✓</span>
                  <span>Interior: {plan.interiorCleanings}</span>
                </div>
                {plan.features?.split(',').map((f: string, j: number) => (
                  <div key={j} className="pricing-feature">
                    <span className="check-icon">✓</span>
                    <span>{f.trim()}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary w-full">
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
