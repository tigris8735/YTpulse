'use client';

import { useState, useEffect } from 'react';
import { plans } from '@/config/site';
import { Check, Loader2, TestTube } from 'lucide-react';

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((data) => setUser(data.user));
  }, []);

  const handleSelect = async (planId: string) => {
    if (planId === 'free') return;
    setLoading(planId);
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    setLoading(null);
    if (data.redirectUrl) window.location.href = data.redirectUrl;
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-8">
        <TestTube className="w-5 h-5 text-test" />
        <span className="text-test font-medium text-sm">TEST MODE — деньги не списываются</span>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.id} className={`rounded-card border p-6 flex flex-col ${plan.accent ? 'border-accent bg-accent/5' : 'border-line bg-surface'}`}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500 text-sm">/ {plan.period}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
            <button onClick={() => handleSelect(plan.id)} disabled={loading === plan.id || (plan.id === 'free' && user?.plan === 'free')}
              className={`w-full py-3 rounded-inner font-medium transition-colors disabled:opacity-50 ${
                plan.accent ? 'bg-accent text-white hover:bg-accent/90' : 'bg-surface border border-line text-white hover:border-gray-600'
              }`}>
              {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (plan.id === 'free' && user?.plan === 'free') ? 'Текущий план' : 'Выбрать'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
