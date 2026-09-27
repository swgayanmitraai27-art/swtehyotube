import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { adminDb } from '@/lib/firebase-admin';
import { INDIAN_TIER_PLANS, CREDIT_PACKS } from '@/lib/constants';
import * as admin from 'firebase-admin';

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
    const uid = body.uid || body.userId || body.user_id || body.id;
    const orderId = body.orderId || body.order_id || body.razorpay_order_id;
    const paymentId = body.paymentId || body.payment_id || body.razorpay_payment_id;
    const signature = body.signature || body.razorpay_signature;
    const { planId, billingCycle = 'monthly', packId } = body;
    const directAmount = Number(body.amount || body.price || 0);
    const bonusCoins = Number(body.bonusCoins || body.bonus || Math.round(directAmount * 0.5));

    if (!uid || !orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing verification parameters (uid, orderId, paymentId, signature)' },
        { status: 400, headers: corsHeaders }
      );
    }

    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400, headers: corsHeaders }
      );
    }

    let creditsToAdd = 500;
    let newPlan: any = 'starter';
    const isYearly = billingCycle === 'yearly';

    if (directAmount > 0) {
      // Wallet Deposit for Gaming / Esports App (Booyah Rewards / SkillWinner)
      creditsToAdd = directAmount;
      newPlan = undefined;

      if (adminDb) {
        try {
          const userRef = adminDb.collection('skillwinner_users').doc(String(uid));
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const data = userDoc.data() || {};
            const currentReal = Number(data.real_balance || 0);
            const currentBonus = Number(data.bonus_balance || 0);

            await userRef.update({
              real_balance: currentReal + directAmount,
              bonus_balance: currentBonus + bonusCoins,
              updated_at: new Date().toISOString(),
            });
          } else {
            await userRef.set({
              userId: String(uid),
              real_balance: directAmount,
              bonus_balance: bonusCoins,
              total_matches_played: 0,
              total_winnings: 0,
              created_at: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.error('Skillwinner Firestore update error:', e);
        }
      }
    } else if (planId) {
      const plan = INDIAN_TIER_PLANS.find((p) => p.id === planId);
      if (plan) {
        creditsToAdd = isYearly ? plan.yearlyCredits : plan.monthlyCredits;
        newPlan = plan.id;
      }
    } else if (packId) {
      const pack = CREDIT_PACKS.find((p) => p.id === packId);
      if (pack) {
        creditsToAdd = pack.credits;
        newPlan = undefined;
      }
    }

    // Record Transaction
    if (adminDb) {
      try {
        await adminDb.collection('transactions').add({
          userId: String(uid),
          orderId,
          paymentId,
          creditsAdded: creditsToAdd,
          amount: directAmount,
          bonusCoins,
          planId: planId || null,
          billingCycle: billingCycle || 'monthly',
          packId: packId || null,
          status: 'success',
          createdAt: Date.now(),
        });
      } catch (e) {
        console.error('Transaction logging error:', e);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified and wallet credited successfully! 🎉',
        creditsAdded: creditsToAdd,
        addedReal: directAmount,
        addedBonus: bonusCoins,
        totalAdded: directAmount + bonusCoins,
        plan: newPlan,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
