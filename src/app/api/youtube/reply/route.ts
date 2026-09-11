import { NextRequest, NextResponse } from 'next/server';
import { postYouTubeReply } from '@/lib/youtube';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, commentId, replyText, videoId, authorName, originalComment, toneUsed } = body;

    if (!uid || !commentId || !replyText) {
      return NextResponse.json(
        { error: 'Missing required parameters: uid, commentId, replyText' },
        { status: 400 }
      );
    }

    // 1. Check user credits in Firestore
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data() || {};
    const currentCredits = userData.credits ?? 0;

    if (currentCredits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please upgrade your plan or top up credits.' },
        { status: 402 }
      );
    }

    // 2. Post reply directly to YouTube API
    const replyResult = await postYouTubeReply(uid, commentId, replyText);

    if (!replyResult.success) {
      return NextResponse.json(
        { error: replyResult.error || 'Failed to post reply on YouTube' },
        { status: 500 }
      );
    }

    // 3. Atomically deduct 1 credit and log the reply
    await userRef.update({
      credits: admin.firestore.FieldValue.increment(-1),
      updatedAt: Date.now(),
    });

    const replyLog = {
      commentId,
      videoId: videoId || '',
      authorName: authorName || '',
      originalComment: originalComment || '',
      replyText,
      toneUsed: toneUsed || 'manual',
      status: 'success',
      timestamp: Date.now(),
      youtubeReplyId: replyResult.commentId || '',
    };

    await adminDb
      .collection('users')
      .doc(uid)
      .collection('replies')
      .doc(commentId)
      .set(replyLog, { merge: true });

    return NextResponse.json({
      success: true,
      remainingCredits: currentCredits - 1,
      replyId: replyResult.commentId,
      message: 'Reply posted to YouTube successfully! 🎉',
    });
  } catch (error: any) {
    console.error('Post Reply API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while posting reply' },
      { status: 500 }
    );
  }
}
