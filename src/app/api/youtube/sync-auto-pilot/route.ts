import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { fetchChannelComments, postYouTubeReply, deleteYouTubeComment } from '@/lib/youtube';
import { generateSingleAutoPilotReply } from '@/lib/gemini';
import { evaluateCommentEligibility } from '@/lib/quota-guard';
import { DEFAULT_CREATOR_PERSONA } from '@/lib/constants';
import { CreatorPersonaConfig } from '@/types';
import * as admin from 'firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUid = searchParams.get('uid');

    // Query active auto-pilot creators
    let usersQuery = adminDb.collection('users').where('autoPilotEnabled', '==', true);
    if (targetUid) {
      usersQuery = adminDb.collection('users').where(admin.firestore.FieldPath.documentId(), '==', targetUid);
    }

    const usersSnap = await usersQuery.get();

    if (usersSnap.empty) {
      return NextResponse.json({ success: true, message: 'No active auto-pilot users found', processed: 0 });
    }

    const results: any[] = [];

    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      let credits = userData.credits || 0;

      if (credits <= 0 || !userData.channelId) {
        continue;
      }

      // Fetch persona settings
      const personaDoc = await adminDb.collection('users').doc(userId).collection('settings').doc('persona').get();
      const persona: CreatorPersonaConfig = personaDoc.exists
        ? (personaDoc.data() as CreatorPersonaConfig)
        : {
            ...DEFAULT_CREATOR_PERSONA,
            channelName: userData.channelTitle || 'My Channel',
            creatorName: userData.displayName || 'Creator',
          };

      // Fetch unreplied comments
      let comments = [];
      try {
        comments = await fetchChannelComments(userId, undefined, 10);
      } catch (err) {
        console.warn(`Could not fetch comments for user ${userId}:`, err);
        continue;
      }

      let userRepliesCount = 0;

      for (const comment of comments) {
        if (credits <= 0) break;
        if (comment.isReplied) continue;

        // Check if already processed in replies subcollection
        const existingReply = await adminDb
          .collection('users')
          .doc(userId)
          .collection('replies')
          .doc(comment.id)
          .get();

        if (existingReply.exists) continue;

        // Skip old comments to protect credits (default: only reply to comments from last 48 hours)
        const maxAgeHours = persona.maxCommentAgeHours || 48;
        if (comment.publishedAt) {
          const commentTime = new Date(comment.publishedAt).getTime();
          const ageHours = (Date.now() - commentTime) / (1000 * 60 * 60);
          if (ageHours > maxAgeHours) {
            await adminDb
              .collection('users')
              .doc(userId)
              .collection('replies')
              .doc(comment.id)
              .set({
                commentId: comment.id,
                authorName: comment.authorDisplayName,
                originalComment: comment.textDisplay,
                status: 'skipped',
                reason: `Comment is older than ${maxAgeHours} hours (${Math.round(ageHours)} hrs old). Skipped to save credits.`,
                timestamp: Date.now(),
              });
            continue;
          }
        }

        // Quota Guard check
        const eligibility = evaluateCommentEligibility(
          comment.textDisplay,
          comment.authorChannelUrl || '',
          userData.channelId,
          persona
        );

        if (!eligibility.shouldReply) {
          let commentAction = 'skipped';
          let actionReason = eligibility.reason;

          // Auto-Delete Toxic / Abusive / Defamatory comments from YouTube
          if (eligibility.isToxic && persona.autoDeleteToxicComments !== false) {
            try {
              const deleteRes = await deleteYouTubeComment(userId, comment.id);
              if (deleteRes.success) {
                commentAction = 'deleted_toxic';
                actionReason = 'Auto-deleted abusive / toxic comment from YouTube channel';
              }
            } catch (delErr) {
              console.warn(`Failed to auto-delete toxic comment ${comment.id}:`, delErr);
            }
          }

          // Log action in history
          await adminDb
            .collection('users')
            .doc(userId)
            .collection('replies')
            .doc(comment.id)
            .set({
              commentId: comment.id,
              authorName: comment.authorDisplayName,
              originalComment: comment.textDisplay,
              status: commentAction,
              reason: actionReason,
              timestamp: Date.now(),
            });
          continue;
        }

        // Generate Hinglish AI Reply
        try {
          const aiReplyText = await generateSingleAutoPilotReply(
            comment.textDisplay,
            comment.authorDisplayName,
            comment.videoTitle || 'Video',
            comment.videoDescription || '',
            persona
          );

          // Post reply to YouTube API
          const postRes = await postYouTubeReply(userId, comment.id, aiReplyText);

          if (postRes.success) {
            credits -= 1;
            userRepliesCount += 1;

            // Deduct credit
            await userDoc.ref.update({
              credits: admin.firestore.FieldValue.increment(-1),
              updatedAt: Date.now(),
            });

            // Record successful log
            await adminDb
              .collection('users')
              .doc(userId)
              .collection('replies')
              .doc(comment.id)
              .set({
                commentId: comment.id,
                authorName: comment.authorDisplayName,
                originalComment: comment.textDisplay,
                replyText: aiReplyText,
                toneUsed: persona.toneStyle,
                status: 'success',
                timestamp: Date.now(),
                youtubeReplyId: postRes.commentId,
              });
          }
        } catch (genErr) {
          console.error(`Auto-pilot failed for comment ${comment.id}:`, genErr);
        }
      }

      results.push({
        userId,
        repliesSent: userRepliesCount,
        remainingCredits: credits,
      });
    }

    return NextResponse.json({
      success: true,
      processedUsers: results.length,
      results,
    });
  } catch (error: any) {
    console.error('Auto-pilot execution failed:', error);
    return NextResponse.json({ error: error.message || 'Auto-pilot failed' }, { status: 500 });
  }
}
