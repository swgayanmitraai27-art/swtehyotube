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
  maxCommentAgeHours: 48,
};

export type CurrencyType = 'USD' | 'INR';

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  idealFor: string;
  monthlyPriceUSD: number;
  yearlyPriceUSD: number; // 2 Months Free ($190 vs $228, $390 vs $468, $990 vs $1188)
  monthlyPriceINR: number;
  yearlyPriceINR: number; // 2 Months Free
  monthlyPrice: number; // alias for backwards compatibility
  yearlyPrice: number;
  monthlyCredits: number;
  yearlyCredits: number;
  highlightFeature?: string;
  features: string[];
}

export const INDIAN_TIER_PLANS: PricingTier[] = [
  {
    id: 'starter',
    name: '🚀 Starter Plan',
    badge: 'Starter',
    idealFor: 'Creators & Growing Channels (10k-50k Subs)',
    monthlyPriceUSD: 19,
    yearlyPriceUSD: 190, // $15.8/mo (2 Months Free)
    monthlyPriceINR: 499,
    yearlyPriceINR: 4990,
    monthlyPrice: 499,
    yearlyPrice: 4990,
    monthlyCredits: 2000, // 2,000 replies / mo
    yearlyCredits: 24000,
    features: [
      '2,000 AI Replies / Month (24,000/yr)',
      '1-Click YouTube Connect (Instant Sync)',
      'Google Gemma 4 31B AI Engine (140+ Languages)',
      'BYOK Google Cloud Quota Support',
      '1-Time 1-on-1 Live 5-Min Video Setup Call (📞)',
      'Copilot Review Mode & Instant Auto-Post'
    ]
  },
  {
    id: 'pro',
    name: '🔥 Pro Plan (Best Value)',
    badge: '🔥 Best Value • Most Popular',
    popular: true,
    idealFor: 'High-Growth Channels & Global Creators (50k-300k Subs)',
    monthlyPriceUSD: 39,
    yearlyPriceUSD: 390, // $32.5/mo (2 Months Free)
    monthlyPriceINR: 999,
    yearlyPriceINR: 9990,
    monthlyPrice: 999,
    yearlyPrice: 9990,
    monthlyCredits: 4000, // 4,000 replies / mo
    yearlyCredits: 48000,
    highlightFeature: '🛡️ Auto-Delete Toxic, Abusive & Spam Comments 24/7',
    features: [
      '🛡️ Auto-Delete Toxic, Abusive & Spam Comments 24/7 (High Priority)',
      '4,000 AI Replies / Month (48,000/yr)',
      '24/7 Hands-Free Auto-Pilot Mode (No tab needs to be open)',
      'Smart @username Auto-Mention & App Promotion Links',
      'Dedicated BYOK Multi-Project Quota Integration',
      '1-Time 1-on-1 Live Video Setup Call with Founder (📞)'
    ]
  },
  {
    id: 'enterprise',
    name: '👑 Enterprise Plan',
    badge: 'Large Teams & Global MCNs',
    idealFor: 'Large Creators, Media Networks & Coaching Institutes (300k+ Subs)',
    monthlyPriceUSD: 99,
    yearlyPriceUSD: 990, // $82.5/mo (2 Months Free)
    monthlyPriceINR: 2499,
    yearlyPriceINR: 24990,
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    monthlyCredits: 8000, // 8,000 replies / mo
    yearlyCredits: 96000,
    highlightFeature: '🛡️ Advanced AI Toxic, Scam & Hate Speech Auto-Purge',
    features: [
      '🛡️ Advanced AI Toxic, Scam & Hate Speech Auto-Purge (Zero Spam)',
      '8,000 AI Replies / Month (96,000/yr)',
      'Multi-Channel Linking (Up to 6 YouTube Channels)',
      'Multi-Project BYOK Unlimited Quota Architecture',
      'Direct WhatsApp & VIP Screen Share Setup Support',
      '1-on-1 Dedicated Strategy & Onboarding Call (📞)'
    ]
  },
  {
    id: 'custom_bulk',
    name: '💼 Custom Bulk / VIP Calling Plan',
    badge: 'Custom Volume & Direct Call',
    idealFor: 'Large Coaching Institutes, Media Houses & Agencies (20k to 5,00,000+ Replies)',
    monthlyPriceUSD: 0,
    yearlyPriceUSD: 0,
    monthlyPriceINR: 0, // Custom Quote
    yearlyPriceINR: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyCredits: 50000,
    yearlyCredits: 600000,
    features: [
      'Custom AI Reply Volume (20,000 to 5,00,000+ / Month)',
      'Direct Phone & WhatsApp Calling (Founder: +91 8303994616 📞)',
      '1-on-1 VIP Screen Share Setup & Google Cloud Architecture',
      'Unlimited Multi-Channel Support & MCN Linking',
      'Dedicated High-Speed Gemma 4 31B AI Cloud Instance',
      'Custom Promotional Call-To-Action & Fine-Tuning'
    ]
  }
];

export const CREDIT_PACKS = [
  { id: 'pack_200', name: '200 Extra Credits', credits: 200, priceINR: 99, priceUSD: 3, price: 99 },
  { id: 'pack_600', name: '600 Extra Credits', credits: 600, priceINR: 249, priceUSD: 8, price: 249 },
  { id: 'pack_2000', name: '2,000 Extra Credits', credits: 2000, priceINR: 499, priceUSD: 15, price: 499 },
  { id: 'pack_5000', name: '5,000 Extra Credits', credits: 5000, priceINR: 1199, priceUSD: 35, price: 1199 },
];
