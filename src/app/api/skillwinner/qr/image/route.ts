import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qrId = searchParams.get('id') || searchParams.get('qrId');
  const isDownload = searchParams.get('download') === '1' || searchParams.get('dl') === '1';

  if (!qrId) {
    return new NextResponse('Missing QR ID', { status: 400 });
  }

  try {
    // 1. Fetch direct binary image from Razorpay's QR endpoint
    const rzpImgRes = await fetch(`https://api.razorpay.com/v1/l/qrcode/${qrId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
    });

    if (!rzpImgRes.ok) {
      return new NextResponse('QR Image Not Found on Razorpay', { status: 404 });
    }

    const imageBuffer = await rzpImgRes.arrayBuffer();
    const contentType = rzpImgRes.headers.get('content-type') || 'image/png';

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (isDownload) {
      headers['Content-Disposition'] = 'attachment; filename="Swgayanbhumi_Razorpay_QR.png"';
    }

    return new NextResponse(Buffer.from(imageBuffer), {
      status: 200,
      headers: headers,
    });
  } catch (error: any) {
    console.error('Error streaming Razorpay QR image:', error);
    return new NextResponse('Failed to load QR image: ' + (error?.message || ''), { status: 500 });
  }
}
