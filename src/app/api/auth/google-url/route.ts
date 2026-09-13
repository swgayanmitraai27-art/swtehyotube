import { NextRequest, NextResponse } from 'next/server';
import { getGoogleOAuthUrl } from '@/lib/youtube';
import { adminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid') || `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    let customId: string | undefined;
    let customSecret: string | undefined;

    if (uid && !uid.startsWith('user_')) {
      try {
        const personaDoc = await adminDb.collection('users').doc(uid).collection('settings').doc('persona').get();
        if (personaDoc.exists) {
          const settings = personaDoc.data() || {};
          if (settings.customClientId) customId = settings.customClientId;
          if (settings.customClientSecret) customSecret = settings.customClientSecret;
        }

        if (!customId) {
          const userDoc = await adminDb.collection('users').doc(uid).get();
          const settings = userDoc.data()?.settings || {};
          if (settings.customClientId) customId = settings.customClientId;
          if (settings.customClientSecret) customSecret = settings.customClientSecret;
        }
      } catch (docErr) {
        console.warn('Could not fetch custom client settings for OAuth:', docErr);
      }
    }

    const authUrl = getGoogleOAuthUrl(uid, customId, customSecret);
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Failed to generate OAuth URL:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
