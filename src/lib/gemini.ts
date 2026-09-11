import { AIReplySuggestion, CreatorPersonaConfig } from '@/types';
import { DEFAULT_CREATOR_PERSONA } from './constants';

const apiKey = process.env.GEMINI_API_KEY || '';
const MODEL_ID = 'gemma-4-31b-it';

/**
 * Clean & format author handle for YouTube mentions
 */
export function formatAuthorMention(authorDisplayName: string): string {
  if (!authorDisplayName) return '';
  const cleaned = authorDisplayName.replace(/^@/, '').trim();
  return `@${cleaned}`;
}

/**
 * Helper to safely extract responses from JSON or formatted bullet text
 */
function parseModelOutput(rawText: string, mention: string): AIReplySuggestion[] {
  // 1. Try strict JSON parse first
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        return parsed.suggestions.map((s: any, idx: number) => ({
          id: String(idx + 1),
          tone: s.tone || 'hinglish_friendly',
          toneLabel: s.toneLabel || 'Suggested Reply',
          text: s.text.startsWith(mention) ? s.text : `${mention} ${s.text}`,
          autoMentioned: mention,
        }));
      }
    }
  } catch (e) {
    // Continue to fallback parser
  }

  // 2. Fallback parser: extract lines with quotes or labels
  const extracted: AIReplySuggestion[] = [];
  const lines = rawText.split('\n');

  for (const line of lines) {
    const quoteMatch = line.match(/["']([^"']{10,300})["']/);
    if (quoteMatch && quoteMatch[1]) {
      let text = quoteMatch[1].trim();
      if (!text.startsWith(mention)) {
        text = `${mention} ${text}`;
      }
      extracted.push({
        id: String(extracted.length + 1),
        tone: extracted.length === 0 ? 'hinglish_friendly' : extracted.length === 1 ? 'quick_heart' : extracted.length === 2 ? 'support_detailed' : 'witty_meme',
        toneLabel: extracted.length === 0 ? 'Friendly (Hinglish)' : extracted.length === 1 ? 'Quick Heart & Emojis' : extracted.length === 2 ? 'Helpful Guidance' : 'High-Energy',
        text,
        autoMentioned: mention,
      });
      if (extracted.length >= 4) break;
    }
  }

  if (extracted.length > 0) {
    return extracted;
  }

  // 3. Guaranteed safe fallback
  return [
    {
      id: '1',
      tone: 'hinglish_friendly',
      toneLabel: 'Friendly (Hinglish)',
      text: `${mention} Shukriya bhai! ❤️ Keep supporting and stay tuned for more updates!`,
      autoMentioned: mention,
    },
    {
      id: '2',
      tone: 'quick_heart',
      toneLabel: 'Quick Heart & Love',
      text: `${mention} Thank you for watching! 🔥 Agla video jald hi live hoga.`,
      autoMentioned: mention,
    },
    {
      id: '3',
      tone: 'support_detailed',
      toneLabel: 'Helpful Guidance',
      text: `${mention} Notes aur batches ke liye aap description me diye gaye App link ko check kar sakte hain! 📚`,
      autoMentioned: mention,
    }
  ];
}

/**
 * Generate 3-4 multi-tone suggested replies tailored to the creator's niche (EdTech/Vidyakul, Tech, Finance, etc.)
 * Powered directly by Google Gemma 4 31B IT Model
 */
export async function generateHinglishReplySuggestions(
  commentText: string,
  authorName: string,
  videoTitle: string = 'YouTube Video',
  persona: CreatorPersonaConfig = DEFAULT_CREATOR_PERSONA
): Promise<AIReplySuggestion[]> {
  const mention = formatAuthorMention(authorName);

  // Category specific context
  let categoryContext = '';
  if (persona.category === 'edtech') {
    categoryContext = `
CATEGORY: 📚 EdTech / Education / Online Coaching (e.g., Vidyakul / Board Exams / Classes)
- Target Audience: ${persona.targetAudience || 'Students & Learners'}
- Creator's App Name: "${persona.appName || 'Vidyakul App'}"
- App Download Link: "${persona.appDownloadLink || ''}"
- Course / Batch Link: "${persona.courseOrWebsiteLink || ''}"
- NICHE RULES:
  * If student asks for PDF notes, classes, batches, or study material: Guide them to download the ${persona.appName || 'Vidyakul App'} from description.
  * If student expresses gratitude or understanding: Reply with encouraging, motivating teacher/mentor warmth (e.g. "Shaabaash beta! Khoob mehnat karo aur board me top karo! 🎯").
  * Always be polite, motivating, and student-friendly.
`;
  } else if (persona.category === 'tech') {
    categoryContext = `
CATEGORY: 💻 Tech / Coding / Gadgets
- NICHE RULES:
  * Friendly developer/bro tone. If asking for source code: mention link in description.
`;
  } else if (persona.category === 'finance') {
    categoryContext = `
CATEGORY: 📈 Finance / Stock Market / Trading
- NICHE RULES:
  * Professional, informative. Always maintain ethical context.
`;
  }

  const prompt = `
You are the AI Assistant for an Indian YouTube Content Creator named "${persona.creatorName}" (Channel: "${persona.channelName}").
Channel Persona & Bio: "${persona.personaBio}".
Language Mode: "${persona.languageMode}" (Natural Indian conversational Hinglish like "Bhai mast video thi" -> "Shukriya bhai ❤️").
Optional Custom Signature: "${persona.customSignature || ''}".
Optional CTA: "${persona.callToAction || ''}".

${categoryContext}

Video Title: "${videoTitle}"
Commenter: "${authorName}" (Mention tag: "${mention}")
User's Comment: "${commentText}"

TASK:
Analyze the sentiment and intent of the comment.
Generate 4 distinct, human-like, high-retention creator replies matching these specific styles:
1. "hinglish_friendly": Warm, brotherly, natural Hinglish style.
2. "quick_heart": Short, sweet, energetic 1-liner with emojis.
3. "support_detailed": Direct helpful answer tailored to the channel category (e.g., student guidance for EdTech, coding help for Tech).
4. "witty_meme": Fun, high-energy, relatable Indian creator vibe.

CRITICAL RULES:
- Always start or include the mention tag "${mention}".
- Keep replies concise (1-3 sentences maximum).
- Return ONLY a strict JSON object with this schema:

{
  "suggestions": [
    {
      "tone": "hinglish_friendly",
      "toneLabel": "Friendly (Hinglish)",
      "text": "..."
    },
    {
      "tone": "quick_heart",
      "toneLabel": "Quick Heart & Emojis",
      "text": "..."
    },
    {
      "tone": "support_detailed",
      "toneLabel": "Helpful Guidance",
      "text": "..."
    },
    {
      "tone": "witty_meme",
      "toneLabel": "High-Energy",
      "text": "..."
    }
  ]
}
`;

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 800,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return parseModelOutput(rawText, mention);
    }
  } catch (error) {
    console.error('Gemma 4 31B IT AI error:', error);
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
  persona: CreatorPersonaConfig = DEFAULT_CREATOR_PERSONA
): Promise<string> {
  const suggestions = await generateHinglishReplySuggestions(commentText, authorName, videoTitle, persona);
  
  let chosen = suggestions[0]?.text;
  if (persona.toneStyle === 'witty_energetic') {
    const witty = suggestions.find(s => s.tone === 'witty_meme');
    if (witty) chosen = witty.text;
  } else if (persona.toneStyle === 'polite_support') {
    const support = suggestions.find(s => s.tone === 'support_detailed');
    if (support) chosen = support.text;
  }

  if (persona.customSignature && !chosen.includes(persona.customSignature)) {
    chosen = `${chosen} ${persona.customSignature}`;
  }

  return chosen;
}
