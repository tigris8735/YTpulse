'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, Image, Wand2, Film, User, CreditCard, LogOut } from 'lucide-react';

const navItems = [
  { href: '/trends', label: 'Тренды США', icon: TrendingUp },
  { href: '/preview', label: 'Превью', icon: Image },
  { href: '/generate', label: 'Генерация', icon: Wand2 },
  { href: '/queue', label: 'Очередь', icon: Film },
  { href: '/cabinet', label: 'Кабинет', icon: User },
  { href: '/pricing', label: 'Тарифы', icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-[228px] bg-surface border-r border-line flex flex-col z-50">
      <div className="p-5">
        <Link href="/trends" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-small flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">YT Pulse</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-inner text-sm font-medium transition-colors ${
                active ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-line">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs text-gray-400 truncate">{user?.email || '...'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-2 py-1 rounded-small ${
            user?.proActive ? 'bg-pro/20 text-pro' : 'bg-gray-700/50 text-gray-300'
          }`}>
            {user?.proActive ? 'PRO' : 'FREE'}
          </span>
          <button onClick={logout} className="text-gray-500 hover:text-white transition-colors" title="Выйти">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
