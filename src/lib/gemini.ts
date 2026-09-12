import { AIReplySuggestion, CreatorPersonaConfig } from '@/types';
import { DEFAULT_CREATOR_PERSONA } from './constants';

const apiKey = process.env.GEMINI_API_KEY || '';

// Prioritized supported active Gemini model versions
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-2.5-flash-lite'];

/**
 * Clean & format author handle for YouTube mentions
 */
export function formatAuthorMention(authorDisplayName: string): string {
  if (!authorDisplayName) return '';
  const cleaned = authorDisplayName.replace(/^@/, '').trim();
  return `@${cleaned}`;
}

/**
 * Helper to parse and clean model suggestions
 */
function normalizeSuggestions(suggestions: any[], mention: string): AIReplySuggestion[] {
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return [];
  }

  return suggestions.map((s: any, idx: number) => {
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

/**
 * Generate 3-4 multi-tone suggested replies dynamically tailored to the video's Title, Description, and Channel Persona
 * Powered directly by Google Gemini 2.5 Flash
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
- App Name: "${persona.appName || 'Official App'}"
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

  // Trim video description for prompt context
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
- Address the SPECIFIC topic of the comment (e.g., if they asked for board exam 98% in 4 months, address 4 months, NCERT, PYQs, and daily revision).
- DO NOT give generic repetitive answers like "Thanks for watching". Make it 100% personalized!
`;

  for (const model of GEMINI_MODELS) {
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
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                suggestions: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      tone: { type: 'STRING' },
                      toneLabel: { type: 'STRING' },
                      text: { type: 'STRING' },
                    },
                    required: ['tone', 'toneLabel', 'text'],
                  },
                },
              },
              required: ['suggestions'],
            },
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed.suggestions && parsed.suggestions.length > 0) {
            return normalizeSuggestions(parsed.suggestions, mention);
          }
        }
      }
    } catch (error) {
      console.warn(`Gemini model ${model} error, trying next fallback:`, error);
    }
  }

  // Context-aware smart fallback if all models fail
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
