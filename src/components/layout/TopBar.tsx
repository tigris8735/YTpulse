'use client';

import { usePathname } from 'next/navigation';

const titles: Record<string, { title: string; subtitle: string }> = {
  '/trends': { title: 'Тренды США', subtitle: 'YouTube Data API v3 — mostPopular, region=US' },
  '/preview': { title: 'Превью', subtitle: 'Локальный разбор кликабельности' },
  '/generate': { title: 'Генерация', subtitle: 'AI-генерация пака превью' },
  '/queue': { title: 'Очередь ролика', subtitle: 'Генерация и склейка видео' },
  '/cabinet': { title: 'Личный кабинет', subtitle: 'Профиль, подписка, платежи' },
  '/pricing': { title: 'Тарифы', subtitle: 'Выбор плана и оплата' },
};

export function TopBar() {
  const pathname = usePathname();
  const info = titles[pathname] || { title: 'YT Pulse', subtitle: '' };

  return (
    <header className="h-16 border-b border-line bg-surface/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-semibold">{info.title}</h1>
        <p className="text-xs text-gray-500">{info.subtitle}</p>
      </div>
    </header>
  );
}
