import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');
    if (!videoId) return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });

    const tag = await prisma.previewTags.findUnique({ where: { videoId } });
    return NextResponse.json({ tag });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
