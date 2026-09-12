export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export type ChannelCategory = 
  | 'edtech'             // Education / Online Coaching / Courses / Classes
  | 'tech'               // Coding / Software / Gadgets
  | 'finance'            // Trading / Investing / Crypto
  | 'gaming'             // Esports / Live Streaming
  | 'vlog_lifestyle'     // Daily Vlogs / Food / Travel
  | 'business_consulting';// Real Estate / B2B / Sales

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  channelId?: string;
  channelTitle?: string;
  channelThumbnail?: string;
  subscriberCount?: number;
  credits: number;
  plan: PlanType;
  billingCycle?: BillingCycle;
  planExpiresAt?: number;
  autoPilotEnabled: boolean;
  onboardingCompleted?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface YouTubeTokens {
  accessToken: string;
  refreshToken: string;
  expiryDate?: number;
  scope?: string;
  tokenType?: string;
}

export interface YouTubeChannelInfo {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnailUrl: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export interface YouTubeVideoSummary {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  commentCount: number;
}

export type CommentSentiment = 'positive' | 'question' | 'feedback' | 'criticism' | 'spam' | 'neutral';
export type CommentIntent = 'appreciation' | 'inquiry' | 'feature_request' | 'brand_mention' | 'troll' | 'general';

export interface AIReplySuggestion {
  id: string;
  tone: 'hinglish_friendly' | 'quick_heart' | 'support_detailed' | 'witty_meme' | 'promotional_cta';
  toneLabel: string;
  text: string;
  autoMentioned: string;
}

export interface YouTubeCommentItem {
  id: string;
  threadId: string;
  videoId: string;
  videoTitle?: string;
  videoDescription?: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  authorChannelUrl?: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
  isReplied: boolean;
  repliedAt?: number;
  repliedText?: string;
  status: 'unreplied' | 'replied' | 'filtered_out' | 'skipped';
  sentiment?: CommentSentiment;
  intent?: CommentIntent;
  suggestions?: AIReplySuggestion[];
}

export interface CommonFAQ {
  keywords: string;
  autoAnswer: string;
}

export interface CreatorPersonaConfig {
  channelName: string;
  creatorName: string;
  category: ChannelCategory;
  languageMode:
    | 'hinglish'
    | 'hindi'
    | 'gujarati'
    | 'bhojpuri'
    | 'bengali'
    | 'marathi'
    | 'tamil'
    | 'telugu'
    | 'punjabi'
    | 'urdu'
    | 'english'
    | 'spanish'
    | 'french'
    | 'german'
    | 'japanese'
    | 'arabic'
    | 'auto';
  toneStyle: 'friendly_bro' | 'pro_mentor' | 'witty_energetic' | 'polite_support';
  personaBio: string;
  appName?: string;              // e.g. "Official App / Course App"
  appDownloadLink?: string;      // e.g. "https://play.google.com/store/apps/..."
  courseOrWebsiteLink?: string;  // e.g. Batch enrollment link
  targetAudience?: string;       // e.g. "Class 9th to 12th Board Exam Students"
  customSignature?: string;
  callToAction?: string;
  customInstructions?: string;   // Creator's custom rules e.g. "Always start with Radhe Radhe, promote batch link"
  commonFaqs?: CommonFAQ[];
  blacklistKeywords: string[];
  autoDeleteToxicComments: boolean; // Auto-deletes abusive/hate comments from YouTube
  autoLikeOnReply: boolean;
  filterEmojiOnly: boolean;
  filterRepetitiveSpam: boolean;
  minCommentLength: number;
}

export interface AutoPilotLog {
  id: string;
  commentId: string;
  videoId: string;
  authorName: string;
  originalComment: string;
  replyText: string;
  toneUsed: string;
  status: 'success' | 'failed' | 'skipped';
  reason?: string;
  timestamp: number;
}

export interface QuotaTracker {
  readsToday: number;
  writesToday: number;
  totalUnitsToday: number;
  dailyLimit: number;
  lastResetDate: string;
}
