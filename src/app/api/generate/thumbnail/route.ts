import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, isPro } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { generateThumbnailText, buildVariants } from '@/lib/services/ai';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('yt-session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !isPro(user.plan, user.proExpiresAt)) {
      return NextResponse.json({ error: 'Pro required' }, { status: 403 });
    }

    const { trendTitle } = await req.json();
    if (!trendTitle) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

    const texts = await generateThumbnailText(trendTitle);
    const variants = buildVariants(texts);

    await prisma.generationJob.create({
      data: { userId: user.id, type: 'thumb', status: 'ready', fileUrl: JSON.stringify(variants) },
    });

    return NextResponse.json({ variants });
  } catch (e) {
    console.error('[API] Generate error:', e);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
