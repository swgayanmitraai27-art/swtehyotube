import { AIReplySuggestion, CreatorPersonaConfig } from '@/types';
import { DEFAULT_CREATOR_PERSONA } from './constants';

const apiKey = process.env.GEMINI_API_KEY || '';

// Powered strictly by Google Gemma 4 Thinking Models
const GEMMA_MODELS = ['gemma-4-31b-it', 'gemma-4-26b-a4b-it'];

/**
 * Clean & format author handle for YouTube mentions
 */
export function formatAuthorMention(authorDisplayName: string): string {
  if (!authorDisplayName) return '';
  const cleaned = authorDisplayName.replace(/^@/, '').trim();
  return `@${cleaned}`;
}

/**
 * Helper to safely extract JSON suggestions from raw output or markdown
 */
function parseModelOutput(rawText: string, mention: string): AIReplySuggestion[] {
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.suggestions && Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
        return parsed.suggestions.map((s: any, idx: number) => {
          let text = (s.text || '').trim();
          if (mention && !text.startsWith(mention)) {
            text = `${mention} ${text}`;
          }
          return {
            id: String(idx + 1),
            tone: s.tone || (idx === 0 ? 'hinglish_friendly' : idx === 1 ? 'quick_heart' : idx === 2 ? 'support_detailed' : 'witty_meme'),
            toneLabel: s.toneLabel || (idx === 0 ? 'Motivating Mentor' : idx === 1 ? 'Confidence Booster' : idx === 2 ? 'Actionable Guide' : 'High Hustle'),
            text,
            autoMentioned: mention,
          };
        });
      }
    }
  } catch (e) {
    // Continue
  }

  // Fallback
  return [
    {
      id: '1',
      tone: 'hinglish_friendly',
      toneLabel: 'Motivating Mentor',
      text: `${mention} Bilkul possible hai bhai! 💪 Mehnat aur consistent revision par focus karo, result zaroor aayega!`,
      autoMentioned: mention,
    },
    {
      id: '2',
      tone: 'quick_heart',
      toneLabel: 'Confidence Booster',
      text: `${mention} Mehnat karte raho, hum aapke saath hain! 🔥 All the best!`,
      autoMentioned: mention,
    },
    {
      id: '3',
      tone: 'support_detailed',
      toneLabel: 'Study Guidance',
      text: `${mention} NCERT aur previous year questions (PYQs) ko daily practice karein aur description me diye gaye resources ko check karein! 📚`,
      autoMentioned: mention,
    },
  ];
}

/**
 * Generate 3-4 multi-tone suggested replies dynamically tailored to the video's Title, Description, and Channel Persona
 * Powered by Google Gemma 4 31B IT Model
 */
export async function generateHinglishReplySuggestions(
  commentText: string,
  authorName: string,
  videoTitle: string = 'YouTube Video',
  videoDescription: string = '',
  persona: CreatorPersonaConfig = DEFAULT_CREATOR_PERSONA
): Promise<AIReplySuggestion[]> {
  const mention = formatAuthorMention(authorName);

  // Category & Niche Guidelines
  let nicheContext = '';
  if (persona.category === 'edtech') {
    nicheContext = `
CATEGORY: 📚 EdTech / Board Exams / Online Education (e.g., SW Gyan Bhumi / Vidyakul)
- Target Students: ${persona.targetAudience || 'Class 9th, 10th, 11th, 12th Board Exam Students'}
- App Name: "${persona.appName || 'SW Gyan Bhumi App'}"
- App Download Link: "${persona.appDownloadLink || ''}"
- Course / Batch Link: "${persona.courseOrWebsiteLink || ''}"
- NICHE RULES:
  * When a student asks about board exam strategy, 90%+/98% target, time management, or revision: Give genuine, realistic, step-by-step motivation (NCERT, PYQ, sample papers, daily schedule).
  * When a student asks for notes, PDFs, or batches: Guide them to the app/batch link in description.
  * Always speak with energetic teacher/mentor warmth ("Shaabaash beta", "Bilkul possible hai", "Full mehnat karo!").
`;
  } else if (persona.category === 'tech') {
    nicheContext = `
CATEGORY: 💻 Tech / Coding / Software / Gadgets
- NICHE RULES:
  * Friendly developer tone. If asked for GitHub / source code, guide them to video description.
`;
  } else if (persona.category === 'finance') {
    nicheContext = `
CATEGORY: 📈 Finance / Stock Market / Trading
- NICHE RULES:
  * Professional, informative, educational tone.
`;
  }

  const trimmedDescription = videoDescription ? videoDescription.substring(0, 700) : '';

  const prompt = `
You are the dynamic AI Community Mentor for an Indian YouTube Channel.
Creator Name: "${persona.creatorName}"
Channel Name: "${persona.channelName}"
Persona / Bio: "${persona.personaBio}"
Language Style: "${persona.languageMode}" (Natural, relatable, conversational Indian Hinglish).

VIDEO CONTEXT:
- Video Title: "${videoTitle}"
${trimmedDescription ? `- Video Description Details: "${trimmedDescription}"` : ''}

COMMENTER & QUERY:
- Viewer Name: "${authorName}" (Handle: "${mention}")
- Viewer's Exact Comment: "${commentText}"

${nicheContext}

TASK:
Deeply understand the viewer's exact question, doubt, or feedback in relation to the Video Title & Description.
Generate 4 distinct, intelligent, hyper-relevant Hinglish replies:
1. "hinglish_friendly": Motivating, warm, brotherly/mentor response directly addressing their question.
2. "quick_heart": Energetic, supportive confidence booster with emojis (1-2 lines).
3. "support_detailed": Step-by-step practical advice or actionable solution based on the video context.
4. "witty_meme": High-energy, enthusiastic hustle boost to inspire action.

MANDATORY RULES:
- Every suggestion text MUST start with the exact mention tag "${mention}".
- Address the SPECIFIC topic of the comment.
- Return output strictly formatted as JSON:

{
  "suggestions": [
    {
      "tone": "hinglish_friendly",
      "toneLabel": "Motivating Mentor",
      "text": "${mention} ..."
    },
    {
      "tone": "quick_heart",
      "toneLabel": "Confidence Booster",
      "text": "${mention} ..."
    },
    {
      "tone": "support_detailed",
      "toneLabel": "4-Month Study Plan",
      "text": "${mention} ..."
    },
    {
      "tone": "witty_meme",
      "toneLabel": "Hustle Booster",
      "text": "${mention} ..."
    }
  ]
}
`;

  for (const model of GEMMA_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        // Filter out reasoning/thought parts from Gemma 4
        const answerPart = parts.find((p: any) => !p.thought) || parts[parts.length - 1];
        const rawText = answerPart?.text || '';
        
        if (rawText) {
          const suggestions = parseModelOutput(rawText, mention);
          if (suggestions.length > 0) {
            return suggestions;
          }
        }
      }
    } catch (error) {
      console.warn(`Model ${model} error, trying next fallback:`, error);
    }
  }

  return parseModelOutput('', mention);
}

/**
 * Generate a single best auto-pilot reply for background automated posting
 */
export async function generateSingleAutoPilotReply(
  commentText: string,
  authorName: string,
  videoTitle: string = 'YouTube Video',
  videoDescription: string = '',
  persona: CreatorPersonaConfig = DEFAULT_CREATOR_PERSONA
): Promise<string> {
  const suggestions = await generateHinglishReplySuggestions(
    commentText,
    authorName,
    videoTitle,
    videoDescription,
    persona
  );

  let chosen = suggestions[0]?.text;
  if (persona.toneStyle === 'witty_energetic') {
    const witty = suggestions.find((s) => s.tone === 'witty_meme');
    if (witty) chosen = witty.text;
  } else if (persona.toneStyle === 'polite_support') {
    const support = suggestions.find((s) => s.tone === 'support_detailed');
    if (support) chosen = support.text;
  }

  if (persona.customSignature && !chosen.includes(persona.customSignature)) {
    chosen = `${chosen} ${persona.customSignature}`;
  }

  return chosen;
}
