'use client';

import { useState, useEffect } from 'react';
import { ProLock } from '@/components/ui/ProLock';
import { useAuth } from '@/hooks/useAuth';
import { Film, Loader2, Play, Clock, CheckCircle } from 'lucide-react';
import type { GenerationJob } from '@/types';

export default function QueuePage() {
  const { user, loading: authLoading, isPro } = useAuth();
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const loadJobs = () => {
    fetch('/api/queue/list')
      .then((r) => r.json())
      .then((data) => setJobs(data.jobs || []));
  };

  useEffect(() => { loadJobs(); }, []);

  const createJob = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await fetch('/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setLoading(false);
    setTitle('');
    loadJobs();
  };

  if (authLoading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (!isPro) return <ProLock feature="Очередь ролика" />;

  const statusIcon = (status: string) => {
    switch (status) {
      case 'queued': return <Clock className="w-4 h-4 text-test" />;
      case 'rendering': return <Loader2 className="w-4 h-4 animate-spin text-test" />;
      case 'ready': return <CheckCircle className="w-4 h-4 text-success" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-line rounded-card p-5">
        <h2 className="text-lg font-semibold mb-4">Создать задачу</h2>
        <div className="flex gap-3">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Название ролика..."
            className="flex-1 px-4 py-3 rounded-inner bg-bg border border-line text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors" />
          <button onClick={createJob} disabled={loading || !title.trim()}
            className="px-6 py-3 rounded-inner bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            <Film className="w-4 h-4" />
            {loading ? 'Создание...' : 'В очередь'}
          </button>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line text-left text-xs text-gray-500 uppercase">
              <th className="px-5 py-3">Тип</th>
              <th className="px-5 py-3">Статус</th>
              <th className="px-5 py-3">Дата</th>
              <th className="px-5 py-3">Действие</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-line/50 hover:bg-white/5">
                <td className="px-5 py-3 text-sm">{job.type === 'video' ? 'Видео' : 'Превью'}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 text-sm">
                    {statusIcon(job.status)}
                    {job.status === 'queued' && 'В очереди'}
                    {job.status === 'rendering' && 'Рендеринг'}
                    {job.status === 'ready' && 'Готово'}
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  {job.status === 'ready' && job.fileUrl && (
                    <button onClick={() => alert(`Видео: ${job.fileUrl}`)}
                      className="flex items-center gap-1 text-sm text-accent hover:underline">
                      <Play className="w-4 h-4" /> Смотреть
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-500">Нет задач. Создайте первую выше.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
