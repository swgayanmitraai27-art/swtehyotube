import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { adminDb } from '@/lib/firebase-admin';
import { INDIAN_TIER_PLANS, CREDIT_PACKS } from '@/lib/constants';
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, orderId, paymentId, signature, planId, billingCycle = 'monthly', packId } = body;

    if (!uid || !orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing verification parameters' }, { status: 400 });
    }

    const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    let creditsToAdd = 500;
    let newPlan: any = 'starter';
    const isYearly = billingCycle === 'yearly';

    if (planId) {
      const plan = INDIAN_TIER_PLANS.find((p) => p.id === planId);
      if (plan) {
        creditsToAdd = isYearly ? plan.yearlyCredits : plan.monthlyCredits;
        newPlan = plan.id;
      }
    } else if (packId) {
      const pack = CREDIT_PACKS.find((p) => p.id === packId);
      if (pack) {
        creditsToAdd = pack.credits;
        newPlan = undefined; // Just add credits
      }
    }

    // 1. Update user profile
    const updateData: any = {
      credits: admin.firestore.FieldValue.increment(creditsToAdd),
      updatedAt: Date.now(),
    };

    if (newPlan) {
      updateData.plan = newPlan;
      updateData.billingCycle = billingCycle;
      updateData.planExpiresAt = Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000;
    }

    await adminDb.collection('users').doc(uid).update(updateData);

    // 2. Record Transaction
    await adminDb.collection('transactions').add({
      userId: uid,
      orderId,
      paymentId,
      creditsAdded: creditsToAdd,
      planId: planId || null,
      billingCycle: billingCycle || 'monthly',
      packId: packId || null,
      status: 'success',
      createdAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and credits added successfully! 🎉',
      creditsAdded: creditsToAdd,
      plan: newPlan,
    });
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
