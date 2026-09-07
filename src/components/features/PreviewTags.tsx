'use client';

import { tagDescriptions } from '@/config/site';
import type { PreviewTags } from '@/types';

interface Props {
  tag: PreviewTags | null;
}

export function PreviewTagsPanel({ tag }: Props) {
  if (!tag) {
    return <div className="text-gray-500 text-sm">Анализ не завершён</div>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(tagDescriptions).map(([key, info]) => {
        const active = tag[key as keyof PreviewTags] as boolean;
        return (
          <div key={key} className={`p-4 rounded-inner border transition-colors ${
            active ? 'border-success/30 bg-success/5' : 'border-line bg-surface'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${active ? 'bg-success' : 'bg-gray-600'}`} />
              <span className="text-sm font-medium">{info.label}</span>
            </div>
            <p className="text-xs text-gray-500">{info.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
