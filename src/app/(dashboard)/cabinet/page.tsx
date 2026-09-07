'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { User, CreditCard, Zap, FileText, Loader2 } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Профиль', icon: User },
  { id: 'subscription', label: 'Подписка', icon: CreditCard },
  { id: 'features', label: 'Возможности', icon: Zap },
  { id: 'payments', label: 'Платежи', icon: FileText },
];

const features = [
  { name: 'Лента трендов США', badge: 'free' },
  { name: '6 фильтров (Shorts, Longform, Gaming, AI, Finance)', badge: 'free' },
  { name: 'Локальный разбор превью (Why it clicks)', badge: 'free' },
  { name: 'Генерация пака превью (AI)', badge: 'pro' },
  { name: 'Очередь ролика (видео)', badge: 'pro' },
];

export default function CabinetPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { data, loading } = useUser();

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (!data?.user) return <div className="text-center text-gray-500">Ошибка загрузки</div>;

  const { user, payments } = data;

  return (
    <div className="max-w-4xl">
      <div className="flex gap-1 mb-6 bg-surface border border-line rounded-inner p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-small text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'
              }`}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <div className="bg-surface border border-line rounded-card p-6 space-y-4">
          <Row label="Email" value={user.email} />
          <Row label="План" value={<span className={`px-2 py-1 rounded-small text-xs font-semibold ${user.proActive ? 'bg-pro/20 text-pro' : 'bg-gray-700 text-gray-300'}`}>{user.proActive ? 'PRO' : 'FREE'}</span>} />
          <Row label="Дата окончания Pro" value={user.proExpiresAt ? new Date(user.proExpiresAt).toLocaleDateString() : '—'} />
          <Row label="Дата регистрации" value={new Date(user.createdAt).toLocaleDateString()} />
        </div>
      )}

      {activeTab === 'subscription' && (
        <div className="bg-surface border border-line rounded-card p-6 space-y-4">
          <Row label="Текущий план" value={user.proActive ? 'Pro' : 'Free'} />
          <Row label="Дата начала" value={new Date(user.createdAt).toLocaleDateString()} />
          <Row label="Дата окончания" value={user.proExpiresAt ? new Date(user.proExpiresAt).toLocaleDateString() : 'Бессрочно (Free)'} />
          <div className="p-3 rounded-inner bg-test/10 border border-test/20 text-test text-sm">⚠️ Платёж в тестовом режиме. Автопродления нет.</div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="bg-surface border border-line rounded-card p-6 space-y-3">
          {features.map((f) => (
            <div key={f.name} className="flex items-center justify-between py-2">
              <span>{f.name}</span>
              <span className={`px-2 py-1 rounded-small text-xs font-semibold ${f.badge === 'free' ? 'bg-success/20 text-success' : 'bg-pro/20 text-pro'}`}>{f.badge.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-surface border border-line rounded-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line text-left text-xs text-gray-500 uppercase">
                <th className="px-5 py-3">ID ЮKassa</th>
                <th className="px-5 py-3">Срок</th>
                <th className="px-5 py-3">Сумма</th>
                <th className="px-5 py-3">Статус</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((p: any) => (
                <tr key={p.id} className="border-b border-line/50">
                  <td className="px-5 py-3 text-sm font-mono">{p.yookassaId.slice(0, 16)}...</td>
                  <td className="px-5 py-3 text-sm">{p.term}</td>
                  <td className="px-5 py-3 text-sm">{(p.amount / 100).toFixed(0)} ₽</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-small text-xs ${p.status === 'succeeded' ? 'bg-success/20 text-success' : 'bg-test/20 text-test'}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
              {(!payments || payments.length === 0) && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-500">История платежей пуста</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-line last:border-0">
      <span className="text-gray-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}
