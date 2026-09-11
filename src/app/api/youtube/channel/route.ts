import { NextRequest, NextResponse } from 'next/server';
import { fetchChannelInfo, fetchRecentVideos } from '@/lib/youtube';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    const channelInfo = await fetchChannelInfo(uid);
    const recentVideos = await fetchRecentVideos(uid, 6);

    // Update Firestore with latest metrics
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

    return NextResponse.json({
      success: true,
      channel: channelInfo,
      videos: recentVideos,
    });
  } catch (error: any) {
    console.error('Fetch Channel Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch channel info' },
      { status: 500 }
    );
  }
}
