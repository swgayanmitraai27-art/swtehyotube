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
    const amount = Number(body.amount || 50);

    if (isNaN(amount) || amount < 10) {
      return NextResponse.json(
        { error: 'Valid amount is required (Min ₹10)' },
        { status: 400, headers: corsHeaders }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TakGRfnTFl20dG';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'zQhvUiuH7ZESonqwqXFMk8Ge';
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const amountInPaise = Math.round(amount * 100);
    const extraBonus = Number((amount * 0.10).toFixed(2));
    const totalDepositCash = Number((amount + extraBonus).toFixed(2));

    // Standard High-Performance UPI Intent for Direct GPay/PhonePe/Paytm/BHIM Scanning (No website redirects)
    const merchantVpa = 'samashermaurya9935@okaxis';
    const userShort = String(userId).replace(/[^a-zA-Z0-9]/g, '').substring(0, 6) || 'gamer';
    const upiTxnNote = `SW_DEP_${userShort}_${Date.now().toString().slice(-4)}`;
    const directUpiIntent = `upi://pay?pa=${merchantVpa}&pn=SkillWinner&am=${amount}&cu=INR&tn=${upiTxnNote}`;

    // 1. Attempt to create official Razorpay UPI QR Code / Order
    let rzpQrId: string | null = null;
    let rzpWebUrl = `https://www.swgayanbhumi.in/pay?app=skillwinner&userId=${encodeURIComponent(userId)}&amount=${amount}&auto=1`;

    try {
      const rzpRes = await fetch('https://api.razorpay.com/v1/payments/qr_codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({
          type: 'upi_qr',
          name: 'SkillWinner Esports',
          usage: 'single_use',
          fixed_amount: true,
          payment_amount: amountInPaise,
          description: `Add ₹${amount} (+10% Bonus = ₹${totalDepositCash})`,
          notes: {
            userId: String(userId),
            amount: String(amount),
            extraBonus: String(extraBonus),
            totalDepositCash: String(totalDepositCash),
            appName: 'SkillWinner / Booyah Rewards',
          },
        }),
      });

      const rzpJson = await rzpRes.json();
      if (rzpRes.ok && rzpJson.id) {
        rzpQrId = rzpJson.id;
        if (rzpJson.image_url) {
          rzpWebUrl = rzpJson.image_url;
        }
      }
    } catch (rzpErr) {
      console.warn('Razorpay QR API optional call:', rzpErr);
    }

    const activeQrId = rzpQrId || `qr_upi_${Date.now()}`;
    const directQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(directUpiIntent)}`;

    // Save pending QR session in Firestore
    if (adminDb) {
      try {
        await adminDb.collection('skillwinner_pending_qr').doc(activeQrId).set({
          qrId: activeQrId,
          userId: String(userId),
          amount: amount,
          extraBonus: extraBonus,
          totalDepositCash: totalDepositCash,
          status: 'PENDING',
          upiIntent: directUpiIntent,
          paymentUrl: rzpWebUrl,
          imageUrl: directQrImageUrl,
          createdAt: new Date().toISOString(),
        });
      } catch (_) {}
    }

    return NextResponse.json(
      {
        success: true,
        qrId: activeQrId,
        upiString: directUpiIntent,
        upiIntent: directUpiIntent,
        upiId: merchantVpa,
        qrImageUrl: directQrImageUrl,
        imageUrl: directQrImageUrl,
        paymentUrl: rzpWebUrl,
        amount: amount,
        extraBonus: extraBonus,
        totalDepositCash: totalDepositCash,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('QR Code Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate QR Code' },
      { status: 500, headers: corsHeaders }
    );
  }
}
