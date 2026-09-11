'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CommentCard from '@/components/dashboard/CommentCard';
import { YouTubeCommentItem } from '@/types';
import { 
  MessageSquareReply, 
  RefreshCw, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Youtube
} from 'lucide-react';

export default function CommentsStudioPage() {
  const { user, isYouTubeConnected, connectYouTubeChannel, refreshProfile } = useAuth();
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId') || undefined;

  const [comments, setComments] = useState<YouTubeCommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'unreplied' | 'replied'>('unreplied');
  const [repliedCount, setRepliedCount] = useState(0);

  const loadComments = async () => {
    if (!user || !isYouTubeConnected) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const query = new URLSearchParams({
        uid: user.uid,
        ...(videoId ? { videoId } : {}),
      });

      const res = await fetch(`/api/youtube/comments?${query.toString()}`);
      const data = await res.json();
      if (data.success && data.comments) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [user, isYouTubeConnected, videoId]);

  const handleReplySuccess = (commentId: string, replyText: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, isReplied: true, status: 'replied' as const, repliedText: replyText }
          : c
      )
    );
    setRepliedCount((c) => c + 1);
    refreshProfile();
  };

  const filteredComments = comments.filter((c) => {
    if (filterMode === 'unreplied') return !c.isReplied && c.status !== 'filtered_out';
    if (filterMode === 'replied') return c.isReplied;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquareReply className="w-5 h-5 text-rose-500" />
            Live Comments & 1-Click AI Reply Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {videoId ? `Filtering comments for video: ${videoId}` : 'Real-time unreplied comments across your connected channel.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterMode('unreplied')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterMode === 'unreplied' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Unreplied ({comments.filter((c) => !c.isReplied && c.status !== 'filtered_out').length})
            </button>
            <button
              onClick={() => setFilterMode('replied')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterMode === 'replied' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Replied
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterMode === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
          </div>

          {/* Refresh Comments Button */}
          <button
            onClick={loadComments}
            disabled={loading}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
            title="Refresh Live Comments"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {!isYouTubeConnected ? (
        <div className="p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
            <Youtube className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Connect Channel to Fetch Comments</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Click below to connect your YouTube channel and start replying to audience comments with Gemini 1.5 Flash.
          </p>
          <button
            onClick={connectYouTubeChannel}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 hover:scale-105 transition-all"
          >
            1-Click Connect Channel
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 animate-pulse" />
          ))}
        </div>
      ) : filteredComments.length > 0 ? (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onReplySuccess={handleReplySuccess}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-3xl bg-zinc-900/20 border border-zinc-800/60 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">All Caught Up! 🎉</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            No unreplied comments found. Check back after your next video upload or switch filter to view past replied comments.
          </p>
        </div>
      )}
    </div>
  );
}
