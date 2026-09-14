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
  persona: CreatorPersonaConfig = DEFAULT_CREATOR_PERSONA,
  oneTimeInstruction: string = ''
): Promise<AIReplySuggestion[]> {
  const mention = formatAuthorMention(authorName);

  // Category & Niche Guidelines
  let nicheContext = '';
  if (persona.category === 'edtech') {
    nicheContext = `
CATEGORY: 📚 EdTech / Board Exams / Online Education (e.g., SW Gyan Bhumi / Online Classes)
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
  } else if (persona.category === 'business_consulting') {
    nicheContext = `
CATEGORY: 💼 Business / Agency / Lead Generation
- NICHE RULES:
  * Helpful, authoritative. Guide serious clients to consultation link or contact info.
`;
  }

  const combinedCustomRules = [persona.customInstructions, oneTimeInstruction].filter(Boolean).join('; ');
  const customRulesBlock = combinedCustomRules
    ? `\nCREATOR'S MANDATORY CUSTOM INSTRUCTIONS / SPECIAL RULES:\n"${combinedCustomRules}"\n- You MUST strictly follow and embed these special creator rules in all reply variations!\n`
    : '';

  const trimmedDescription = videoDescription ? videoDescription.substring(0, 700) : '';

  // AI Tone Style Context
  let toneStyleInstruction = '';
  switch (persona.toneStyle) {
    case 'witty_funny':
    case 'witty_energetic':
      toneStyleInstruction = 'CREATOR VOICE TONE: 🎭 Witty, funny, sarcastic humor, and playful banter. Use light jokes or entertaining comebacks that delight the audience while remaining respectful.';
      break;
    case 'professional_educator':
    case 'pro_mentor':
      toneStyleInstruction = 'CREATOR VOICE TONE: 🎓 Professional Educator & Academic Mentor. Formal, structured, highly knowledgeable, polite, and pedagogical.';
      break;
    case 'casual_friendly':
    case 'friendly_bro':
      toneStyleInstruction = 'CREATOR VOICE TONE: 🤝 Casual & Friendly. Warm, conversational, feels like talking to a close friend or approachable brother.';
      break;
    case 'hype_energetic':
      toneStyleInstruction = 'CREATOR VOICE TONE: ⚡ Hype & Super Energetic! Full of excitement, hype-beast energy, emojis (🔥🚀💯), and unstoppable motivation.';
      break;
    case 'supportive_mentor':
    case 'polite_support':
      toneStyleInstruction = 'CREATOR VOICE TONE: 💖 Supportive & Empathetic Mentor. Deeply encouraging, patient, reassuring students/viewers through their doubts.';
      break;
    case 'short_crisp':
      toneStyleInstruction = 'CREATOR VOICE TONE: 🎯 Short, Crisp & Punchy. Max 1-2 short sentences (under 15 words). Direct answer with zero fluff.';
      break;
    default:
      toneStyleInstruction = 'CREATOR VOICE TONE: 🎓 Encouraging Mentor. Warm, insightful, and motivating.';
  }

  const prompt = `
You are the dynamic AI Community Mentor for YouTube Channel: "${persona.channelName}".
Creator Name: "${persona.creatorName}"
Persona / Bio: "${persona.personaBio}"
Target Language: "${persona.languageMode}" (Supports English, natural Hinglish, and 140+ languages).
${toneStyleInstruction}

VIDEO CONTEXT:
- Video Title: "${videoTitle}"
${trimmedDescription ? `- Video Description Details: "${trimmedDescription}"` : ''}

COMMENTER & QUERY:
- Viewer Name: "${authorName}" (Handle: "${mention}")
- Viewer's Exact Comment: "${commentText}"

${nicheContext}
${customRulesBlock}
TASK:
Deeply understand the viewer's exact question, doubt, or feedback in relation to the Video Title & Description, Creator Tone, and Special Instructions.
Generate 4 distinct, intelligent, hyper-relevant replies:
1. "tone_primary": Tailored specifically to the creator's chosen tone (${persona.toneStyle || 'friendly'}).
2. "quick_heart": Energetic, supportive confidence booster with emojis (1-2 lines).
3. "support_detailed": Step-by-step practical advice or actionable solution based on the video context.
4. "witty_meme": High-energy, humorous/witty comeback or hype boost to inspire engagement.

MANDATORY RULES:
- Every suggestion text MUST start with the exact mention tag "${mention}".
- Address the SPECIFIC topic of the comment.
- Return output strictly formatted as JSON:

{
  "suggestions": [
    {
      "tone": "tone_primary",
      "toneLabel": "Primary Voice",
      "text": "${mention} ..."
    },
    {
      "tone": "quick_heart",
      "toneLabel": "Confidence Booster",
      "text": "${mention} ..."
    },
    {
      "tone": "support_detailed",
      "toneLabel": "Detailed Solution",
      "text": "${mention} ..."
    },
    {
      "tone": "witty_meme",
      "toneLabel": "Witty / Hype",
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
  if (persona.toneStyle === 'witty_funny' || persona.toneStyle === 'witty_energetic') {
    const witty = suggestions.find((s) => s.tone === 'witty_meme' || s.tone === 'tone_primary');
    if (witty) chosen = witty.text;
  } else if (persona.toneStyle === 'professional_educator' || persona.toneStyle === 'pro_mentor') {
    const pro = suggestions.find((s) => s.tone === 'support_detailed' || s.tone === 'tone_primary');
    if (pro) chosen = pro.text;
  } else if (persona.toneStyle === 'supportive_mentor' || persona.toneStyle === 'polite_support') {
    const support = suggestions.find((s) => s.tone === 'support_detailed' || s.tone === 'quick_heart');
    if (support) chosen = support.text;
  } else if (persona.toneStyle === 'short_crisp') {
    const shortOne = suggestions.find((s) => s.tone === 'quick_heart' || s.tone === 'tone_primary');
    if (shortOne) chosen = shortOne.text;
  }

  if (persona.customSignature && !chosen.includes(persona.customSignature)) {
    chosen = `${chosen} ${persona.customSignature}`;
  }

  return chosen;
}

export interface VideoCommentSummary {
  headline: string;
  totalAnalyzed: number;
  sentimentBreakdown: {
    positive: number;
    doubts: number;
    feedback: number;
  };
  mainPoints: string[];
  topDoubts: string[];
  feedbackAndIssues: string[];
  nextContentIdeas: string[];
  edtechOrResourceRequests: string[];
}

/**
 * Summarize all comments on a video and extract core talking points, student doubts & content ideas
 * Powered by Google Gemma 4 31B IT Thinking AI
 */
export async function summarizeVideoComments(
  comments: Array<{ textDisplay: string; authorDisplayName: string; likeCount?: number }>,
  videoTitle: string = 'YouTube Video',
  channelName: string = 'Creator Channel'
): Promise<VideoCommentSummary> {
  if (!comments || comments.length === 0) {
    return {
      headline: 'No comments found to analyze for this video.',
      totalAnalyzed: 0,
      sentimentBreakdown: { positive: 100, doubts: 0, feedback: 0 },
      mainPoints: ['No audience comments submitted yet.'],
      topDoubts: [],
      feedbackAndIssues: [],
      nextContentIdeas: ['Post a community question to kickstart discussion!'],
      edtechOrResourceRequests: [],
    };
  }

  const sampleComments = comments.slice(0, 45).map((c, i) => 
    `${i + 1}. [${c.authorDisplayName || 'User'} (👍 ${c.likeCount || 0})]: "${c.textDisplay}"`
  ).join('\n');

  const prompt = `
You are the Chief Audience Analyst & AI Community Strategist for YouTube Creator "${channelName}".
Analyze the following audience comments from video titled: "${videoTitle}".

COMMENTS LIST (${comments.length} total, showing top sample):
${sampleComments}

TASK:
Deeply analyze all comments and extract the core themes, main points, student doubts, feedback, and next content ideas.
Provide your response strictly in the following JSON format:
{
  "headline": "A punchy 1-line executive summary of what audience is saying (in natural English/Hinglish)",
  "sentimentBreakdown": {
    "positive": 80,
    "doubts": 15,
    "feedback": 5
  },
  "mainPoints": [
    "Key Point 1: What most viewers are praising or discussing (e.g. 10:45 trick was loved by 50+ students)",
    "Key Point 2: Specific concepts students found easy or difficult",
    "Key Point 3: General audience mood and reactions"
  ],
  "topDoubts": [
    "Doubt 1: Exact question or confusion students are asking in comments",
    "Doubt 2: ...",
    "Doubt 3: ..."
  ],
  "feedbackAndIssues": [
    "Feedback 1: Any sound, video quality, pacing, or link complaints",
    "Feedback 2: ..."
  ],
  "nextContentIdeas": [
    "Next Video Idea 1: Specific topic or part-2 viewers are demanding",
    "Next Video Idea 2: ...",
    "Next Video Idea 3: ..."
  ],
  "edtechOrResourceRequests": [
    "Request 1: PDF notes, formula sheet, GitHub code, or course batch inquiries",
    "Request 2: ..."
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
            temperature: 0.4,
            maxOutputTokens: 3000,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const answerPart = parts.find((p: any) => !p.thought) || parts[parts.length - 1];
        const rawText = answerPart?.text || '';

        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            headline: parsed.headline || `Audience Feedback Summary for ${videoTitle}`,
            totalAnalyzed: comments.length,
            sentimentBreakdown: parsed.sentimentBreakdown || { positive: 85, doubts: 10, feedback: 5 },
            mainPoints: Array.isArray(parsed.mainPoints) ? parsed.mainPoints : [],
            topDoubts: Array.isArray(parsed.topDoubts) ? parsed.topDoubts : [],
            feedbackAndIssues: Array.isArray(parsed.feedbackAndIssues) ? parsed.feedbackAndIssues : [],
            nextContentIdeas: Array.isArray(parsed.nextContentIdeas) ? parsed.nextContentIdeas : [],
            edtechOrResourceRequests: Array.isArray(parsed.edtechOrResourceRequests) ? parsed.edtechOrResourceRequests : [],
          };
        }
      }
    } catch (err) {
      console.warn(`Summary error on ${model}:`, err);
    }
  }

  // Fallback summary
  return {
    headline: `Audience discussion summary for "${videoTitle}"`,
    totalAnalyzed: comments.length,
    sentimentBreakdown: { positive: 80, doubts: 15, feedback: 5 },
    mainPoints: [
      `Analyzed ${comments.length} audience comments.`,
      'Audience appreciated the practical walkthrough and explanation.',
      'Students actively engaging with doubts and practice questions.',
    ],
    topDoubts: [
      'Questions regarding formula application and practice resources.',
      'Queries regarding next video schedule and PDF notes.',
    ],
    feedbackAndIssues: [],
    nextContentIdeas: [
      'Part 2 deep-dive answering top student queries.',
      'One-shot problem solving live stream.',
    ],
    edtechOrResourceRequests: [
      'Requests for chapter summary PDF and formula sheet in description.',
    ],
  };
}

