import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const FIREBASE_API_KEY = "AIzaSyCLTHMklWsgiydXuF3QssaR9XtHtHLjd_8";
const PROJECT_ID = "sw-gyanmitra-finall2-426-dcc41";
const BASE_FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Helper: Decode Firestore REST document format
function decodeValue(val: any): any {
  if (!val || typeof val !== 'object') return val;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) {
    const list = val.arrayValue?.values || [];
    return list.map(decodeValue);
  }
  if ('mapValue' in val) {
    const fields = val.mapValue?.fields || {};
    const result: Record<string, any> = {};
    for (const k in fields) {
      result[k] = decodeValue(fields[k]);
    }
    return result;
  }
  return val;
}

function decodeFirestoreDoc(doc: any): any {
  if (!doc || !doc.fields) return {};
  const result: Record<string, any> = {};
  for (const k in doc.fields) {
    result[k] = decodeValue(doc.fields[k]);
  }
  if (doc.name) {
    const parts = doc.name.split('/');
    result.id = result.id || parts[parts.length - 1];
  }
  return result;
}

// Helper: Encode plain JS object to Firestore REST fields format
function encodeValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
  }
  if (typeof val === 'boolean') return { booleanValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(encodeValue) } };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const k in val) {
      fields[k] = encodeValue(val[k]);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

async function fetchCollectionDocs(collection: string): Promise<any[]> {
  try {
    const url = `${BASE_FIRESTORE_URL}/${collection}?key=${FIREBASE_API_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return [];
    return data.documents.map(decodeFirestoreDoc);
  } catch (e) {
    return [];
  }
}

// Global In-Memory Cache for Ultimate Speed & Resilience
let memoryCache: {
  matches: Record<string, any>;
  transactions: any[];
  banners: any[];
  users: Record<string, any>;
  config: any;
  lastLoaded: number;
} = {
  matches: {},
  transactions: [],
  banners: [],
  users: {},
  config: {
    telegramSupportUrl: 'https://t.me/swgayanmitra_support',
  },
  lastLoaded: 0,
};

const CACHE_REFRESH_INTERVAL = 30000; // 30 seconds

async function refreshCacheFromFirestoreIfNeeded() {
  const now = Date.now();
  if (now - memoryCache.lastLoaded > CACHE_REFRESH_INTERVAL || Object.keys(memoryCache.matches).length === 0) {
    try {
      const [remoteMatches, remoteBanners, remoteTxns, configDocs] = await Promise.all([
        fetchCollectionDocs('skillwinner_matches'),
        fetchCollectionDocs('skillwinner_banners'),
        fetchCollectionDocs('skillwinner_transactions'),
        fetchCollectionDocs('skillwinner_settings'),
      ]);

      if (remoteMatches.length > 0) {
        for (const m of remoteMatches) {
          memoryCache.matches[m.id] = { ...memoryCache.matches[m.id], ...m };
        }
      }

      if (remoteBanners.length > 0) {
        memoryCache.banners = remoteBanners;
      }

      if (remoteTxns.length > 0) {
        memoryCache.transactions = remoteTxns;
      }

      const appConfig = configDocs.find((c) => c.id === 'app_config');
      if (appConfig) {
        memoryCache.config = appConfig;
      }

      memoryCache.lastLoaded = now;
    } catch (err) {
      console.warn('[Sync API] Refresh cache warning:', err);
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const collection = searchParams.get('collection');
    const now = Date.now();

    await refreshCacheFromFirestoreIfNeeded();

    if (collection === 'skillwinner_matches') {
      return NextResponse.json({ success: true, data: Object.values(memoryCache.matches) }, { headers: corsHeaders });
    }

    // User-specific data
    let userData = (userId && memoryCache.users[userId]) ? memoryCache.users[userId] : null;
    if (!userData && userId && userId !== 'user_guest') {
      try {
        const userUrl = `${BASE_FIRESTORE_URL}/skillwinner_users/${userId}?key=${FIREBASE_API_KEY}`;
        const userRes = await fetch(userUrl, { cache: 'no-store' });
        if (userRes.ok) {
          const uDoc = await userRes.json();
          userData = decodeFirestoreDoc(uDoc);
          memoryCache.users[userId] = userData;
        }
      } catch (e) {}
    }

    const userTransactions = userId
      ? memoryCache.transactions.filter((t: any) => t.userId === userId)
      : memoryCache.transactions;

    return NextResponse.json(
      {
        success: true,
        matches: Object.values(memoryCache.matches),
        banners: memoryCache.banners,
        config: memoryCache.config,
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

// Write/Update Document
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

    // 1. Immediately update server in-memory cache
    if (collection === 'skillwinner_matches') {
      memoryCache.matches[docId] = { ...(memoryCache.matches[docId] || {}), ...data, id: docId };
    } else if (collection === 'skillwinner_users') {
      memoryCache.users[docId] = { ...(memoryCache.users[docId] || {}), ...data, id: docId };
    } else if (collection === 'skillwinner_transactions') {
      const idx = memoryCache.transactions.findIndex(t => t.id === docId);
      if (idx !== -1) {
        memoryCache.transactions[idx] = { ...memoryCache.transactions[idx], ...data, id: docId };
      } else {
        memoryCache.transactions.unshift({ ...data, id: docId });
      }
    }

    // 2. Persist to Firestore REST in background
    const fields: Record<string, any> = {};
    for (const k in data) {
      fields[k] = encodeValue(data[k]);
    }

    const patchUrl = `${BASE_FIRESTORE_URL}/${collection}/${docId}?key=${FIREBASE_API_KEY}`;
    fetch(patchUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    }).catch((e) => console.warn('[Sync API] Firestore patch warning:', e));

    return NextResponse.json({ success: true, docId }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Write failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
