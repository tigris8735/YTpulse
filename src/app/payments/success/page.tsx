'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((data) => setUser(data.user));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Оплата прошла</h1>
        <p className="text-gray-400 mb-2">Ваш план обновлён до Pro</p>
        {user?.proExpiresAt && (
          <p className="text-sm text-gray-500 mb-8">Действует до: {new Date(user.proExpiresAt).toLocaleDateString()}</p>
        )}
        <div className="space-y-3">
          <Link href="/generate" className="inline-flex items-center gap-2 px-6 py-3 rounded-inner bg-accent text-white font-medium hover:bg-accent/90 transition-colors">
            Перейти к генерации<ArrowRight className="w-4 h-4" />
          </Link>
          <div><Link href="/trends" className="text-sm text-gray-500 hover:text-white transition-colors">Вернуться к трендам</Link></div>
        </div>
      </div>
    </div>
  );
}
