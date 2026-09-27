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
          const currentReal = Number(data.real_balance || 0);
          const currentBonus = Number(data.bonus_balance || 0);

          await userRef.update({
            real_balance: currentReal + addedReal,
            bonus_balance: currentBonus + addedBonus,
            updated_at: new Date().toISOString(),
          });
        } else {
          await userRef.set({
            userId: String(userId),
            real_balance: addedReal,
            bonus_balance: addedBonus,
            total_matches_played: 0,
            total_winnings: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        // Log transaction
        await adminDb.collection('skillwinner_transactions').add({
          userId: String(userId),
          type: 'DEPOSIT',
          real_amount: addedReal,
          bonus_amount: addedBonus,
          razorpay_payment_id,
          razorpay_order_id,
          status: 'SUCCESS',
          description: `Added ₹${addedReal} cash (+₹${addedBonus} bonus)`,
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
