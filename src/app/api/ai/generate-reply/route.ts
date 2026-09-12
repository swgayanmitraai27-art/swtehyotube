import { NextRequest, NextResponse } from 'next/server';
import { generateHinglishReplySuggestions } from '@/lib/gemini';
import { adminDb } from '@/lib/firebase-admin';
import { DEFAULT_CREATOR_PERSONA } from '@/lib/constants';
import { CreatorPersonaConfig } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, commentText, authorName, videoTitle, videoDescription, customInstructions, category } = body;

    if (!commentText || !authorName) {
      return NextResponse.json({ error: 'Missing commentText or authorName' }, { status: 400 });
    }

    let persona: CreatorPersonaConfig = {
      ...DEFAULT_CREATOR_PERSONA,
      category: category || DEFAULT_CREATOR_PERSONA.category,
    };

    if (uid) {
      const userDoc = await adminDb.collection('users').doc(uid).get();
      const userData = userDoc.data() || {};

      const personaDoc = await adminDb.collection('users').doc(uid).collection('settings').doc('persona').get();
      if (personaDoc.exists) {
        persona = personaDoc.data() as CreatorPersonaConfig;
      } else {
        persona = {
          ...DEFAULT_CREATOR_PERSONA,
          channelName: userData.channelTitle || 'My Channel',
          creatorName: userData.displayName || 'Creator',
        };
      }
    }

    const suggestions = await generateHinglishReplySuggestions(
      commentText,
      authorName,
      videoTitle || 'YouTube Video',
      videoDescription || '',
      persona,
      customInstructions || ''
    );

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error: any) {
    console.error('AI Suggestion API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate AI reply' }, { status: 500 });
  }
}
