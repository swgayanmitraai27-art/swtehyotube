'use client';

import React, { useState } from 'react';
import { YouTubeCommentItem, AIReplySuggestion } from '@/types';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Heart, 
  ThumbsUp, 
  MessageSquare, 
  HelpCircle, 
  ShieldAlert, 
  Smile, 
  RefreshCw,
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface CommentCardProps {
  comment: YouTubeCommentItem;
  onReplySuccess: (commentId: string, replyText: string) => void;
}

export default function CommentCard({ comment, onReplySuccess }: CommentCardProps) {
  const { user, profile } = useAuth();
  const [selectedSuggestion, setSelectedSuggestion] = useState<AIReplySuggestion | null>(
    comment.suggestions?.[0] || null
  );
  const [replyText, setReplyText] = useState(
    comment.suggestions?.[0]?.text || `@${comment.authorDisplayName.replace(/^@/, '')} `
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRepliedLocal, setIsRepliedLocal] = useState(comment.isReplied);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [customSuggestions, setCustomSuggestions] = useState<AIReplySuggestion[] | null>(null);

  const activeSuggestions = customSuggestions || comment.suggestions || [];

  const handleSelectSuggestion = (sug: AIReplySuggestion) => {
    setSelectedSuggestion(sug);
    setReplyText(sug.text);
  };

  const handleRegenerate = async () => {
    if (!user) return;
    try {
      setIsRegenerating(true);
      const res = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          commentText: comment.textDisplay,
          authorName: comment.authorDisplayName,
          videoTitle: comment.videoTitle,
          videoDescription: comment.videoDescription,
        }),
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setCustomSuggestions(data.suggestions);
        setSelectedSuggestion(data.suggestions[0]);
        setReplyText(data.suggestions[0].text);
      }
    } catch (err) {
      console.error('Failed to regenerate AI suggestions:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handlePostReply = async () => {
    if (!user || !replyText.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/youtube/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          commentId: comment.id,
          replyText: replyText.trim(),
          videoId: comment.videoId,
          authorName: comment.authorDisplayName,
          originalComment: comment.textDisplay,
          toneUsed: selectedSuggestion?.tone || 'manual',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to post reply');
      }

      setIsRepliedLocal(true);
      onReplySuccess(comment.id, replyText);
    } catch (err: any) {
      setError(err.message || 'Could not post to YouTube');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      isRepliedLocal
        ? 'bg-zinc-950/40 border-zinc-900 opacity-80'
        : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 shadow-lg'
    }`}>
      {/* Top Commenter Info */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {comment.authorProfileImageUrl ? (
            <img
              src={comment.authorProfileImageUrl}
              alt={comment.authorDisplayName}
              className="w-9 h-9 rounded-full object-cover border border-zinc-800"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
              {comment.authorDisplayName[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-zinc-100">{comment.authorDisplayName}</span>
              {comment.likeCount > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <ThumbsUp className="w-3 h-3 text-zinc-500" />
                  {comment.likeCount}
                </span>
              )}
            </div>
            <span className="text-[11px] text-zinc-400">
              {new Date(comment.publishedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        {isRepliedLocal ? (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Replied Live
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Unreplied
          </span>
        )}
      </div>

      {/* Original Comment Text */}
      <div className="bg-zinc-950/70 rounded-xl p-3.5 border border-zinc-800/60 mb-4 text-sm text-zinc-200 leading-relaxed font-normal">
        "{comment.textDisplay}"
      </div>

      {!isRepliedLocal && (
        <div className="space-y-3">
          {/* AI Suggestions Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Gemini 1.5 Flash Hinglish Suggestions:
            </span>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="text-[11px] text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          </div>

          {/* AI Suggestion Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeSuggestions.map((sug) => {
              const isSelected = selectedSuggestion?.id === sug.id;
              return (
                <button
                  key={sug.id}
                  onClick={() => handleSelectSuggestion(sug)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-rose-950/30 border-rose-500/50 text-rose-100 shadow-sm'
                      : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[10px] text-rose-400 uppercase tracking-wider">
                      {sug.toneLabel}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-rose-400" />}
                  </div>
                  <p className="line-clamp-2 leading-relaxed">{sug.text}</p>
                </button>
              );
            })}
          </div>

          {/* Reply Textarea & 1-Click Post */}
          <div className="mt-3">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type or customize your creator response..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none"
            />

            {error && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}

            <div className="flex items-center justify-between mt-2.5">
              <span className="text-[11px] text-zinc-500">
                Quota: <strong className="text-zinc-400">50 units</strong> | 1 Credit
              </span>
              <button
                onClick={handlePostReply}
                disabled={loading || !replyText.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-semibold shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Posting to YouTube...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Approve & Post to YouTube
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
