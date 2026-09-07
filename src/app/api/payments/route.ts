import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';
import { createPayment } from '@/lib/services/payment';

const PLANS: Record<string, { amount: number; term: string }> = {
  'pro-1m': { amount: 70000, term: '1month' },
  'pro-6m': { amount: 180000, term: '6months' },
  'pro-1y': { amount: 700000, term: '1year' },
};

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('yt-session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { planId } = await req.json();
    const plan = PLANS[planId];
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const payment = await createPayment(plan.amount, plan.term, payload.userId);
    if (!payment) {
      return NextResponse.json({ testMode: true, redirectUrl: `/payments/success?test=1&term=${plan.term}` });
    }

    await prisma.payment.create({
      data: { userId: payload.userId, yookassaId: payment.id, term: plan.term, amount: plan.amount, status: 'pending' },
    });

    return NextResponse.json({ testMode: false, redirectUrl: payment.confirmation_url, paymentId: payment.id });
  } catch (e) {
    console.error('[API] Payment error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
