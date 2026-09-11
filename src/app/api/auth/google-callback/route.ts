import { NextRequest, NextResponse } from 'next/server';
import { getOAuth2Client, fetchChannelInfo } from '@/lib/youtube';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const uid = searchParams.get('state'); // UID passed during OAuth start

    if (!code || !uid) {
      return NextResponse.redirect(new URL('/dashboard?error=missing_code_or_uid', req.url));
    }

    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url));
    }

    // 1. Store tokens securely in user's subcollection
    const tokenData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || '',
      expiryDate: tokens.expiry_date || Date.now() + 3600 * 1000,
      scope: tokens.scope || '',
      tokenType: tokens.token_type || 'Bearer',
      updatedAt: Date.now(),
    };

    await adminDb.collection('users').doc(uid).collection('tokens').doc('youtube').set(tokenData, { merge: true });

    // 2. Fetch Channel Info directly
    try {
      const channelInfo = await fetchChannelInfo(uid);

      // 3. Update main User profile with channel details
      await adminDb.collection('users').doc(uid).set(
        {
          channelId: channelInfo.id,
          channelTitle: channelInfo.title,
          channelThumbnail: channelInfo.thumbnailUrl,
          subscriberCount: channelInfo.subscriberCount,
          videoCount: channelInfo.videoCount,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    } catch (channelErr) {
      console.warn('Could not fetch channel details immediately:', channelErr);
    }

    // Redirect user back to dashboard with success message
    return NextResponse.redirect(new URL('/dashboard?connected=true', req.url));
  } catch (error: any) {
    console.error('OAuth Callback Processing Error:', error);
    return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(error.message || 'unknown')}`, req.url));
  }
}
