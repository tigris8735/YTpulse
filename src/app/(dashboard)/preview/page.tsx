'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PreviewList } from '@/components/features/PreviewList';
import { PreviewTagsPanel } from '@/components/features/PreviewTags';
import type { YouTubeVideo, PreviewTags } from '@/types';

export const dynamic = 'force-dynamic';

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
      <PreviewPageContent />
    </Suspense>
  );
}

function PreviewPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('video');

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selected, setSelected] = useState<YouTubeVideo | null>(null);
  const [tag, setTag] = useState<PreviewTags | null>(null);

  useEffect(() => {
    fetch('/api/trends?filter=all')
      .then((r) => r.json())
      .then((data) => {
        const list = data.videos || [];
        setVideos(list);
        const preselect = videoId ? list.find((v: YouTubeVideo) => v.id === videoId) : list[0];
        if (preselect) setSelected(preselect);
      });
  }, [videoId]);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/preview?videoId=${selected.id}`)
      .then((r) => r.json())
      .then((data) => setTag(data.tag));
  }, [selected]);

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      <div className="w-[280px] flex-shrink-0 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Top performing</h3>
        <PreviewList videos={videos} selectedId={selected?.id || null} onSelect={setSelected} />
      </div>

      <div className="flex-1 flex items-center justify-center">
        {selected ? (
          <div className="w-full max-w-2xl">
            <div className="relative aspect-video rounded-card overflow-hidden border border-line">
              <img src={selected.thumbnail} alt={selected.title} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-medium mt-4">{selected.title}</h2>
          </div>
        ) : (
          <div className="text-gray-500">Выберите превью</div>
        )}
      </div>

      <aside className="w-[280px] flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Why it clicks</h3>
        <PreviewTagsPanel tag={tag} />
      </aside>
    </div>
  );
}