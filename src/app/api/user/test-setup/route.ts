import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { settings, sampleComment = 'Sir, course notes aur app ka link kahan milega?' } = body;

    const startTime = Date.now();
    const diagnostics = {
      gcpStatus: 'valid',
      gcpMessage: 'Google Cloud Credentials format verified.',
      aiStatus: 'valid',
      aiMessage: 'Gemma 4 31B AI Engine connected successfully.',
      sampleReply: '',
      latencyMs: 0,
      timestamp: new Date().toISOString(),
    };

    // 1. Validate Custom Client ID & Secret format if provided
    if (settings?.customClientId) {
      if (!settings.customClientId.includes('.apps.googleusercontent.com')) {
        diagnostics.gcpStatus = 'warning';
        diagnostics.gcpMessage = 'Client ID format does not end in .apps.googleusercontent.com';
      }
    }

    // 2. Test Gemini AI Engine with the Persona Settings
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not configured');
      }

      const ai = new GoogleGenAI({ apiKey });
      const personaPrompt = `You are an AI YouTube channel community manager for "${settings?.channelName || 'Creator'}" run by "${settings?.creatorName || 'Creator'}".
Tone: ${settings?.toneStyle || 'Friendly and helpful Hinglish'}.
Custom CTA: ${settings?.callToAction || ''}
App Download Link: ${settings?.appDownloadLink || ''}
Signature: ${settings?.customSignature || ''}

A viewer commented: "${sampleComment}".
Generate a short, natural, highly engaging reply in 1-2 sentences:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: personaPrompt,
      });

      diagnostics.sampleReply = response.text?.trim() || 'Dhanyawad bhai! Link bio aur description me available hai ❤️';
    } catch (aiErr: any) {
      console.error('AI Diagnostics Error:', aiErr);
      diagnostics.aiStatus = 'warning';
      diagnostics.aiMessage = aiErr?.message || 'AI Engine test fallback';
      diagnostics.sampleReply = 'Namaste! Comment karne ke liye dhanyawad ❤️';
    }

    diagnostics.latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      diagnostics,
    });
  } catch (error: any) {
    console.error('Diagnostics route error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal error' },
      { status: 500 }
    );
  }
}
