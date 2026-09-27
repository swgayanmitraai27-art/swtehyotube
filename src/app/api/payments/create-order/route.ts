import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { INDIAN_TIER_PLANS, CREDIT_PACKS } from '@/lib/constants';

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
    const uid = body.uid || body.userId || body.user_id || body.id || 'guest_user';
    const { planId, billingCycle = 'monthly', packId } = body;
    const directAmount = Number(body.amount || body.price || 0);

    let amount = 49900; // Default ₹499 in paise
    let description = '🟢 Starter Plan (₹499/Month) - SW Tech Solution';
    let creditsToAdd = 1200;
    let purchaseType = 'subscription';
    let bonusCoins = 0;

    if (directAmount > 0) {
      // Direct custom amount from Esports / Gaming App / Wallet Deposit
      amount = Math.round(directAmount * 100);
      bonusCoins = Math.round(directAmount * 0.5); // 50% Bonus
      description = `Wallet Deposit ₹${directAmount} (+₹${bonusCoins} Bonus) - SW Tech`;
      creditsToAdd = directAmount;
      purchaseType = 'wallet_deposit';
    } else if (planId) {
      let plan = INDIAN_TIER_PLANS.find((p) => p.id === planId);
      if (!plan) {
        if (planId === 'standard') plan = INDIAN_TIER_PLANS.find((p) => p.id === 'starter');
        if (planId === 'premium') plan = INDIAN_TIER_PLANS.find((p) => p.id === 'growth');
        if (planId === 'enterprise') plan = INDIAN_TIER_PLANS.find((p) => p.id === 'pro');
      }

      if (plan) {
        const isYearly = billingCycle === 'yearly';
        const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
        amount = price * 100;
        creditsToAdd = isYearly ? plan.yearlyCredits : plan.monthlyCredits;
        description = `${plan.name} (${isYearly ? 'Yearly - ₹' + price : '₹' + price + '/mo'}) - Instant UPI & Cards`;
        purchaseType = 'plan';
      }
    } else if (packId) {
      const pack = CREDIT_PACKS.find((p) => p.id === packId);
      if (pack) {
        amount = pack.price * 100;
        description = `${pack.name} (₹${pack.price}) - SW Tech Solution`;
        creditsToAdd = pack.credits;
        purchaseType = 'credits';
      }
    }

    const options = {
      amount,
      currency: 'INR',
      receipt: `rcpt_${String(uid).substring(0, 8)}_${Date.now()}`,
      notes: {
        userId: String(uid),
        planId: planId || '',
        billingCycle: billingCycle || 'monthly',
        packId: packId || '',
        credits: String(creditsToAdd),
        bonusCoins: String(bonusCoins),
        purchaseType,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        order_id: order.id,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TakGRfnTFl20dG',
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TakGRfnTFl20dG',
        description,
        bonusCoins,
        realAmount: directAmount > 0 ? directAmount : amount / 100,
        creditsToAdd,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500, headers: corsHeaders }
    );
  }
}
