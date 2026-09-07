'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';

interface Props {
  feature: string;
}

export function ProLock({ feature }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
      <div className="w-16 h-16 rounded-full bg-pro/10 flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-pro" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{feature}</h2>
      <p className="text-gray-400 mb-6 max-w-sm">
        Эта функция доступна только на тарифе Pro. Обновите план, чтобы получить доступ.
      </p>
      <Link href="/pricing" className="px-6 py-3 rounded-inner bg-pro text-white font-medium hover:bg-pro/90 transition-colors">
        Открыть Pro
      </Link>
    </div>
  );
}
