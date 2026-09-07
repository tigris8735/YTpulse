import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentId = body.object?.id;
    const status = body.object?.status;

    if (!paymentId) return NextResponse.json({ error: 'No payment id' }, { status: 400 });

    const payment = await prisma.payment.findUnique({ where: { yookassaId: paymentId } });
    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: status === 'succeeded' ? 'succeeded' : status, rawWebhook: body },
    });

    if (status === 'succeeded') {
      const now = new Date();
      let expires = new Date(now);
      switch (payment.term) {
        case '1month': expires.setMonth(expires.getMonth() + 1); break;
        case '6months': expires.setMonth(expires.getMonth() + 6); break;
        case '1year': expires.setFullYear(expires.getFullYear() + 1); break;
      }
      await prisma.user.update({
        where: { id: payment.userId },
        data: { plan: 'pro', proExpiresAt: expires },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[API] Webhook error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
