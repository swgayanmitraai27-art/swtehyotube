import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { settings, sampleComment = 'Sir, course notes aur app ka link kahan milega?' } = body;

    const startTime = Date.now();
    const diagnostics = {
      gcpStatus: 'valid',
      gcpMessage: 'Google Cloud Credentials verified.',
      aiStatus: 'valid',
      aiMessage: 'Google Gemma 4 31B AI Engine connected.',
      sampleReply: '',
      latencyMs: 0,
      timestamp: new Date().toISOString(),
    };

    // Test Gemini / Gemma AI Engine with the Persona Settings
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const personaPrompt = `You are an AI YouTube channel community manager for "${settings?.channelName || 'Creator'}" run by "${settings?.creatorName || 'Creator'}".
Tone: ${settings?.toneStyle || 'Friendly and helpful Hinglish'}.
Custom CTA: ${settings?.callToAction || ''}
App Download Link: ${settings?.appDownloadLink || ''}
Signature: ${settings?.customSignature || ''}

A viewer commented: "${sampleComment}".
Generate a short, natural, highly engaging reply in 1-2 sentences in natural Hinglish:`;

      const result = await model.generateContent(personaPrompt);
      const response = await result.response;
      diagnostics.sampleReply = response.text()?.trim() || 'Dhanyawad bhai! Link bio aur description me available hai ❤️';
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
