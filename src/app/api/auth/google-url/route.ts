import { NextRequest, NextResponse } from 'next/server';
import { getGoogleOAuthUrl } from '@/lib/youtube';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required for YouTube connection' }, { status: 400 });
    }

    const authUrl = getGoogleOAuthUrl(uid);
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Failed to generate OAuth URL:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
