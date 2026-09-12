import { CreatorPersonaConfig } from '@/types';

export const YOUTUBE_QUOTA_COSTS = {
  READ_COMMENT_THREAD: 1,
  POST_REPLY: 50,
  DAILY_BASE_LIMIT: 10000,
};

export const DEFAULT_CREATOR_PERSONA: CreatorPersonaConfig = {
  channelName: 'Creator Channel',
  creatorName: 'Creator',
  category: 'edtech',
  languageMode: 'hinglish',
  toneStyle: 'pro_mentor',
  personaBio: 'Energetic Indian Creator who loves helping audience grow, values genuine feedback, and speaks in natural relatable Hinglish.',
  customSignature: '— SW Tech Solution Team ❤️',
  appDownloadLink: '',
  courseOrWebsiteLink: '',
  callToAction: 'Video pasand aayi toh like and share karna mat bhoolna!',
  customInstructions: '',
  customClientId: '',
  customClientSecret: '',
  customApiKey1: '',
  customClientId2: '',
  customClientSecret2: '',
  customApiKey2: '',
  customClientId3: '',
  customClientSecret3: '',
  customApiKey3: '',
  blacklistKeywords: [
    'sub4sub',
    'subscribe my channel',
    'free bitcoin',
    'telegram channel link',
    'whatsapp number',
    'check out my new video',
    '18+',
    'nude',
    'earn 10000 daily',
    'scammer',
    'fraud company',
    'bakwas channel',
    'chor hai',
    'gandu',
    'chutiya',
    'madarchod',
    'bhenchod',
    'bsdk',
    'harami'
  ],
  autoDeleteToxicComments: true,
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
  yearlyPrice: number; // 2 Months Free
  monthlyCredits: number;
  yearlyCredits: number;
  features: string[];
}

export const INDIAN_TIER_PLANS: IndianPricingTier[] = [
  {
    id: 'starter',
    name: '🚀 Starter (Value King)',
    badge: 'Micro Creators',
    idealFor: 'New & Micro Creators (10k-50k Subs)',
    monthlyPrice: 499,
    yearlyPrice: 4990, // Pay 10 months, get 12 months (2 Months Free)
    monthlyCredits: 2000, // 2,000 replies / mo
    yearlyCredits: 24000,
    features: [
      '2,000 AI Replies / Month (24,000/yr)',
      '1-Time 1-on-1 Live 5-Min Video Setup Call (Google Cloud Setup 📞)',
      '1-Click YouTube Connect + BYOK Quota Support',
      'Google Gemma 4 31B Multi-Lingual Engine (140+ Languages)',
      'Copilot Review Mode & Instant Post',
      'Spam & Emoji Pre-Filter Protection'
    ]
  },
  {
    id: 'pro',
    name: '🔥 Pro (Market Grabber)',
    badge: 'Best Value',
    popular: true,
    idealFor: 'Growing Creators (50k-300k Subs)',
    monthlyPrice: 999,
    yearlyPrice: 9990, // 2 Months Free
    monthlyCredits: 4000, // 4,000 replies / mo
    yearlyCredits: 48000,
    features: [
      '4,000 AI Replies / Month (48,000/yr)',
      '1-Time 1-on-1 Live 5-Min Video Setup Call (Founder Direct 📞)',
      'Full 24/7 Hands-Free Auto-Pilot Mode',
      'AI Toxic & Abusive Comment Auto-Delete',
      'Dedicated BYOK Google Cloud Quota Integration',
      'Auto-Mention @username Integration',
      'Custom Promotional CTA & Batch Links'
    ]
  },
  {
    id: 'enterprise',
    name: '👑 Enterprise (The Vidyakul Special)',
    badge: 'Big Creators & Institutes',
    idealFor: 'Big Creators / Institutes & Agencies (300k+ Subs)',
    monthlyPrice: 2499,
    yearlyPrice: 24990, // 2 Months Free
    monthlyCredits: 8000, // 8,000 replies / mo
    yearlyCredits: 96000,
    features: [
      '8,000 AI Replies / Month (96,000/yr)',
      '1-Time 1-on-1 Live VIP Video Setup Call (Founder Direct 📞)',
      'Multi-Channel Linking (Up to 6 Channels)',
      'Advanced Toxic / Hate Speech Auto-Purge',
      'Multi-Project BYOK Unlimited Quota Architecture',
      'Direct WhatsApp VIP Priority Setup Support',
      'Custom Promotional Call-To-Action Embedding'
    ]
  }
];

export const CREDIT_PACKS = [
  { id: 'pack_200', name: '200 Extra Credits', credits: 200, price: 99 },
  { id: 'pack_600', name: '600 Extra Credits', credits: 600, price: 249 },
  { id: 'pack_2000', name: '2,000 Extra Credits', credits: 2000, price: 499 },
  { id: 'pack_5000', name: '5,000 Extra Credits', credits: 5000, price: 1199 },
];
