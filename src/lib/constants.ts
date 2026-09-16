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
  monthlyPrice: number; // in INR (₹499, ₹999, ₹1999)
  yearlyPrice: number; // in INR (₹4990, ₹9990, ₹19990 - 2 Months Free)
  monthlyCredits: number;
  yearlyCredits: number;
  highlightFeature?: string;
  competitorAdvantage?: string;
  features: string[];
}

export const INDIAN_TIER_PLANS: PricingTier[] = [
  {
    id: 'starter',
    name: '🟢 Starter Plan',
    badge: 'Chhote Channels',
    idealFor: 'Chhote creators ke liye jinke hafte mein 1-2 videos aate hain',
    monthlyPrice: 499,
    yearlyPrice: 4990, // ₹415/mo (2 Months Free)
    monthlyCredits: 1200, // 1,200 replies / mo
    yearlyCredits: 14400,
    highlightFeature: '⚡ Up to 1,200 AI Replies / month (Single Project Setup)',
    competitorAdvantage: '💡 ₹499 me 1,200 Real AI Replies + Instant UPI Payment!',
    features: [
      'Up to 1,200 AI Replies / Month (14,400/yr)',
      '⚡ Instant UPI (Google Pay, PhonePe, Paytm, QR) & Cards',
      '1 Google Cloud Project Setup (10,000 Daily Quota Units)',
      '1-Click YouTube Channel Connect (OAuth 2.0)',
      '24/7 Hands-Free Auto-Pilot Mode',
      'Google Gemma 4 31B AI Engine (Relatable Hinglish & English)',
      '🛡️ Auto-Delete Toxic & Spam Comments 24/7',
      'Smart @username Auto-Mention & Course/App Link Placement',
      '1-Time 1-on-1 Live Video Setup Call with Founder (📞)'
    ]
  },
  {
    id: 'growth',
    name: '👑 Growth Plan (Main Target)',
    badge: '🔥 Most Popular • Best Value',
    popular: true,
    idealFor: 'Mid-tier creators ke liye (Safe, highly profitable & high-growth zone)',
    monthlyPrice: 999,
    yearlyPrice: 9990, // ₹832/mo (2 Months Free)
    monthlyCredits: 2200, // 2,200 replies / mo
    yearlyCredits: 26400,
    highlightFeature: '🚀 Up to 2,200 AI Replies / month (Safe & Profitable Zone)',
    competitorAdvantage: '🏆 Best Value in India: 2,200 AI Replies with Smart Multi-Project Balancing!',
    features: [
      'Up to 2,200 AI Replies / Month (26,400/yr)',
      '⚡ Instant UPI (GPay, PhonePe, Paytm, QR) & NetBanking',
      '🚀 Twin-Project Architecture (20,000 Daily Quota Units)',
      '⚡ Intelligent Auto-Switch Quota Balancing (Zero Quota Exhaustion)',
      '24/7 Multi-Project Hands-Free Auto-Pilot Mode',
      '🛡️ Advanced AI Toxic, Scam & Harassment Auto-Purge',
      'Smart @username Auto-Mention & App Download Conversions',
      'Priority VIP 1-on-1 Live Video Setup Call with Founder (📞)'
    ]
  },
  {
    id: 'pro',
    name: '🚀 Pro Plan (Bade Channels)',
    badge: 'Heavy Traffic Channels',
    idealFor: 'Bade YouTube Channels (Extreme peak volume & heavy rush)',
    monthlyPrice: 1999,
    yearlyPrice: 19990, // ₹1,665/mo (2 Months Free)
    monthlyCredits: 4200, // 4,200 replies / mo
    yearlyCredits: 50400,
    highlightFeature: '⚡ Up to 4,200 AI Replies / month + Advanced AI Spam Filter',
    competitorAdvantage: '🚀 Extreme Peak Quota Limit (4,200 Replies) + Full Spam Protection',
    features: [
      'Up to 4,200 AI Replies / Month (50,400/yr)',
      '⚡ Extreme Peak Quota Handling (Up to 4,200 Replies)',
      '🛡️ Advanced Real-time Toxic, Scam & Hate Speech Auto-Purge',
      '3-Project Automated Credential Framework',
      'Multi-Channel Linking Support',
      '24/7 Dedicated Hands-Free Auto-Pilot Engine',
      'Dedicated WhatsApp VIP Setup & Strategy Support',
      '1-on-1 Dedicated Scaling & Onboarding Call with Founder (📞)'
    ]
  }
];

export const CUSTOM_ENTERPRISE_PLAN = {
  id: 'custom_bulk',
  name: '💼 Custom / DFY Enterprise',
  badge: "Let's Talk",
  idealFor: 'Full Done-For-You (DFY) layout with dedicated server nodes (Large Media Networks, Coaching Institutes & Agencies)',
  monthlyPrice: 0, // Custom Quote (Let's Talk)
  yearlyPrice: 0,
  monthlyCredits: 50000,
  yearlyCredits: 600000,
  highlightFeature: 'Full Done-For-You (DFY) layout with dedicated server nodes',
  competitorAdvantage: '🏢 Custom enterprise infrastructure with dedicated server instance & white-glove DFY setup',
  features: [
    'Unlimited / Custom Monthly AI Reply Volume (10k - 5,00,000+)',
    'Full Done-For-You (DFY) layout with dedicated server nodes',
    'Direct Phone & WhatsApp Setup (Founder: +91 8303994616 📞)',
    '1-on-1 VIP Screen Share Setup & Google Cloud Architecture',
    'Unlimited Multi-Channel Support & MCN Linking',
    'Dedicated High-Speed Gemma 4 31B AI Cloud Instance',
    'Custom Promotional Call-To-Action & Fine-Tuning'
  ]
};

export const CREDIT_PACKS = [
  { id: 'pack_250', name: '250 Extra Credits', credits: 250, price: 149 },
  { id: 'pack_600', name: '600 Extra Credits', credits: 600, price: 299 },
  { id: 'pack_1500', name: '1,500 Extra Credits', credits: 1500, price: 699 },
  { id: 'pack_3500', name: '3,500 Extra Credits', credits: 3500, price: 1499 },
];

export const REDIRECT_URI_PROD = 'https://swgayanbhumi.in/api/auth/google-callback';

