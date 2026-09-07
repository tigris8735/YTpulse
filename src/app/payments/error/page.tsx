'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Оплата не завершена</h1>
        <p className="text-gray-400 mb-8">Что-то пошло не так. Попробуйте ещё раз или выберите другой способ оплаты.</p>
        <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-inner bg-surface border border-line text-white font-medium hover:border-gray-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />Вернуться к тарифам
        </Link>
      </div>
    </div>
  );
}
