import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const razorpay_order_id =
      body.razorpay_order_id || body.orderId || body.order_id;
    const razorpay_payment_id =
      body.razorpay_payment_id || body.paymentId || body.payment_id;
    const razorpay_signature =
      body.razorpay_signature || body.signature;
    const userId =
      body.userId || body.uid || body.user_id || body.id || 'guest_user';
    const amount = Number(body.amount || body.price || body.coins || 0);
    const bonusCoins =
      Number(body.bonusCoins || body.bonus) || Math.round(amount * 0.5);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature' },
        { status: 400, headers: corsHeaders }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'zQhvUiuH7ZESonqwqXFMk8Ge';
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature verification failed' },
        { status: 400, headers: corsHeaders }
      );
    }

    const addedReal = amount;
    const addedBonus = bonusCoins;

    // Update or credit user in Firebase Firestore
    if (adminDb) {
      try {
        const userRef = adminDb.collection('skillwinner_users').doc(String(userId));
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const data = userDoc.data() || {};
          const currentReal = Number(data.wallet?.depositCash || data.depositCash || data.real_balance || 0);
          const currentBonus = Number(data.wallet?.adCoins || data.adCoins || data.bonus_balance || 0);
          const currentWinning = Number(data.wallet?.winningCash || data.winningCash || 0);
          const currentReward = Number(data.wallet?.rewardCoins || data.rewardCoins || 0);

          await userRef.set(
            {
              real_balance: currentReal + addedReal,
              bonus_balance: currentBonus + addedBonus,
              depositCash: currentReal + addedReal,
              adCoins: currentBonus + addedBonus,
              wallet: {
                depositCash: currentReal + addedReal,
                adCoins: currentBonus + addedBonus,
                winningCash: currentWinning,
                rewardCoins: currentReward,
              },
              updated_at: new Date().toISOString(),
            },
            { merge: true }
          );
        } else {
          await userRef.set({
            uid: String(userId),
            userId: String(userId),
            displayName: 'Gamer',
            real_balance: addedReal,
            bonus_balance: addedBonus,
            depositCash: addedReal,
            adCoins: addedBonus,
            wallet: {
              depositCash: addedReal,
              adCoins: addedBonus,
              winningCash: 0,
              rewardCoins: 0,
            },
            stats: {
              matchesPlayed: 0,
              matchesWon: 0,
              totalKills: 0,
              totalWinningsCash: 0,
              totalRewardCoinsWon: 0,
              totalCoinsEarned: addedBonus,
            },
            adTracker: {
              adsWatchedToday: 0,
              adsWatchedSinceLastCoin: 0,
              dailyLimitRemaining: 30,
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        // Log transaction
        await adminDb.collection('skillwinner_transactions').add({
          id: `txn_${Date.now()}`,
          userId: String(userId),
          userName: 'Gamer',
          type: 'deposit',
          walletAffected: 'depositCash',
          amount: addedReal,
          real_amount: addedReal,
          bonus_amount: addedBonus,
          currency: 'INR',
          balanceBefore: 0,
          balanceAfter: addedReal,
          razorpay_payment_id,
          razorpay_order_id,
          status: 'SUCCESS',
          description: `Added ₹${addedReal} cash (+₹${addedBonus} bonus)`,
          createdAt: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.error('Firestore Update Warning:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified and wallet credited successfully',
        addedReal,
        addedBonus,
        totalAdded: addedReal + addedBonus,
        userId,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('SkillWinner Payment Verification Error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
