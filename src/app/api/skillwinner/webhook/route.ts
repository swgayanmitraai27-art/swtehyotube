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
      const totalDepositCash = Number((amountInRupees + extraBonus).toFixed(2));
      const userId = String(
        paymentEntity.notes?.userId ||
        qrEntity.notes?.userId ||
        'guest_user'
      );

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

        // Record Transaction
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
          razorpay_payment_id: paymentEntity.id || 'WEBHOOK_CREDIT',
          status: 'SUCCESS',
          description: `Webhook Confirmed: Added ₹${amountInRupees} (+10% Bonus = ₹${totalDepositCash}) to Deposit Cash`,
          createdAt: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
