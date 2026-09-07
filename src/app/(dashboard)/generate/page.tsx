'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProLock } from '@/components/ui/ProLock';
import { useAuth } from '@/hooks/useAuth';
import { Wand2, Loader2, Check } from 'lucide-react';
import type { ThumbnailVariant } from '@/types';

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('video');
  const { user, loading: authLoading, isPro } = useAuth();

  const [trendTitle, setTrendTitle] = useState('');
  const [variants, setVariants] = useState<ThumbnailVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'idle' | 'text' | 'image' | 'done'>('idle');

  useEffect(() => {
    if (videoId) {
      fetch('/api/trends?filter=all')
        .then((r) => r.json())
        .then((data) => {
          const video = data.videos?.find((v: any) => v.id === videoId);
          if (video) setTrendTitle(video.title);
        });
    }
  }, [videoId]);

  const handleGenerate = async () => {
    if (!trendTitle.trim()) return;
    setLoading(true);
    setStep('text');

    const res = await fetch('/api/generate/thumbnail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trendTitle }),
    });

    setStep('image');
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setVariants(data.variants || []);
      setStep('done');
    }
  };

  if (authLoading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (!isPro) return <ProLock feature="Генерация превью" />;

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      <div className="w-[360px] flex-shrink-0">
        <div className="bg-surface border border-line rounded-card p-5">
          <h2 className="text-lg font-semibold mb-4">Генерация пака</h2>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1.5">Тема / тренд</label>
            <textarea value={trendTitle} onChange={(e) => setTrendTitle(e.target.value)} rows={3}
              className="w-full px-4 py-3 rounded-inner bg-bg border border-line text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="Введите тему ролика..." />
          </div>

          <div className="space-y-2 mb-4">
            <StatusStep label="Генерация текста" state={step === 'text' ? 'loading' : step === 'image' || step === 'done' ? 'done' : 'pending'} />
            <StatusStep label="Генерация изображений" state={step === 'image' ? 'loading' : step === 'done' ? 'done' : 'pending'} />
            <StatusStep label="Готово" state={step === 'done' ? 'done' : 'pending'} />
          </div>

          <button onClick={handleGenerate} disabled={loading || !trendTitle.trim()}
            className="w-full py-3 rounded-inner bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loading ? 'Генерация...' : 'Сгенерировать'}
          </button>
        </div>
      </div>

      <div className="flex-1">
        {variants.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {variants.map((v) => (
              <div key={v.id} className="bg-surface border border-line rounded-card overflow-hidden">
                <div className="relative aspect-video">
                  <img src={v.imageUrl} alt={v.text} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {step === 'idle' ? 'Заполните форму и нажмите "Сгенерировать"' : 'Генерация...'}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusStep({ label, state }: { label: string; state: 'pending' | 'loading' | 'done' }) {
  return (
    <div className={`flex items-center gap-2 text-sm ${state === 'done' ? 'text-success' : state === 'loading' ? 'text-test' : 'text-gray-500'}`}>
      {state === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : state === 'done' ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-gray-600" />}
      {label}
    </div>
  );
}
