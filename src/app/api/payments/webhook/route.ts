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
        const paymentId = payment.id || qrEntity.id || 'WEBHOOK_CREDIT';

        if (adminDb && amountInRupees > 0) {
          // Idempotency: prevent double credit
          const existingTxn = await adminDb
            .collection('skillwinner_transactions')
            .where('razorpay_payment_id', '==', paymentId)
            .limit(1)
            .get();

          if (!existingTxn.empty) {
            return NextResponse.json({ status: 'ok', message: 'Already processed' });
          }

          const userRef = adminDb.collection('skillwinner_users').doc(userId);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const data = userDoc.data() || {};
            const currentDeposit = Number(data.wallet?.depositCash ?? data.depositCash ?? data.real_balance ?? 0);
            const currentBonus = Number(data.wallet?.bonusCash ?? data.bonusCash ?? 0);
            const currentWinning = Number(data.wallet?.winningCash ?? data.winningCash ?? data.total_winnings ?? 0);
            const currentAdCoins = Number(data.wallet?.adCoins ?? data.adCoins ?? 0);
            const currentRewardCoins = Number(data.wallet?.rewardCoins ?? data.rewardCoins ?? 0);

            const newDeposit = Number((currentDeposit + amountInRupees).toFixed(2));
            const newBonus = Number((currentBonus + extraBonus).toFixed(2));

            await userRef.set(
              {
                real_balance: newDeposit,
                depositCash: newDeposit,
                bonusCash: newBonus,
                wallet: {
                  ...data.wallet,
                  depositCash: newDeposit,
                  bonusCash: newBonus,
                  winningCash: currentWinning,
                  adCoins: currentAdCoins,
                  rewardCoins: currentRewardCoins,
                },
                updated_at: new Date().toISOString(),
              },
              { merge: true }
            );
          }

          const nowIso = new Date().toISOString();

          // 1. Record Deposit Transaction
          await adminDb.collection('skillwinner_transactions').add({
            id: `txn_${Date.now()}`,
            userId: userId,
            userName: 'Gamer',
            type: 'deposit',
            walletAffected: 'depositCash',
            amount: amountInRupees,
            currency: 'INR',
            razorpay_payment_id: paymentId,
            status: 'SUCCESS',
            description: `Deposit: Added ₹${amountInRupees} Real Cash`,
            createdAt: nowIso,
            created_at: nowIso,
          });

          // 2. Record 10% Extra Bonus Transaction
          if (extraBonus > 0) {
            await adminDb.collection('skillwinner_transactions').add({
              id: `txn_bonus_${Date.now()}`,
              userId: userId,
              userName: 'Gamer',
              type: 'bonusCashback',
              walletAffected: 'bonusCash',
              amount: extraBonus,
              currency: 'INR',
              razorpay_payment_id: paymentId,
              status: 'SUCCESS',
              description: `🎁 10% Extra Deposit Cashback (+₹${extraBonus} Bonus Cash)`,
              createdAt: nowIso,
              created_at: nowIso,
            });
          }

          // Mark pending QR success if applicable
          if (qrEntity.id) {
            await adminDb.collection('skillwinner_pending_qr').doc(qrEntity.id).set(
              { status: 'SUCCESS', paymentId: paymentId, updated_at: nowIso },
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
