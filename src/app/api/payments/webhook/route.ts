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

    if (event === 'payment.captured' || event === 'order.paid' || event === 'qr_code.credited') {
      const payment = payload.payload?.payment?.entity || {};
      const qrEntity = payload.payload?.qr_code?.entity || {};
      const notes = payment?.notes || qrEntity?.notes || {};
      const userId = String(notes.userId || notes.uid || '');

      const isSkillWinner = 
        event === 'qr_code.credited' ||
        String(notes.appName || '').toLowerCase().includes('skill') ||
        String(notes.appName || '').toLowerCase().includes('booyah') ||
        notes.totalDepositCash !== undefined ||
        notes.extraBonus !== undefined;

      // 1. SkillWinner / Booyah Rewards Gaming Wallet Crediting
      if (isSkillWinner && userId) {
        const rawAmount = payment.amount || qrEntity.payment_amount || 0;
        const amountInRupees = rawAmount > 0 ? rawAmount / 100 : Number(notes.amount || 0);
        const extraBonus = Number((amountInRupees * 0.10).toFixed(2));
        const totalDepositCash = Number((amountInRupees + extraBonus).toFixed(2));

        if (adminDb && amountInRupees > 0) {
          const userRef = adminDb.collection('skillwinner_users').doc(userId);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const data = userDoc.data() || {};
            const currentReal = Number(data.wallet?.depositCash || data.depositCash || data.real_balance || 0);
            const currentAdCoins = Number(data.wallet?.adCoins || data.adCoins || 0);
            const newDeposit = Number((currentReal + totalDepositCash).toFixed(2));

            await userRef.set(
              {
                real_balance: newDeposit,
                depositCash: newDeposit,
                wallet: {
                  ...data.wallet,
                  depositCash: newDeposit,
                  adCoins: currentAdCoins,
                },
                updated_at: new Date().toISOString(),
              },
              { merge: true }
            );
          }

          // Record SkillWinner Transaction
          await adminDb.collection('skillwinner_transactions').add({
            id: `txn_${Date.now()}`,
            userId: userId,
            userName: 'Gamer',
            type: 'deposit',
            walletAffected: 'depositCash',
            amount: amountInRupees,
            real_amount: amountInRupees,
            bonus_amount: extraBonus,
            credited_amount: totalDepositCash,
            currency: 'INR',
            razorpay_payment_id: payment.id || qrEntity.id || 'WEBHOOK_CREDIT',
            status: 'SUCCESS',
            description: `Webhook Verified: Added ₹${amountInRupees} (+10% Bonus = ₹${totalDepositCash}) to Deposit Cash`,
            createdAt: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });

          // Mark pending QR success if applicable
          if (qrEntity.id) {
            await adminDb.collection('skillwinner_pending_qr').doc(qrEntity.id).set(
              { status: 'SUCCESS', paymentId: payment.id || qrEntity.id, updated_at: new Date().toISOString() },
              { merge: true }
            );
          }
        }
      } 
      // 2. YouTube SaaS App Credits / Plan Upgrading
      else if (userId) {
        const credits = Number(notes.credits || 500);
        const planId = notes.planId;
        const billingCycle = notes.billingCycle || 'monthly';
        const isYearly = billingCycle === 'yearly';

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
