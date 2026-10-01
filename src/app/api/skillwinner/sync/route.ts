import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// In-Memory Global Server Cache (15-second TTL)
let cachedData: {
  matches: any[];
  banners: any[];
  config: any;
  lastUpdated: number;
} = {
  matches: [],
  banners: [],
  config: {},
  lastUpdated: 0,
};

const CACHE_TTL_MS = 15000; // 15 seconds

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const collection = searchParams.get('collection');
    const now = Date.now();

    // 1. Single collection query if specifically requested
    if (collection) {
      if (adminDb) {
        const snapshot = await adminDb.collection(collection).get();
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ success: true, data: docs }, { headers: corsHeaders });
      }
      return NextResponse.json({ success: false, data: [] }, { headers: corsHeaders });
    }

    // 2. Full Sync Bundled Endpoint (Matches, Banners, Config, User data)
    // Check if cache is fresh
    if (now - cachedData.lastUpdated > CACHE_TTL_MS || cachedData.matches.length === 0) {
      if (adminDb) {
        try {
          const [matchesSnap, bannersSnap, configDoc] = await Promise.all([
            adminDb.collection('skillwinner_matches').get(),
            adminDb.collection('skillwinner_banners').get(),
            adminDb.collection('skillwinner_settings').doc('app_config').get(),
          ]);

          cachedData = {
            matches: matchesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
            banners: bannersSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
            config: configDoc.exists ? configDoc.data() : { telegramSupportUrl: 'https://t.me/swgayanmitra_support' },
            lastUpdated: now,
          };
        } catch (e) {
          console.warn('[Sync API] Firestore read warning (serving cached data):', e);
        }
      }
    }

    // User-specific data (not cached in global cache)
    let userData: any = null;
    let userTransactions: any[] = [];
    let userWithdrawals: any[] = [];
    let userVouchers: any[] = [];

    if (userId && userId !== 'user_guest' && adminDb) {
      try {
        const userDoc = await adminDb.collection('skillwinner_users').doc(userId).get();
        if (userDoc.exists) {
          userData = { id: userDoc.id, ...userDoc.data() };
        }

        const txnSnap = await adminDb
          .collection('skillwinner_transactions')
          .where('userId', '==', userId)
          .limit(50)
          .get();
        userTransactions = txnSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn('[Sync API] User data fetch error:', e);
      }
    }

    return NextResponse.json(
      {
        success: true,
        matches: cachedData.matches,
        banners: cachedData.banners,
        config: cachedData.config,
        user: userData,
        transactions: userTransactions,
        serverTimestamp: now,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Sync failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// 3. POST / PATCH: Write or Update a Document and Invalidate Cache
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { collection, docId, data } = body;

    if (!collection || !docId || !data) {
      return NextResponse.json(
        { error: 'collection, docId, and data are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (adminDb) {
      await adminDb.collection(collection).doc(docId).set(data, { merge: true });
      // Invalidate cache immediately on write
      cachedData.lastUpdated = 0;
    }

    return NextResponse.json({ success: true, docId }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Write failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
