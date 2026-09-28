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

    // 1. Attempt to create official Razorpay UPI QR Code via API
    let qrData: any = null;
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
      if (rzpRes.ok && (rzpJson.image_url || rzpJson.id)) {
        qrData = rzpJson;
      } else {
        console.warn('Razorpay QR Code API response:', rzpJson);
      }
    } catch (rzpErr) {
      console.error('Razorpay QR API call error:', rzpErr);
    }

    // 2. If Razorpay QR Code created successfully
    if (qrData && qrData.image_url) {
      if (adminDb) {
        try {
          await adminDb.collection('skillwinner_pending_qr').doc(qrData.id).set({
            qrId: qrData.id,
            userId: String(userId),
            amount: amount,
            extraBonus: extraBonus,
            totalDepositCash: totalDepositCash,
            status: 'PENDING',
            imageUrl: qrData.image_url,
            createdAt: new Date().toISOString(),
          });
        } catch (_) {}
      }

      return NextResponse.json(
        {
          success: true,
          qrId: qrData.id,
          imageUrl: qrData.image_url,
          image_url: qrData.image_url,
          amount: amount,
          extraBonus: extraBonus,
          totalDepositCash: totalDepositCash,
          upiString: qrData.payload || '',
        },
        { headers: corsHeaders }
      );
    }

    // 3. Fallback Dynamic UPI QR Code (Directly scannable by Google Pay, PhonePe, Paytm, BHIM)
    const merchantVpa = 'samashermaurya9935@okaxis';
    const upiIntent = `upi://pay?pa=${merchantVpa}&pn=SkillWinner&am=${amount}&cu=INR&tn=SkillWinner_Deposit_${String(userId).substring(0, 6)}`;
    const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiIntent)}`;

    const fallbackQrId = `qr_upi_${Date.now()}`;
    if (adminDb) {
      try {
        await adminDb.collection('skillwinner_pending_qr').doc(fallbackQrId).set({
          qrId: fallbackQrId,
          userId: String(userId),
          amount: amount,
          extraBonus: extraBonus,
          totalDepositCash: totalDepositCash,
          status: 'PENDING',
          imageUrl: fallbackQrUrl,
          upiIntent: upiIntent,
          createdAt: new Date().toISOString(),
        });
      } catch (_) {}
    }

    return NextResponse.json(
      {
        success: true,
        qrId: fallbackQrId,
        imageUrl: fallbackQrUrl,
        image_url: fallbackQrUrl,
        amount: amount,
        extraBonus: extraBonus,
        totalDepositCash: totalDepositCash,
        upiString: upiIntent,
        upiId: merchantVpa,
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
