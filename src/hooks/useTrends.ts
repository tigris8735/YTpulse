'use client';

import { useState, useEffect, useCallback } from 'react';
import type { YouTubeVideo } from '@/types';

export function useTrends(initialFilter = 'all') {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [filter, setFilter] = useState(initialFilter);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const load = useCallback(async (force = false) => {
    setLoading(true);
    const res = await fetch(`/api/trends?filter=${filter}${force ? '&force=1' : ''}`);
    const data = await res.json();
    setVideos(data.videos || []);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  return { videos, filter, setFilter, loading, lastUpdated, refresh: () => load(true) };
}
