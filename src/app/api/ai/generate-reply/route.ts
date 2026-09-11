import { NextRequest, NextResponse } from 'next/server';
import { generateHinglishReplySuggestions } from '@/lib/gemini';
import { adminDb } from '@/lib/firebase-admin';
import { DEFAULT_CREATOR_PERSONA } from '@/lib/constants';
import { CreatorPersonaConfig } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, commentText, authorName, videoTitle } = body;

    if (!commentText || !authorName) {
      return NextResponse.json({ error: 'Missing commentText or authorName' }, { status: 400 });
    }

    let persona: CreatorPersonaConfig = DEFAULT_CREATOR_PERSONA;

    if (uid) {
      const personaDoc = await adminDb.collection('users').doc(uid).collection('settings').doc('persona').get();
      if (personaDoc.exists) {
        persona = personaDoc.data() as CreatorPersonaConfig;
      }
    }

    const suggestions = await generateHinglishReplySuggestions(
      commentText,
      authorName,
      videoTitle || 'YouTube Video',
      persona
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
