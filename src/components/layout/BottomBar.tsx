'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const hints: Record<string, string> = {
  '/trends': 'Выберите ролик для разбора или генерации',
  '/preview': 'Кликните превью слева, чтобы увидеть детали',
  '/generate': 'Заполните форму и получите 3 варианта превью',
  '/queue': 'Создайте задачу на генерацию ролика',
  '/cabinet': 'Управляйте профилем и подпиской',
  '/pricing': 'Выберите подходящий план',
};

export function BottomBar() {
  const pathname = usePathname();
  const hint = hints[pathname] || '';

  return (
    <div className="fixed bottom-0 left-[228px] right-0 h-[72px] bg-surface border-t border-line flex items-center justify-between px-6 z-40">
      <p className="text-sm text-gray-400">{hint}</p>
      <div className="flex items-center gap-3">
        {pathname === '/trends' && (
          <>
            <Link href="/preview" className="px-4 py-2 rounded-inner bg-surface border border-line text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors">
              Разобрать превью
            </Link>
            <Link href="/generate" className="px-4 py-2 rounded-inner bg-accent text-sm font-medium hover:bg-accent/90 transition-colors">
              Сгенерировать пак
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
