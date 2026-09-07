import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, isPro } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('yt-session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, plan: true, proExpiresAt: true, createdAt: true },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      user: { ...user, proActive: isPro(user.plan, user.proExpiresAt) },
      payments,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
