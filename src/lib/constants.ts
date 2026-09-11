import { CreatorPersonaConfig, PricingPlan } from '@/types';

export const YOUTUBE_QUOTA_COSTS = {
  READ_COMMENT_THREAD: 1,
  POST_REPLY: 50,
  DAILY_BASE_LIMIT: 10000,
};

export const DEFAULT_CREATOR_PERSONA: CreatorPersonaConfig = {
  channelName: 'Creator Channel',
  creatorName: 'Creator',
  languageMode: 'hinglish',
  toneStyle: 'friendly_bro',
  personaBio: 'Energetic Indian Tech & Coding YouTuber who loves helping his audience grow, values genuine feedback, and speaks in natural relatable Hinglish.',
  customSignature: '— SW Tech Solution Team ❤️',
  promotionalLink: '',
  callToAction: 'Video pasand aayi toh like and share karna mat bhoolna!',
  blacklistKeywords: [
    'sub4sub',
    'subscribe my channel',
    'free bitcoin',
    'telegram channel link',
    'whatsapp number',
    'check out my new video',
    '18+',
    'nude',
    'earn 10000 daily'
  ],
  autoLikeOnReply: true,
  filterEmojiOnly: true,
  filterRepetitiveSpam: true,
  minCommentLength: 3,
};

export interface IndianPricingTier {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  idealFor: string;
  monthlyPrice: number;
  yearlyPrice: number; // 2 Months Free discount
  monthlyCredits: number;
  yearlyCredits: number;
  features: string[];
}

export const INDIAN_TIER_PLANS: IndianPricingTier[] = [
  {
    id: 'starter',
    name: '🚀 Starter',
    badge: 'Micro Creators',
    idealFor: 'New/Micro Creators (10k-50k Subs)',
    monthlyPrice: 499,
    yearlyPrice: 4990, // Pay 10 months, get 12 months (2 Months Free)
    monthlyCredits: 500,
    yearlyCredits: 6000,
    features: [
      '500 AI Replies / Month (6,000/yr)',
      '1-Click YouTube Connect',
      'Hinglish AI Natural Tone Engine',
      'Copilot Review Mode',
      'Basic Analytics & History',
      'Standard Rate Limiting'
    ]
  },
  {
    id: 'pro',
    name: '🔥 Pro',
    badge: 'Best Value',
    popular: true,
    idealFor: 'Growing Creators (50k-300k Subs)',
    monthlyPrice: 999,
    yearlyPrice: 9990, // 2 Months Free
    monthlyCredits: 1500,
    yearlyCredits: 18000,
    features: [
      '1,500 AI Replies / Month (18,000/yr)',
      'Full Auto-Pilot Hands-Free Mode',
      'Smart Filter (Skip Emoji-Only & Save Quota)',
      'Custom Brand Voice (Friendly / Polite / Funny)',
      'Auto-Mention @username Integration',
      'Priority Fast Gemini 1.5 Flash Queue',
      '24/7 Background Comment Sync'
    ]
  },
  {
    id: 'enterprise',
    name: '👑 Enterprise / Elite',
    badge: 'Big Creators & Agencies',
    idealFor: 'Big Creators / Agencies (300k+ Subs)',
    monthlyPrice: 2499,
    yearlyPrice: 24990, // 2 Months Free
    monthlyCredits: 4000,
    yearlyCredits: 48000,
    features: [
      '4,000 AI Replies / Month (48,000/yr)',
      'Multi-Channel Linking (Up to 3 Channels)',
      'Sentiment Analysis (Auto-Filter Toxic / Hate Comments)',
      'Custom Finetuned Channel Persona',
      'Dedicated Quota Management Guard',
      'Direct WhatsApp 24/7 Priority Support',
      'Custom Promotional CTA & Link Embedding'
    ]
  }
];

export const CREDIT_PACKS = [
  { id: 'pack_200', name: '200 Extra Credits', credits: 200, price: 99 },
  { id: 'pack_600', name: '600 Extra Credits', credits: 600, price: 249 },
  { id: 'pack_1500', name: '1,500 Extra Credits', credits: 1500, price: 499 },
  { id: 'pack_4000', name: '4,000 Extra Credits', credits: 4000, price: 1199 },
];
