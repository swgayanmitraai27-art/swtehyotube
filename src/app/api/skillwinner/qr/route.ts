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
    const amount = Number(body.amount || 20);

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

    // 1. Create official Razorpay UPI QR Code via API
    let rzpQrId: string | null = null;
    let rzpWebUrl: string | null = null;

    try {
      const rzpRes = await fetch('https://api.razorpay.com/v1/payments/qr_codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({
          type: 'upi_qr',
          name: 'Swgayanbhumi',
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
        rzpWebUrl = rzpJson.image_url;
      } else {
        console.warn('Razorpay QR API response warning:', rzpJson);
      }
    } catch (rzpErr) {
      console.error('Razorpay QR API call error:', rzpErr);
    }

    const activeQrId = rzpQrId || `qr_upi_${Date.now()}`;
    const rzpVpa = 'swgayanbhumi490795.rzp@rxairtel';
    const directUpiString = `upi://pay?pa=${rzpVpa}&pn=Swgayanbhumi&tr=${activeQrId}&am=${amount.toFixed(2)}&cu=INR&tn=Swgayanbhumi_Deposit`;
    const directQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(directUpiString)}`;
    const finalWebUrl = rzpWebUrl || `https://www.swgayanbhumi.in/pay?app=skillwinner&userId=${encodeURIComponent(userId)}&amount=${amount}&auto=1`;

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
          upiString: directUpiString,
          vpa: rzpVpa,
          paymentUrl: finalWebUrl,
          imageUrl: directQrImageUrl,
          createdAt: new Date().toISOString(),
        });
      } catch (_) {}
    }

    return NextResponse.json(
      {
        success: true,
        qrId: activeQrId,
        upi_string: directUpiString,
        upiString: directUpiString,
        vpa: rzpVpa,
        qrImageUrl: directQrImageUrl,
        imageUrl: directQrImageUrl,
        paymentUrl: finalWebUrl,
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
