import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, isPro } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

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

    const { title } = await req.json();
    const job = await prisma.generationJob.create({
      data: { userId: user.id, type: 'video', status: 'ready', fileUrl: '/dummy-video.mp4' },
    });

    return NextResponse.json({ job });
  } catch (e) {
    console.error('[API] Queue create error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
