'use client';

import { useState, useEffect } from 'react';
import { VideoCard } from '@/components/ui/VideoCard';
import { FilterChips } from '@/components/ui/FilterChips';
import { TrendRail } from '@/components/features/TrendRail';
import { RefreshCw } from 'lucide-react';
import type { YouTubeVideo, PreviewTags } from '@/types';

export default function TrendsPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<YouTubeVideo | null>(null);
  const [tag, setTag] = useState<PreviewTags | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const load = async (force = false) => {
    setLoading(true);
    const res = await fetch(`/api/trends?filter=${filter}${force ? '&force=1' : ''}`);
    const data = await res.json();
    setVideos(data.videos || []);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/preview?videoId=${selected.id}`)
      .then((r) => r.json())
      .then((data) => setTag(data.tag));
  }, [selected]);

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <FilterChips active={filter} onChange={setFilter} />
          <button onClick={() => load(true)} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-inner bg-surface border border-line text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Обновить кэш
          </button>
        </div>

        {lastUpdated && <p className="text-xs text-gray-500 mb-4">Обновлено: {lastUpdated}</p>}

        <div className="grid grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} selected={selected?.id === video.id} onClick={() => setSelected(video)} />
          ))}
        </div>

        {videos.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500">Нет данных. Нажмите "Обновить кэш".</div>
        )}
      </div>

      <aside className="w-[320px] bg-surface border border-line rounded-card p-5 flex-shrink-0">
        <TrendRail video={selected} tag={tag} />
      </aside>
    </div>
  );
}
