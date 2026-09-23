import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, name = 'Gamer', phone = '', email = '' } = body;

    const numAmount = Number(amount);
    if (!userId || isNaN(numAmount) || numAmount < 10) {
      return NextResponse.json(
        { error: 'Valid userId and minimum amount of ₹10 is required' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(numAmount * 100);
    const bonusCoins = Math.round(numAmount * 0.5); // 50% Welcome / Deposit Bonus

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `skw_${userId.substring(0, 6)}_${Date.now()}`,
      notes: {
        appName: 'SkillWinner',
        appSource: 'skillwinner_esports',
        userId,
        realAmount: String(numAmount),
        bonusCoins: String(bonusCoins),
        totalCredits: String(numAmount + bonusCoins),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      name: 'SkillWinner Esports',
      description: `Add ₹${numAmount} Real Cash (+₹${bonusCoins} Bonus Free)`,
      bonusCoins,
      realAmount: numAmount,
    });
  } catch (error: any) {
    console.error('SkillWinner Razorpay Order Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create SkillWinner payment order' },
      { status: 500 }
    );
  }
}
