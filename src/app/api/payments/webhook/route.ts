import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSignature = req.headers.get('x-razorpay-signature');

    if (!webhookSignature) {
      return NextResponse.json({ error: 'Missing Razorpay webhook signature header' }, { status: 400 });
    }

    const isValid = verifyWebhookSignature(rawBody, webhookSignature);

    if (!isValid) {
      console.warn('Unauthorized webhook signature mismatch');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payload?.payment?.entity;
      const notes = payment?.notes || {};
      const userId = notes.userId;
      const credits = Number(notes.credits || 500);
      const planId = notes.planId;
      const billingCycle = notes.billingCycle || 'monthly';
      const isYearly = billingCycle === 'yearly';

      if (userId) {
        const updateData: any = {
          credits: admin.firestore.FieldValue.increment(credits),
          updatedAt: Date.now(),
        };

        if (planId) {
          updateData.plan = planId;
          updateData.billingCycle = billingCycle;
          updateData.planExpiresAt = Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000;
        }

        await adminDb.collection('users').doc(userId).update(updateData);

        await adminDb.collection('transactions').add({
          userId,
          paymentId: payment.id,
          orderId: payment.order_id,
          amount: payment.amount,
          currency: payment.currency,
          event,
          creditsAdded: credits,
          planId: planId || null,
          billingCycle,
          source: 'razorpay_webhook',
          createdAt: Date.now(),
        });
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
