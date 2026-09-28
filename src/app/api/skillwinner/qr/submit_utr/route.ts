import { NextRequest, NextResponse } from 'next/server';
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
    const userId = body.userId || body.uid || 'guest_user';
    const amount = Number(body.amount || 0);
    const utr = String(body.utr || body.referenceId || body.txnId || '').trim();

    if (!utr || utr.length < 6) {
      return NextResponse.json(
        { error: 'Please enter a valid 12-digit UPI UTR / Reference Number.' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (isNaN(amount) || amount < 10) {
      return NextResponse.json(
        { error: 'Valid amount is required (Min ₹10).' },
        { status: 400, headers: corsHeaders }
      );
    }

    const extraBonus = Number((amount * 0.10).toFixed(2));
    const totalDepositCash = Number((amount + extraBonus).toFixed(2));

    if (adminDb) {
      // Check duplicate UTR
      const existingTxn = await adminDb
        .collection('skillwinner_transactions')
        .where('utr', '==', utr)
        .limit(1)
        .get();

      if (!existingTxn.empty) {
        return NextResponse.json(
          { error: 'This UTR / Reference Number has already been submitted.' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Credit User
      const userRef = adminDb.collection('skillwinner_users').doc(String(userId));
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const data = userDoc.data() || {};
        const currentReal = Number(data.wallet?.depositCash || data.depositCash || data.real_balance || 0);
        const currentAdCoins = Number(data.wallet?.adCoins || data.adCoins || 0);
        const newDeposit = Number((currentReal + totalDepositCash).toFixed(2));

        await userRef.set(
          {
            real_balance: newDeposit,
            depositCash: newDeposit,
            wallet: {
              ...data.wallet,
              depositCash: newDeposit,
              adCoins: currentAdCoins,
            },
            updated_at: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // Record transaction
      await adminDb.collection('skillwinner_transactions').add({
        id: `txn_${Date.now()}`,
        userId: String(userId),
        userName: 'Gamer',
        type: 'deposit',
        walletAffected: 'depositCash',
        amount: amount,
        real_amount: amount,
        bonus_amount: extraBonus,
        credited_amount: totalDepositCash,
        currency: 'INR',
        utr: utr,
        razorpay_payment_id: `UTR_${utr}`,
        status: 'SUCCESS',
        description: `UPI QR Deposit: Added ₹${amount} (+10% Bonus = ₹${totalDepositCash}) to Deposit Cash [UTR: ${utr}]`,
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Deposit verified and 10% Extra Cash credited successfully!',
        amount,
        extraBonus,
        totalDepositCash,
        utr,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Submit UTR Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify UTR' },
      { status: 500, headers: corsHeaders }
    );
  }
}
