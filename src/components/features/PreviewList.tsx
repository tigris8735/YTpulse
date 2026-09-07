'use client';

import type { YouTubeVideo } from '@/types';

interface Props {
  videos: YouTubeVideo[];
  selectedId: string | null;
  onSelect: (video: YouTubeVideo) => void;
}

export function PreviewList({ videos, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-2">
      {videos.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v)}
          className={`w-full flex items-center gap-3 p-2 rounded-inner text-left transition-colors ${
            selectedId === v.id ? 'bg-accent/10 border border-accent/30' : 'hover:bg-white/5'
          }`}
        >
          <img src={v.thumbnail} alt="" className="w-20 h-12 object-cover rounded-small" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{v.title}</p>
            <p className="text-xs text-gray-500">{v.viewCountFormatted}</p>
          </div>
          {v.scoreSum !== undefined && v.scoreSum > 0 && (
            <span className="text-xs font-bold text-accent">{v.scoreSum}</span>
          )}
        </button>
      ))}
    </div>
  );
}
