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

    // 1. Create official Razorpay QR Code via Razorpay QR API
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

    if (!rzpRes.ok || !rzpJson.id) {
      console.error('Razorpay QR API Error:', rzpJson);
      return NextResponse.json(
        { error: rzpJson.error?.description || 'Failed to create Razorpay QR Code' },
        { status: 500, headers: corsHeaders }
      );
    }

    // 2. Fetch the official binary QR image directly from Razorpay
    let imageBase64 = '';
    try {
      const imgRes = await fetch(`https://api.razorpay.com/v1/l/qrcode/${rzpJson.id}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });
      if (imgRes.ok) {
        const arrayBuffer = await imgRes.arrayBuffer();
        imageBase64 = Buffer.from(arrayBuffer).toString('base64');
      }
    } catch (imgErr) {
      console.error('Error downloading Razorpay QR Image:', imgErr);
    }

    // Save pending QR session in Firestore
    if (adminDb) {
      try {
        await adminDb.collection('skillwinner_pending_qr').doc(rzpJson.id).set({
          qrId: rzpJson.id,
          userId: String(userId),
          amount: amount,
          extraBonus: extraBonus,
          totalDepositCash: totalDepositCash,
          status: 'PENDING',
          paymentUrl: rzpJson.image_url,
          createdAt: new Date().toISOString(),
        });
      } catch (_) {}
    }

    return NextResponse.json(
      {
        success: true,
        qrId: rzpJson.id,
        imageBase64: imageBase64,
        paymentUrl: rzpJson.image_url,
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
