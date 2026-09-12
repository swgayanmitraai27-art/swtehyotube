import { CreatorPersonaConfig } from '@/types';

/**
 * Checks if a string is purely emojis and whitespace
 */
export function isEmojiOnly(text: string): boolean {
  if (!text) return true;
  // Strip all emojis, symbols, and whitespace
  const stripped = text.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Component}\s\d\p{Punctuation}]/gu, '');
  return stripped.trim().length === 0;
}

/**
 * Checks if comment matches blacklist or common spam patterns
 */
export function containsBlacklistedWords(text: string, blacklist: string[]): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return blacklist.some((word) => lower.includes(word.toLowerCase().trim()));
}

/**
 * Checks for repetitive character spam (e.g. "hiiiiiiiiiiiiiiiiiii")
 */
export function isRepetitiveSpam(text: string): boolean {
  if (!text) return false;
  const repetitiveRegex = /(.)\1{6,}/i; // 7 or more repeating characters
  return repetitiveRegex.test(text);
}

/**
 * Checks for abusive, toxic, or defamatory words
 */
const ABUSIVE_PATTERNS = [
  /\b(gandu|chutiya|madarchod|bhenchod|behenchod|bsdk|harami|kutta|kutte|tatti|scam|scammer|fraud|chor|chutiye)\b/i,
  /\b(fuck|bitch|bastard|asshole|idiot|crap|motherfucker)\b/i,
];

export function isToxicOrAbusive(text: string, customBlacklist: string[] = []): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  if (ABUSIVE_PATTERNS.some((pattern) => pattern.test(lower))) {
    return true;
  }
  return containsBlacklistedWords(text, customBlacklist);
}

export interface FilterResult {
  shouldReply: boolean;
  isToxic?: boolean;
  reason?: string;
  category: 'valid' | 'emoji_only' | 'spam' | 'too_short' | 'blacklisted' | 'toxic_abusive' | 'self_comment';
}

/**
 * Evaluates whether a comment is worth spending 50 YouTube quota write units on
 */
export function evaluateCommentEligibility(
  commentText: string,
  authorChannelId: string,
  ownerChannelId: string,
  persona: CreatorPersonaConfig
): FilterResult {
  // 1. Never reply to creator's own comment
  if (authorChannelId && ownerChannelId && authorChannelId === ownerChannelId) {
    return {
      shouldReply: false,
      reason: "Skipping creator's own comment",
      category: 'self_comment',
    };
  }

  const cleanText = commentText.trim();

  // 2. Toxic / Abusive Check (Highest Priority for Channel Protection)
  if (isToxicOrAbusive(cleanText, persona.blacklistKeywords || [])) {
    return {
      shouldReply: false,
      isToxic: true,
      reason: 'Contains abusive, hate, or defamatory language',
      category: 'toxic_abusive',
    };
  }

  // 3. Minimum length check
  if (cleanText.length < (persona.minCommentLength || 2)) {
    return {
      shouldReply: false,
      reason: 'Comment is shorter than minimum configured length',
      category: 'too_short',
    };
  }

  // 4. Emoji-only filter
  if (persona.filterEmojiOnly && isEmojiOnly(cleanText)) {
    return {
      shouldReply: false,
      reason: 'Comment contains only emojis (saved 50 quota units)',
      category: 'emoji_only',
    };
  }

  // 5. Repetitive spam
  if (persona.filterRepetitiveSpam && isRepetitiveSpam(cleanText)) {
    return {
      shouldReply: false,
      reason: 'Detected repetitive spam patterns',
      category: 'spam',
    };
  }

  return {
    shouldReply: true,
    isToxic: false,
    category: 'valid',
  };
}

