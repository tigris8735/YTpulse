'use client';

import { filters } from '@/config/site';

interface Props {
  active: string;
  onChange: (filter: string) => void;
}

export function FilterChips({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === f.id
              ? 'bg-accent text-white'
              : 'bg-surface border border-line text-gray-400 hover:text-white hover:border-gray-600'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
