import { NextRequest, NextResponse } from 'next/server';
import { adminMessaging, adminDb } from '@/lib/firebase-admin';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await req.json();
    const { id, topic, token, notification, data, saveToDb } = body;

    const title = notification?.title || 'Booyah Rewards Alert';
    const bodyText = notification?.body || 'Check the tournament lobby for updates!';
    const imageUrl = notification?.image || notification?.imageUrl;

    console.log(`[PushNotification API] Dispatching message: Title="${title}", Topic=${topic || 'none'}, Token=${token ? 'provided' : 'none'}`);

    let messageResponse = '';

    // Convert data values to strings as required by FCM
    const stringifiedData: { [key: string]: string } = {};
    if (data && typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        stringifiedData[key] = String(data[key]);
      });
    }
    stringifiedData['click_action'] = 'FLUTTER_NOTIFICATION_CLICK';

    if (token) {
      // 1. Direct FCM Device Token send
      messageResponse = await adminMessaging.send({
        token: token,
        notification: {
          title: title,
          body: bodyText,
          imageUrl: imageUrl || undefined,
        },
        data: stringifiedData,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            channelId: 'high_importance_channel',
          },
        },
        webpush: {
          headers: {
            Urgency: 'high',
          },
          notification: {
            title: title,
            body: bodyText,
            icon: 'https://booyehreward.vercel.app/booyah_logo.png',
            image: imageUrl || undefined,
          },
        },
      });
    } else {
      // 2. Topic Broadcast send (e.g. 'all_users', 'match_123', 'admin_alerts')
      const targetTopic = topic || 'all_users';
      messageResponse = await adminMessaging.send({
        topic: targetTopic,
        notification: {
          title: title,
          body: bodyText,
          imageUrl: imageUrl || undefined,
        },
        data: stringifiedData,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            channelId: 'high_importance_channel',
          },
        },
        webpush: {
          headers: {
            Urgency: 'high',
          },
          notification: {
            title: title,
            body: bodyText,
            icon: 'https://booyehreward.vercel.app/booyah_logo.png',
            image: imageUrl || undefined,
          },
        },
      });
    }

    // Persist into Firestore only if requested or if not already saved by client
    if (saveToDb !== false) {
      const notifId = id || `notif_srv_${Date.now()}`;
      await adminDb.collection('skillwinner_notifications').doc(notifId).set({
        id: notifId,
        title: title,
        body: bodyText,
        type: 'adminBroadcast',
        target_type: topic ? (topic.startsWith('match_') ? 'match' : 'all') : 'all',
        target_id: topic || null,
        created_at: new Date().toISOString(),
        is_read: false,
        image_url: imageUrl || null,
        data: stringifiedData,
      }, { merge: true });
    }

    return NextResponse.json(
      {
        success: true,
        messageId: messageResponse,
        message: 'Push notification successfully dispatched via Firebase Cloud Messaging',
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('[PushNotification API] Error sending push notification:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
