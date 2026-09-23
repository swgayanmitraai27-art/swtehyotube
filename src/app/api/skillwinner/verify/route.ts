import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
      bonusCoins,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return NextResponse.json(
        { error: 'Missing required payment verification details' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature verification failed' },
        { status: 400 }
      );
    }

    const addedReal = Number(amount) || 0;
    const addedBonus = Number(bonusCoins) || Math.round(addedReal * 0.5);

    // Update or credit user in Firebase Firestore
    if (db) {
      const userRef = db.collection('skillwinner_users').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const data = userDoc.data() || {};
        const currentReal = Number(data.real_balance || 0);
        const currentBonus = Number(data.bonus_balance || 0);

        await userRef.update({
          real_balance: currentReal + addedReal,
          bonus_balance: currentBonus + addedBonus,
          updated_at: new Date().toISOString(),
        });
      } else {
        await userRef.set({
          userId,
          real_balance: addedReal,
          bonus_balance: addedBonus,
          total_matches_played: 0,
          total_winnings: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Log transaction
      await db.collection('skillwinner_transactions').add({
        userId,
        type: 'DEPOSIT',
        real_amount: addedReal,
        bonus_amount: addedBonus,
        razorpay_payment_id,
        razorpay_order_id,
        status: 'SUCCESS',
        description: `Added ₹${addedReal} cash (+₹${addedBonus} bonus)`,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and wallet credited successfully',
      addedReal,
      addedBonus,
      totalAdded: addedReal + addedBonus,
    });
  } catch (error: any) {
    console.error('SkillWinner Payment Verification Error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
