import { NextRequest, NextResponse } from 'next/server';
import { getGoogleOAuthUrl } from '@/lib/youtube';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid') || `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const authUrl = getGoogleOAuthUrl(uid);
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Failed to generate OAuth URL:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
