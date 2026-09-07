'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Ошибка регистрации');
      return;
    }

    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (loginRes.ok) window.location.href = '/trends';
    else window.location.href = '/login';
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-accent rounded-card flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold">YT Pulse</h1>
        <p className="text-gray-500 text-sm mt-1">Создание аккаунта</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-inner bg-surface border border-line text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
            placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-4 py-3 rounded-inner bg-surface border border-line text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
            placeholder="••••••••" />
        </div>

        {error && <div className="p-3 rounded-inner bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-inner bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50">
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Уже есть аккаунт? <Link href="/login" className="text-accent hover:underline">Войти</Link>
      </p>
    </div>
  );
}
