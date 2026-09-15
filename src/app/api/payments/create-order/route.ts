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

    let amount = 3900; // Default $39 in cents
    let description = '⚡ Starter Scale ($39/Month)';
    let creditsToAdd = 3000;
    let purchaseType = 'subscription';

    if (planId) {
      const plan = INDIAN_TIER_PLANS.find((p) => p.id === planId);
      if (plan) {
        const isYearly = billingCycle === 'yearly';
        const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
        amount = price * 100; // Amount in cents ($39 = 3900, $49 = 4900)
        creditsToAdd = isYearly ? plan.yearlyCredits : plan.monthlyCredits;
        description = `${plan.name} (${isYearly ? 'Yearly - 2 Months Free' : 'Monthly'}) - SW Tech Solution`;
        purchaseType = 'plan';
      }
    } else if (packId) {
      const pack = CREDIT_PACKS.find((p) => p.id === packId);
      if (pack) {
        amount = pack.price * 100;
        description = `${pack.name} - SW Tech Solution`;
        creditsToAdd = pack.credits;
        purchaseType = 'credits';
      }
    }

    const options = {
      amount,
      currency: 'USD',
      receipt: `rcpt_${uid.substring(0, 8)}_${Date.now()}`,
      notes: {
        userId: uid,
        planId: planId || '',
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
