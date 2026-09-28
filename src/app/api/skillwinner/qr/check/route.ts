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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const qrId = searchParams.get('qrId') || searchParams.get('qr_id') || searchParams.get('id');
    const userId = searchParams.get('userId') || searchParams.get('uid');

    if (!qrId) {
      return NextResponse.json({ error: 'qrId is required' }, { status: 400, headers: corsHeaders });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TakGRfnTFl20dG';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'zQhvUiuH7ZESonqwqXFMk8Ge';
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    // 1. If it's a Razorpay QR Code, check payments against this QR Code
    if (qrId.startsWith('qr_')) {
      try {
        const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/qr_codes/${qrId}/payments`, {
          method: 'GET',
          headers: { 'Authorization': authHeader },
        });
        const rzpData = await rzpRes.json();

        if (rzpRes.ok && rzpData.items && rzpData.items.length > 0) {
          const successfulPayment = rzpData.items.find(
            (item: any) => item.status === 'captured' || item.status === 'authorized'
          );

          if (successfulPayment) {
            const amountInRupees = successfulPayment.amount / 100;
            const extraBonus = Number((amountInRupees * 0.10).toFixed(2));
            const totalDepositCash = Number((amountInRupees + extraBonus).toFixed(2));
            const targetUserId = String(userId || successfulPayment.notes?.userId || 'guest_user');

            // Credit in Firestore
            if (adminDb) {
              const userRef = adminDb.collection('skillwinner_users').doc(targetUserId);
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

              // Record Transaction
              await adminDb.collection('skillwinner_transactions').add({
                id: `txn_${Date.now()}`,
                userId: targetUserId,
                userName: 'Gamer',
                type: 'deposit',
                walletAffected: 'depositCash',
                amount: amountInRupees,
                real_amount: amountInRupees,
                bonus_amount: extraBonus,
                credited_amount: totalDepositCash,
                currency: 'INR',
                razorpay_payment_id: successfulPayment.id,
                qr_id: qrId,
                status: 'SUCCESS',
                description: `QR Payment: Added ₹${amountInRupees} (+10% Bonus = ₹${totalDepositCash}) to Deposit Cash`,
                createdAt: new Date().toISOString(),
                created_at: new Date().toISOString(),
              });

              // Mark pending QR as SUCCESS
              await adminDb.collection('skillwinner_pending_qr').doc(qrId).set(
                { status: 'SUCCESS', paymentId: successfulPayment.id, updated_at: new Date().toISOString() },
                { merge: true }
              );
            }

            return NextResponse.json(
              {
                success: true,
                paid: true,
                status: 'SUCCESS',
                amount: amountInRupees,
                extraBonus,
                totalDepositCash,
                paymentId: successfulPayment.id,
              },
              { headers: corsHeaders }
            );
          }
        }
      } catch (err) {
        console.error('Check QR payments error:', err);
      }
    }

    // 2. Check pending QR in Firestore
    if (adminDb) {
      const qrDoc = await adminDb.collection('skillwinner_pending_qr').doc(qrId).get();
      if (qrDoc.exists) {
        const qrInfo = qrDoc.data() || {};
        if (qrInfo.status === 'SUCCESS') {
          return NextResponse.json(
            {
              success: true,
              paid: true,
              status: 'SUCCESS',
              amount: qrInfo.amount,
              extraBonus: qrInfo.extraBonus,
              totalDepositCash: qrInfo.totalDepositCash,
              paymentId: qrInfo.paymentId || 'QR_VERIFIED',
            },
            { headers: corsHeaders }
          );
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        paid: false,
        status: 'PENDING',
        message: 'Waiting for QR payment...',
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error checking QR status' }, { status: 500, headers: corsHeaders });
  }
}
