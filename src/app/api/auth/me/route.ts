import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, isPro } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('yt-session')?.value;
    if (!token) return NextResponse.json({ user: null });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ user: null });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, plan: true, proExpiresAt: true, createdAt: true },
    });

    if (!user) return NextResponse.json({ user: null });
    return NextResponse.json({ user: { ...user, proActive: isPro(user.plan, user.proExpiresAt) } });
  } catch {
    return NextResponse.json({ user: null });
  }
}
