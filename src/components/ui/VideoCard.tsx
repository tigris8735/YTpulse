'use client';

import { formatViews, formatDuration } from '@/lib/services/youtube';
import type { YouTubeVideo } from '@/types';

interface Props {
  video: YouTubeVideo;
  selected?: boolean;
  onClick?: () => void;
}

export function VideoCard({ video, selected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-card overflow-hidden bg-surface border transition-all ${
        selected ? 'border-accent ring-1 ring-accent/30' : 'border-line hover:border-gray-600'
      }`}
    >
      <div className="relative aspect-video">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium">
          {formatDuration(video.duration)}
        </div>
        {video.scoreSum !== undefined && video.scoreSum > 0 && (
          <div className="absolute top-2 left-2 bg-accent/90 px-2 py-0.5 rounded-small text-xs font-bold">
            {video.scoreSum}/4
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-accent transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500">{video.channelTitle}</p>
        <p className="text-xs text-gray-500 mt-0.5">{formatViews(video.viewCount)} просмотров</p>
      </div>
    </div>
  );
}
