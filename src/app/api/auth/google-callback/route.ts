import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getOAuth2Client, fetchChannelInfo } from '@/lib/youtube';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const stateUid = searchParams.get('state');

    if (!code) {
      return NextResponse.redirect(new URL('/dashboard?error=missing_oauth_code', req.url));
    }

    let customId: string | undefined;
    let customSecret: string | undefined;

    if (stateUid && !stateUid.startsWith('user_')) {
      try {
        const personaDoc = await adminDb.collection('users').doc(stateUid).collection('settings').doc('persona').get();
        if (personaDoc.exists) {
          const settings = personaDoc.data() || {};
          if (settings.customClientId) customId = settings.customClientId;
          if (settings.customClientSecret) customSecret = settings.customClientSecret;
        }

        if (!customId) {
          const userDoc = await adminDb.collection('users').doc(stateUid).get();
          const settings = userDoc.data()?.settings || {};
          if (settings.customClientId) customId = settings.customClientId;
          if (settings.customClientSecret) customSecret = settings.customClientSecret;
        }
      } catch (docErr) {
        console.warn('Could not fetch custom client settings in callback:', docErr);
      }
    }

    const oauth2Client = getOAuth2Client(customId, customSecret);
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', req.url));
    }

    // Set credentials on oauth client to query userinfo
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    
    let googleUser: any = {};
    try {
      const userInfoRes = await oauth2.userinfo.get();
      googleUser = userInfoRes.data || {};
    } catch (userErr) {
      console.warn('Could not fetch google userinfo:', userErr);
    }

    // Determine consistent user UID
    const targetUid =
      stateUid && !stateUid.startsWith('user_') && !stateUid.startsWith('anon_')
        ? stateUid
        : googleUser.id || stateUid || `user_${Date.now()}`;

    // Token Data for Firestore
    const tokenData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || '',
      expiryDate: tokens.expiry_date || Date.now() + 3600 * 1000,
      scope: tokens.scope || '',
      tokenType: tokens.token_type || 'Bearer',
      updatedAt: Date.now(),
    };

    // Store tokens in user's subcollection
    const userRef = adminDb.collection('users').doc(targetUid);
    await userRef.collection('tokens').doc('youtube').set(tokenData, { merge: true });

    // Provision or update user document
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      await userRef.set({
        uid: targetUid,
        email: googleUser.email || '',
        displayName: googleUser.name || 'Creator',
        photoURL: googleUser.picture || '',
        credits: 50,
        plan: 'free',
        autoPilotEnabled: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } else {
      await userRef.set(
        {
          email: googleUser.email || userSnap.data()?.email || '',
          displayName: googleUser.name || userSnap.data()?.displayName || 'Creator',
          photoURL: googleUser.picture || userSnap.data()?.photoURL || '',
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    }

    // Attempt fetching and updating channel details
    try {
      const channelInfo = await fetchChannelInfo(targetUid);
      await userRef.set(
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

    // Create Firebase Custom Token for immediate 1-click login on client
    let customToken = '';
    try {
      customToken = await adminAuth.createCustomToken(targetUid, {
        email: googleUser.email || undefined,
      });
    } catch (authErr) {
      console.warn('Could not generate Firebase custom token:', authErr);
    }

    const redirectUrl = new URL('/dashboard', req.url);
    redirectUrl.searchParams.set('connected', 'true');
    if (customToken) {
      redirectUrl.searchParams.set('auth_token', customToken);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('OAuth Callback Processing Error:', error);
    return NextResponse.redirect(
      new URL(`/dashboard?error=${encodeURIComponent(error.message || 'unknown')}`, req.url)
    );
  }
}
