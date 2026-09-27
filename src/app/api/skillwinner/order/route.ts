import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

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
    const userId = body.userId || body.uid || body.user_id || body.id || 'guest_user';
    const amount = Number(body.amount || body.price || body.coins || 50);
    const name = body.name || body.userName || 'Gamer';
    const phone = body.phone || body.contact || '';
    const email = body.email || '';

    if (isNaN(amount) || amount < 10) {
      return NextResponse.json(
        { error: 'Valid amount is required (Min ₹10)' },
        { status: 400, headers: corsHeaders }
      );
    }

    const amountInPaise = Math.round(amount * 100);
    const bonusCash = Number((amount * 0.10).toFixed(2)); // 10% Extra Deposit Cash

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${String(userId).substring(0, 6)}_${Date.now()}`,
      notes: {
        appName: 'SkillWinner / BooyehReward',
        userId: String(userId),
        name: String(name),
        phone: String(phone),
        email: String(email),
        realAmount: String(amount),
        bonusCash: String(bonusCash),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        order_id: order.id, // Support snake_case for standard Razorpay SDK
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TakGRfnTFl20dG',
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TakGRfnTFl20dG',
        name: 'SkillWinner / SW Tech Solution',
        description: `Add ₹${amount} (+10% Bonus = ₹${Number((amount + bonusCash).toFixed(2))} Deposit Cash)`,
        bonusCash,
        realAmount: amount,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('SkillWinner Razorpay Order Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500, headers: corsHeaders }
    );
  }
}
