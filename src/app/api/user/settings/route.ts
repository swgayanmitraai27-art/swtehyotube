import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { DEFAULT_CREATOR_PERSONA } from '@/lib/constants';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    const settingsDoc = await adminDb.collection('users').doc(uid).collection('settings').doc('persona').get();

    if (!settingsDoc.exists) {
      return NextResponse.json({
        success: true,
        settings: DEFAULT_CREATOR_PERSONA,
      });
    }

    return NextResponse.json({
      success: true,
      settings: settingsDoc.data(),
    });
  } catch (error: any) {
    console.error('Fetch Settings Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, settings, autoPilotEnabled } = body;

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    if (settings) {
      await adminDb
        .collection('users')
        .doc(uid)
        .collection('settings')
        .doc('persona')
        .set(settings, { merge: true });
    }

    if (typeof autoPilotEnabled === 'boolean') {
      await adminDb.collection('users').doc(uid).update({
        autoPilotEnabled,
        updatedAt: Date.now(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully! ⚙️',
    });
  } catch (error: any) {
    console.error('Save Settings Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 });
  }
}
