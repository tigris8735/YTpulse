'use client';

import { formatDuration, formatViews } from '@/lib/services/youtube';
import type { YouTubeVideo, PreviewTags } from '@/types';

interface Props {
  video: YouTubeVideo | null;
  tag: PreviewTags | null;
}

export function TrendRail({ video, tag }: Props) {
  if (!video) {
    return <div className="text-center text-gray-500 py-10">Выберите ролик из списка</div>;
  }

  return (
    <div>
      <div className="relative aspect-video rounded-inner overflow-hidden mb-4">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium">
          {formatDuration(video.duration)}
        </div>
      </div>
      <h3 className="font-medium mb-2 line-clamp-2">{video.title}</h3>
      <p className="text-sm text-gray-500 mb-1">{video.channelTitle}</p>
      <p className="text-sm text-gray-500 mb-4">{formatViews(video.viewCount)} просмотров</p>

      {tag && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${tag.faceCloseup ? 'bg-success' : 'bg-gray-600'}`} />
            <span className="text-sm">Face closeup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${tag.highContrast ? 'bg-success' : 'bg-gray-600'}`} />
            <span className="text-sm">High contrast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${tag.textArea ? 'bg-success' : 'bg-gray-600'}`} />
            <span className="text-sm">Text area</span>
          </div>
          <div className="mt-3 pt-3 border-t border-line">
            <span className="text-xs text-gray-500">Score: {tag.scoreSum}/4</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <button onClick={() => window.location.href = `/preview?video=${video.id}`}
          className="w-full py-2.5 rounded-inner bg-surface border border-line text-sm hover:border-gray-600 transition-colors">
          Разобрать превью
        </button>
        <button onClick={() => window.location.href = `/generate?video=${video.id}`}
          className="w-full py-2.5 rounded-inner bg-accent text-sm font-medium hover:bg-accent/90 transition-colors">
          Сгенерировать пак
        </button>
      </div>
    </div>
  );
}
