import { google } from 'googleapis';
import { YouTubeTokens, YouTubeChannelInfo, YouTubeCommentItem, YouTubeVideoSummary } from '@/types';
import { adminDb } from './firebase-admin';

const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const redirectUri = `${appUrl}/api/auth/google-callback`;

/**
 * Creates a configured OAuth2 client
 */
export function getOAuth2Client(customId?: string, customSecret?: string) {
  return new google.auth.OAuth2(
    customId?.trim() || clientId,
    customSecret?.trim() || clientSecret,
    redirectUri
  );
}

/**
 * Generate Google OAuth Consent URL with YouTube Scopes
 */
export function getGoogleOAuthUrl(stateUserId: string, customId?: string, customSecret?: string): string {
  const oauth2Client = getOAuth2Client(customId, customSecret);

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl', // Allows inserting comments & replies
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // Crucial for receiving refresh_token
    prompt: 'consent',     // Forces consent prompt so refresh_token is always returned
    scope: scopes,
    state: stateUserId,    // Pass Firebase UID in state for secure callback matching
  });
}

/**
 * Get authenticated YouTube API client for a specific user, refreshing tokens automatically
 */
export async function getAuthenticatedYouTubeClient(userId: string) {
  // Fetch user settings to check for BYOK custom client ID/secret
  let persona: any = {};
  try {
    const personaDoc = await adminDb.collection('users').doc(userId).collection('settings').doc('persona').get();
    if (personaDoc.exists) {
      persona = personaDoc.data() || {};
    } else {
      const userDoc = await adminDb.collection('users').doc(userId).get();
      persona = userDoc.data()?.settings || {};
    }
  } catch (e) {
    console.warn('Could not fetch persona for youtube client:', e);
  }

  const oauth2Client = getOAuth2Client(persona.customClientId, persona.customClientSecret);

  // Fetch stored tokens from Firestore
  const tokenDoc = await adminDb.collection('users').doc(userId).collection('tokens').doc('youtube').get();

  if (!tokenDoc.exists) {
    throw new Error('No YouTube account connected. Please connect your channel first.');
  }

  const tokens = tokenDoc.data() as YouTubeTokens;
  oauth2Client.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiry_date: tokens.expiryDate,
  });

  // Listen to token refresh events and save new tokens to Firestore
  oauth2Client.on('tokens', async (newTokens) => {
    const updatedData: Partial<YouTubeTokens> = {
      accessToken: newTokens.access_token || tokens.accessToken,
      expiryDate: newTokens.expiry_date || Date.now() + 3600 * 1000,
    };
    if (newTokens.refresh_token) {
      updatedData.refreshToken = newTokens.refresh_token;
    }

    await adminDb
      .collection('users')
      .doc(userId)
      .collection('tokens')
      .doc('youtube')
      .set(updatedData, { merge: true });
  });

  return google.youtube({ version: 'v3', auth: oauth2Client });
}

/**
 * Fetch creator's channel statistics & details
 */
export async function fetchChannelInfo(userId: string): Promise<YouTubeChannelInfo> {
  const youtube = await getAuthenticatedYouTubeClient(userId);

  const response = await youtube.channels.list({
    part: ['snippet', 'statistics', 'contentDetails'],
    mine: true,
  });

  const channel = response.data.items?.[0];
  if (!channel || !channel.id) {
    throw new Error('No YouTube channel found associated with this Google Account.');
  }

  return {
    id: channel.id,
    title: channel.snippet?.title || 'My Channel',
    description: channel.snippet?.description || '',
    customUrl: channel.snippet?.customUrl || '',
    publishedAt: channel.snippet?.publishedAt || '',
    thumbnailUrl:
      channel.snippet?.thumbnails?.high?.url ||
      channel.snippet?.thumbnails?.medium?.url ||
      channel.snippet?.thumbnails?.default?.url ||
      '',
    subscriberCount: Number(channel.statistics?.subscriberCount || 0),
    videoCount: Number(channel.statistics?.videoCount || 0),
    viewCount: Number(channel.statistics?.viewCount || 0),
  };
}

/**
 * Fetch channel's recent uploaded videos
 */
export async function fetchRecentVideos(userId: string, maxResults: number = 10): Promise<YouTubeVideoSummary[]> {
  const youtube = await getAuthenticatedYouTubeClient(userId);

  // 1. Get channel uploads playlist ID
  const channelRes = await youtube.channels.list({
    part: ['contentDetails'],
    mine: true,
  });

  const uploadsPlaylistId = channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) {
    return [];
  }

  // 2. Fetch playlist items
  const playlistRes = await youtube.playlistItems.list({
    part: ['snippet', 'contentDetails'],
    playlistId: uploadsPlaylistId,
    maxResults,
  });

  return (playlistRes.data.items || []).map((item) => ({
    id: item.contentDetails?.videoId || item.snippet?.resourceId?.videoId || '',
    title: item.snippet?.title || 'Untitled Video',
    description: item.snippet?.description || '',
    publishedAt: item.snippet?.publishedAt || '',
    thumbnailUrl:
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url ||
      '',
    commentCount: 0,
  }));
}

/**
 * Fetch comment threads for the channel with Quota Optimization
 * (Using allThreadsRelatedToChannelId or specific videoId)
 */
export async function fetchChannelComments(
  userId: string,
  videoId?: string,
  maxResults: number = 20
): Promise<YouTubeCommentItem[]> {
  const youtube = await getAuthenticatedYouTubeClient(userId);

  const requestParams: any = {
    part: ['snippet'],
    maxResults,
    textFormat: 'plainText',
    order: 'time',
  };

  if (videoId) {
    requestParams.videoId = videoId;
  } else {
    requestParams.allThreadsRelatedToChannelId = (
      await fetchChannelInfo(userId)
    ).id;
  }

  const response = await youtube.commentThreads.list(requestParams);

  const rawThreads = response.data.items || [];

  // Batch fetch video snippets (title & description)
  const videoIds = Array.from(
    new Set(
      rawThreads
        .map((t) => t.snippet?.videoId || (videoId ? videoId : ''))
        .filter((id): id is string => Boolean(id))
    )
  );

  const videoMetaMap = new Map<string, { title: string; description: string }>();

  if (videoIds.length > 0) {
    try {
      const videoRes = await youtube.videos.list({
        part: ['snippet'],
        id: videoIds.slice(0, 50),
      });
      (videoRes.data.items || []).forEach((v) => {
        if (v.id && v.snippet) {
          videoMetaMap.set(v.id, {
            title: v.snippet.title || '',
            description: v.snippet.description || '',
          });
        }
      });
    } catch (err) {
      console.warn('Could not fetch video snippet metadata for comments:', err);
    }
  }

  return rawThreads.map((thread) => {
    const topComment = thread.snippet?.topLevelComment?.snippet;
    const totalReplies = thread.snippet?.totalReplyCount || 0;
    const itemVideoId = thread.snippet?.videoId || videoId || '';
    const meta = videoMetaMap.get(itemVideoId);

    return {
      id: thread.snippet?.topLevelComment?.id || thread.id || '',
      threadId: thread.id || '',
      videoId: itemVideoId,
      videoTitle: meta?.title || '',
      videoDescription: meta?.description || '',
      authorDisplayName: topComment?.authorDisplayName || 'YouTube User',
      authorProfileImageUrl: topComment?.authorProfileImageUrl || '',
      authorChannelUrl: topComment?.authorChannelUrl || '',
      textDisplay: topComment?.textDisplay || topComment?.textOriginal || '',
      likeCount: topComment?.likeCount || 0,
      publishedAt: topComment?.publishedAt || '',
      isReplied: totalReplies > 0,
      status: totalReplies > 0 ? 'replied' : 'unreplied',
    };
  });
}

/**
 * Delete an abusive/hate comment from YouTube
 */
export async function deleteYouTubeComment(
  userId: string,
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const youtube = await getAuthenticatedYouTubeClient(userId);
    await youtube.comments.delete({ id: commentId });
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to delete comment ${commentId}:`, error?.response?.data || error);
    return {
      success: false,
      error: error?.response?.data?.error?.message || error?.message || 'Failed to delete comment',
    };
  }
}

/**
 * Post reply directly to YouTube comment thread via YouTube Data API v3
 * Costs 50 quota units on YouTube
 */
export async function postYouTubeReply(
  userId: string,
  parentId: string,
  replyText: string
): Promise<{ success: boolean; commentId?: string; error?: string }> {
  try {
    const youtube = await getAuthenticatedYouTubeClient(userId);

    const res = await youtube.comments.insert({
      part: ['snippet'],
      requestBody: {
        snippet: {
          parentId,
          textOriginal: replyText,
        },
      },
    });

    return {
      success: true,
      commentId: res.data.id || undefined,
    };
  } catch (error: any) {
    console.error('YouTube comments.insert error:', error?.response?.data || error);
    return {
      success: false,
      error: error?.response?.data?.error?.message || error?.message || 'Failed to post reply to YouTube',
    };
  }
}

