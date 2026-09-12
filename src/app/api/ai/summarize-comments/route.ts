import { NextRequest, NextResponse } from 'next/server';
import { summarizeVideoComments } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoTitle, channelName, comments } = body;

    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No comments provided for summary analysis.' },
        { status: 400 }
      );
    }

    const summary = await summarizeVideoComments(
      comments,
      videoTitle || 'YouTube Video',
      channelName || 'Creator'
    );

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error: any) {
    console.error('AI Comment Summary API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
