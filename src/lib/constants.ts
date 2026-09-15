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

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  idealFor: string;
  monthlyPrice: number; // in USD ($39, $49, $99)
  yearlyPrice: number; // in USD ($390, $490, $990 - 2 Months Free)
  monthlyCredits: number;
  yearlyCredits: number;
  highlightFeature?: string;
  competitorAdvantage?: string;
  features: string[];
}

export const INDIAN_TIER_PLANS: PricingTier[] = [
  {
    id: 'standard',
    name: '⚡ Starter Scale',
    badge: 'Starter Scale',
    idealFor: 'Growing YouTube Channels & Creators (10k-50k Subs)',
    monthlyPrice: 39,
    yearlyPrice: 390, // $32.5/mo (2 Months Free)
    monthlyCredits: 3000, // 3,000 replies / mo
    yearlyCredits: 36000,
    highlightFeature: '⚡ 1 Google Cloud Project (10,000 Daily Quota Units)',
    competitorAdvantage: '💡 $10 Cheaper + Double Replies (3k) vs Competitor $49 Plan!',
    features: [
      '3,000 AI Replies / Month (36,000/yr)',
      '💥 2x More Replies than Competitors ($10 cheaper than their $49 tier)',
      '1 Google Cloud Project Architecture (10,000 Daily Quota Units)',
      '1-Click YouTube Connect (Instant Sync)',
      '24/7 Hands-Free Auto-Pilot Mode',
      'Google Gemma 4 31B AI Engine (140+ Languages)',
      '🛡️ Auto-Delete Toxic & Spam Comments 24/7',
      'Smart @username Auto-Mention & Product Links',
      '1-Time 1-on-1 Live Video Setup Call with Founder (📞)'
    ]
  },
  {
    id: 'premium',
    name: '🔥 Creator Scale (Twin-Project)',
    badge: '🔥 Best Value • Most Popular',
    popular: true,
    idealFor: 'High-Growth Creators & Heavy Comment Channels (50k-300k Subs)',
    monthlyPrice: 49,
    yearlyPrice: 490, // $40.8/mo (2 Months Free)
    monthlyCredits: 6000, // 6,000 replies / mo (Using Twin-Project)
    yearlyCredits: 72000,
    highlightFeature: '🚀 Twin-Project Architecture (20,000 Daily Quota Units with Auto-Switch)',
    competitorAdvantage: '🏆 $90 Cheaper & MORE Replies (6k) than Competitor $139 Plan!',
    features: [
      '6,000 AI Replies / Month (72,000/yr)',
      '💥 $90 Cheaper than Competitor $139 plan + MORE replies!',
      '🚀 Twin-Project Architecture (2 Google Cloud Projects -> 20,000 Daily Quota)',
      '⚡ Intelligent Auto-Switch Quota Balancing (Zero Quota Exhaustion)',
      '24/7 Multi-Project Hands-Free Auto-Pilot Mode',
      '🛡️ Advanced AI Toxic, Scam & Harassment Auto-Purge',
      'Smart @username Auto-Mention & High-Converting Link Attachments',
      'Priority VIP 1-on-1 Live Video Setup Call with Founder (📞)'
    ]
  },
  {
    id: 'enterprise',
    name: '👑 Pro / Agency',
    badge: 'Heavy Rush Channels & MCNs',
    idealFor: 'Large Creators, Media Networks & Creator Agencies (300k+ Subs)',
    monthlyPrice: 99,
    yearlyPrice: 990, // $82.5/mo (2 Months Free)
    monthlyCredits: 15000, // 15,000 replies / mo
    yearlyCredits: 180000,
    highlightFeature: '⚡ 3-Project automated credential framework built for heavy rush channels',
    competitorAdvantage: '🚀 3-Project automated credential framework (30k daily units) + 6 Channel Linking',
    features: [
      '15,000 AI Replies / Month (180,000/yr)',
      '⚡ 3-Project automated credential framework built for heavy rush channels',
      'Multi-Channel Linking (Up to 6 YouTube Channels)',
      '30,000+ Daily Quota Units with Smart Auto-Switch Balancing',
      '🛡️ Maximum AI Toxic, Scam & Hate Speech Auto-Purge (Zero Spam)',
      'Dedicated WhatsApp VIP Setup & Strategy Support',
      '1-on-1 Dedicated Scaling & Onboarding Call with Founder (📞)'
    ]
  },
  {
    id: 'custom_bulk',
    name: '💼 Custom / DFY Enterprise',
    badge: "Let's Talk",
    idealFor: 'Full Done-For-You (DFY) layout with dedicated server nodes (Large Networks & Agencies)',
    monthlyPrice: 0, // Custom Quote (Let's Talk)
    yearlyPrice: 0,
    monthlyCredits: 100000,
    yearlyCredits: 1200000,
    highlightFeature: 'Full Done-For-You (DFY) layout with dedicated server nodes',
    competitorAdvantage: '🏢 Custom enterprise infrastructure with dedicated server instance & white-glove DFY setup',
    features: [
      'Unlimited / Custom Monthly AI Reply Volume',
      'Full Done-For-You (DFY) layout with dedicated server nodes',
      'Direct Phone & WhatsApp Setup (Founder: +91 8303994616 📞)',
      '1-on-1 VIP Screen Share Setup & Google Cloud Architecture',
      'Unlimited Multi-Channel Support & MCN Linking',
      'Dedicated High-Speed Gemma 4 31B AI Cloud Instance',
      'Custom Promotional Call-To-Action & Fine-Tuning'
    ]
  }
];

export const CREDIT_PACKS = [
  { id: 'pack_200', name: '200 Extra Credits', credits: 200, price: 3 },
  { id: 'pack_600', name: '600 Extra Credits', credits: 600, price: 8 },
  { id: 'pack_2000', name: '2,000 Extra Credits', credits: 2000, price: 15 },
  { id: 'pack_5000', name: '5,000 Extra Credits', credits: 5000, price: 35 },
];
