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
  // Also extract doc ID from name: projects/.../documents/collection/docId
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
    const res = await fetch(url, { next: { revalidate: 15 } });
    if (!res.ok) {
      console.warn(`[Firestore REST] Fetch ${collection} status: ${res.status}`);
      return [];
    }
    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return [];
    return data.documents.map(decodeFirestoreDoc);
  } catch (e) {
    console.warn(`[Firestore REST] Fetch ${collection} error:`, e);
    return [];
  }
}

// Global In-Memory Cache
let memoryCache: {
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

    if (collection) {
      const docs = await fetchCollectionDocs(collection);
      return NextResponse.json({ success: true, data: docs }, { headers: corsHeaders });
    }

    // Refresh memory cache if expired or empty
    if (now - memoryCache.lastUpdated > CACHE_TTL_MS || memoryCache.matches.length === 0) {
      try {
        const [matches, banners, configDocs] = await Promise.all([
          fetchCollectionDocs('skillwinner_matches'),
          fetchCollectionDocs('skillwinner_banners'),
          fetchCollectionDocs('skillwinner_settings'),
        ]);

        if (matches.length > 0 || memoryCache.matches.length === 0) {
          memoryCache.matches = matches;
        }
        if (banners.length > 0 || memoryCache.banners.length === 0) {
          memoryCache.banners = banners;
        }
        const appConfig = configDocs.find((c) => c.id === 'app_config') || {
          telegramSupportUrl: 'https://t.me/swgayanmitra_support',
        };
        memoryCache.config = appConfig;
        memoryCache.lastUpdated = now;
      } catch (err) {
        console.warn('[Sync API] Cache refresh error:', err);
      }
    }

    // User-specific data
    let userData: any = null;
    let userTransactions: any[] = [];

    if (userId && userId !== 'user_guest') {
      try {
        const userUrl = `${BASE_FIRESTORE_URL}/skillwinner_users/${userId}?key=${FIREBASE_API_KEY}`;
        const userRes = await fetch(userUrl, { cache: 'no-store' });
        if (userRes.ok) {
          const uDoc = await userRes.json();
          userData = decodeFirestoreDoc(uDoc);
        }
      } catch (e) {
        console.warn('[Sync API] User fetch error:', e);
      }
    }

    return NextResponse.json(
      {
        success: true,
        matches: memoryCache.matches,
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

    const fields: Record<string, any> = {};
    for (const k in data) {
      fields[k] = encodeValue(data[k]);
    }

    const patchUrl = `${BASE_FIRESTORE_URL}/${collection}/${docId}?key=${FIREBASE_API_KEY}`;
    const res = await fetch(patchUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Firestore REST write error (${res.status}): ${errText}` },
        { status: res.status, headers: corsHeaders }
      );
    }

    // Invalidate server cache
    memoryCache.lastUpdated = 0;

    return NextResponse.json({ success: true, docId }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Write failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
