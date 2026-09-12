import { NextRequest, NextResponse } from 'next/server';
import { fetchChannelComments } from '@/lib/youtube';
import { generateHinglishReplySuggestions } from '@/lib/gemini';
import { evaluateCommentEligibility } from '@/lib/quota-guard';
import { adminDb } from '@/lib/firebase-admin';
import { DEFAULT_CREATOR_PERSONA } from '@/lib/constants';
import { CreatorPersonaConfig, YouTubeCommentItem } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    const videoId = searchParams.get('videoId') || undefined;
    const generateSuggestions = searchParams.get('suggestions') !== 'false';

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    // 1. Fetch user persona & channel id from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data() || {};
    const channelId = userData.channelId || '';

    const settingsDoc = await adminDb.collection('users').doc(uid).collection('settings').doc('persona').get();
    const persona: CreatorPersonaConfig = settingsDoc.exists
      ? (settingsDoc.data() as CreatorPersonaConfig)
      : {
          ...DEFAULT_CREATOR_PERSONA,
          channelName: userData.channelTitle || 'My Channel',
          creatorName: userData.displayName || 'Creator',
        };

    // 2. Fetch raw comments from YouTube API
    const rawComments = await fetchChannelComments(uid, videoId, 25);

    // 3. Process each comment through Quota Guard and optionally attach AI Suggestions
    const processedComments: YouTubeCommentItem[] = await Promise.all(
      rawComments.map(async (comment) => {
        // Quota Guard Pre-Filter
        const filterResult = evaluateCommentEligibility(
          comment.textDisplay,
          comment.authorChannelUrl || '',
          channelId,
          persona
        );

        if (!filterResult.shouldReply && !comment.isReplied) {
          return {
            ...comment,
            status: 'filtered_out' as const,
          };
        }

        // Generate AI suggestions for unreplied comments if requested
        if (generateSuggestions && !comment.isReplied) {
          try {
            const suggestions = await generateHinglishReplySuggestions(
              comment.textDisplay,
              comment.authorDisplayName,
              comment.videoTitle || 'Latest Video',
              comment.videoDescription || '',
              persona
            );
            return {
              ...comment,
              suggestions,
            };
          } catch (aiErr) {
            console.warn('AI Suggestion generation skipped for comment:', comment.id);
          }
        }

        return comment;
      })
    );

    return NextResponse.json({
      success: true,
      comments: processedComments,
      total: processedComments.length,
    });
  } catch (error: any) {
    console.error('Fetch Comments API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
