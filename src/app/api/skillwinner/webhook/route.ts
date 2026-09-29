import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'zQhvUiuH7ZESonqwqXFMk8Ge';

    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.warn('Webhook signature mismatch warning');
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    if (eventType === 'payment.captured' || eventType === 'qr_code.credited') {
      const paymentEntity = payload.payment?.entity || {};
      const qrEntity = payload.qr_code?.entity || {};

      const amountInRupees = (paymentEntity.amount || qrEntity.payment_amount || 0) / 100;
      const extraBonus = Number((amountInRupees * 0.10).toFixed(2));
      const userId = String(
        paymentEntity.notes?.userId ||
        qrEntity.notes?.userId ||
        'guest_user'
      );

      if (adminDb && amountInRupees > 0) {
        const paymentId = paymentEntity.id || qrEntity.id || 'WEBHOOK_PAYMENT';
        const existingTxn = await adminDb
          .collection('skillwinner_transactions')
          .where('razorpay_payment_id', '==', paymentId)
          .limit(1)
          .get();

        if (!existingTxn.empty) {
          // Already processed, exit cleanly
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

        // Record Deposit Transaction
        await adminDb.collection('skillwinner_transactions').add({
          id: `txn_${Date.now()}`,
          userId: userId,
          userName: 'Gamer',
          type: 'deposit',
          walletAffected: 'depositCash',
          amount: amountInRupees,
          currency: 'INR',
          razorpay_payment_id: paymentEntity.id || 'WEBHOOK_CREDIT',
          status: 'SUCCESS',
          description: `Deposit: Added ₹${amountInRupees} Real Cash`,
          createdAt: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });

        // Record 10% Extra Bonus Transaction
        if (extraBonus > 0) {
          await adminDb.collection('skillwinner_transactions').add({
            id: `txn_bonus_${Date.now()}`,
            userId: userId,
            userName: 'Gamer',
            type: 'bonusCashback',
            walletAffected: 'bonusCash',
            amount: extraBonus,
            currency: 'INR',
            razorpay_payment_id: paymentEntity.id || 'WEBHOOK_CREDIT',
            status: 'SUCCESS',
            description: `🎁 10% Extra Deposit Cashback (+₹${extraBonus} Bonus Cash)`,
            createdAt: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
