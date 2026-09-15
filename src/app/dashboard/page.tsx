'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AutoPilotSwitch from '@/components/dashboard/AutoPilotSwitch';
import { 
  Youtube, 
  Sparkles, 
  MessageSquareReply, 
  Users, 
  Film, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  AlertCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { YouTubeVideoSummary } from '@/types';

export default function DashboardOverviewPage() {
  const { user, profile, isYouTubeConnected, connectYouTubeChannel } = useAuth();
  const [videos, setVideos] = useState<YouTubeVideoSummary[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  useEffect(() => {
    if (!user || !isYouTubeConnected) return;

    const loadChannelData = async () => {
      try {
        setLoadingVideos(true);
        const res = await fetch(`/api/youtube/channel?uid=${user.uid}`);
        const data = await res.json();
        if (data.success && data.videos) {
          setVideos(data.videos);
        }
      } catch (err) {
        console.error('Failed to load channel videos:', err);
      } finally {
        setLoadingVideos(false);
      }
    };

    loadChannelData();
  }, [user, isYouTubeConnected]);

  return (
    <div className="space-y-8">
      {/* Top Banner / Channel Status */}
      {!isYouTubeConnected ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-red-950/20 to-zinc-900 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/30">
              <Youtube className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Connect Your YouTube Channel</h2>
              <p className="text-xs text-zinc-400 mt-0.5 max-w-xl leading-relaxed">
                Connect your YouTube channel in 1 click to let Google Gemma 4 31B IT Thinking AI analyze comments and post intelligent replies automatically. No GCP setup needed.
              </p>
            </div>
          </div>
          <button
            onClick={connectYouTubeChannel}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition-all shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Connect Channel (1-Click)
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {profile?.channelThumbnail ? (
              <img
                src={profile.channelThumbnail}
                alt={profile.channelTitle}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-500/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white font-bold text-lg">
                YT
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{profile?.channelTitle}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Channel Linked
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {(profile?.subscriberCount || 0).toLocaleString()} Subscribers • Auto-reply engine ready
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/playground"
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-zinc-700/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              AI Playground
            </Link>
            <Link
              href="/dashboard/comments"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-rose-600/20"
            >
              <MessageSquareReply className="w-4 h-4" />
              Open Comments Feed
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Credits */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Available Credits</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{profile?.credits ?? 0}</div>
          <p className="text-[11px] text-zinc-400 mt-1">1 Credit = 1 AI Comment Reply</p>
        </div>

        {/* Channel Subscribers */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Subscribers</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {(profile?.subscriberCount || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Live YouTube audience</p>
        </div>

        {/* Quota Safeguard Meter */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Daily Quota Safe Status</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">100% Protected</div>
          <p className="text-[11px] text-zinc-400 mt-1">Spam & Emoji pre-filter active</p>
        </div>

        {/* Plan Tier */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-400">Current Plan</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white capitalize">
            {profile?.plan === 'premium' ? 'Premium ($49/mo)' : profile?.plan === 'standard' || profile?.plan === 'pro' || profile?.plan === 'starter' ? 'Standard ($39/mo)' : profile?.plan === 'enterprise' ? 'Enterprise ($99/mo)' : profile?.plan === 'custom_bulk' ? 'VIP Custom' : 'Free Trial'}
          </div>
          <Link href="/dashboard/billing" className="text-[11px] text-rose-400 hover:underline mt-1 block">
            Manage Subscription →
          </Link>
        </div>
      </div>

      {/* Auto-Pilot Switch Card */}
      <AutoPilotSwitch />

      {/* Recent Videos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Uploaded Videos</h3>
            <p className="text-xs text-zinc-400">Select a video to filter incoming unreplied comments.</p>
          </div>
          <Link
            href="/dashboard/comments"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            View All Comments <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingVideos ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-zinc-900/40 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((vid) => (
              <Link
                key={vid.id}
                href={`/dashboard/comments?videoId=${vid.id}`}
                className="group p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-rose-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {vid.thumbnailUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-2.5 bg-zinc-950">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h4 className="text-xs font-semibold text-zinc-100 line-clamp-2 group-hover:text-rose-400 transition-colors">
                    {vid.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2.5 pt-2 border-t border-zinc-800/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(vid.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                    Reply to comments →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : isYouTubeConnected ? (
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 text-center text-xs text-zinc-400">
            No uploaded videos found in this channel yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
