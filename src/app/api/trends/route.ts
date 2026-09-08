import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { fetchTrendingUS, applyFilter, formatViews, formatDuration } from '@/lib/services/youtube';

const CACHE_TTL_MINUTES = 30;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const force = searchParams.get('force') === '1';

    const cached = await prisma.trendsCache.findUnique({
      where: { filter_region: { filter, region: 'US' } },
    });

    const now = new Date();
    const cacheValid = cached && (now.getTime() - cached.fetchedAt.getTime()) < CACHE_TTL_MINUTES * 60 * 1000;

    let videos: any[] = [];
    if (cached && cacheValid && !force) {
      videos = cached.youtubeJson as any[];
    } else {
      const allVideos = await fetchTrendingUS();
      videos = applyFilter(allVideos, filter);
      await prisma.trendsCache.upsert({
        where: { filter_region: { filter, region: 'US' } },
        update: { youtubeJson: videos, fetchedAt: now },
        create: { filter, region: 'US', youtubeJson: videos, fetchedAt: now },
      });
      // Trigger analysis async
      fetch(`${req.nextUrl.origin}/api/preview/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoIds: videos.map((v: any) => v.id) }),
      }).catch(() => {});
    }
    
    const videoIds = videos.map((v: any) => v.id);
    const tags = await prisma.previewTags.findMany({ where: { videoId: { in: videoIds } } });
    const tagMap = new Map(tags.map((t) => [t.videoId, t]));

    const enriched = videos.map((v: any) => ({
      ...v,
      viewCountFormatted: formatViews(v.viewCount),
      durationFormatted: formatDuration(v.duration),
      scoreSum: (tagMap.get(v.id)?.scoreSum as number | undefined) ??   0,
      tags: tagMap.get(v.id) ?? null,
    }));

    enriched.sort((a: any, b: any) => (b.scoreSum  as number ) - (a.scoreSum - a.scoreSum));
    return NextResponse.json({ videos: enriched, cached: !force && cacheValid });
  } catch (e) {
    console.error('[API] Trends error:', e);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}
