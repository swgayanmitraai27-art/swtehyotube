import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { INDIAN_TIER_PLANS, CREDIT_PACKS } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, planId, billingCycle = 'monthly', packId } = body;

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    let amount = 49900; // Default ₹499 in paise (49900 paise)
    let description = '🟢 Starter Plan (₹499/Month) - SW Tech Solution';
    let creditsToAdd = 1500;
    let purchaseType = 'subscription';

    if (planId) {
      // Find plan by id or legacy alias
      let plan = INDIAN_TIER_PLANS.find((p) => p.id === planId);
      if (!plan) {
        if (planId === 'standard') plan = INDIAN_TIER_PLANS.find((p) => p.id === 'starter');
        if (planId === 'premium') plan = INDIAN_TIER_PLANS.find((p) => p.id === 'growth');
        if (planId === 'enterprise') plan = INDIAN_TIER_PLANS.find((p) => p.id === 'pro');
      }

      if (plan) {
        const isYearly = billingCycle === 'yearly';
        const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
        amount = price * 100; // Amount in paise (₹499 = 49900, ₹999 = 99900, ₹1999 = 199900)
        creditsToAdd = isYearly ? plan.yearlyCredits : plan.monthlyCredits;
        description = `${plan.name} (${isYearly ? 'Yearly - ₹' + price : '₹' + price + '/mo'}) - Instant UPI & Cards`;
        purchaseType = 'plan';
      }
    } else if (packId) {
      const pack = CREDIT_PACKS.find((p) => p.id === packId);
      if (pack) {
        amount = pack.price * 100; // Amount in paise
        description = `${pack.name} (₹${pack.price}) - SW Tech Solution`;
        creditsToAdd = pack.credits;
        purchaseType = 'credits';
      }
    }

    const options = {
      amount,
      currency: 'INR',
      receipt: `rcpt_${uid.substring(0, 8)}_${Date.now()}`,
      notes: {
        userId: uid,
        planId: planId || 'growth',
        billingCycle: billingCycle || 'monthly',
        packId: packId || '',
        credits: String(creditsToAdd),
        purchaseType,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      description,
      creditsToAdd,
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
