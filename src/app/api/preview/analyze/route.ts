import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { analyzePreview } from '@/lib/services/analyzer';
import { error } from 'console';

export async function POST(req: NextRequest) {
  try {
    const { videoIds } = await req.json();
    if (!Array.isArray(videoIds)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const existing = await prisma.previewTags.findMany({
      where: { videoId: { in: videoIds } },
      select: { videoId: true },
    });
    const existingSet = new Set(existing.map( (e)  => e.videoId));
    const toAnalyze = videoIds.filter((id) => !existingSet.has(id));

    const results = [];
    for (const videoId of toAnalyze.slice(0, 10)) {
      try {
        const analysis = await analyzePreview(videoId);
        const saved = await prisma.previewTags.create({ data: analysis });
        results.push(saved);
      } catch (e) {
        console.warn(`[Analyzer] Failed ${videoId}:`, e);
      }
    }

    return NextResponse.json({ analyzed: results.length, total: toAnalyze.length });
  } catch (e) {
    console.error('[API] Analyze error:', e);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
