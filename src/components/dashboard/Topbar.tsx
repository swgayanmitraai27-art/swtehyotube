'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Youtube, Sparkles, RefreshCw, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import NotificationCenter from './NotificationCenter';
import { InteractiveTour } from './InteractiveTour';

export default function Topbar() {
  const { profile, connectYouTubeChannel, isYouTubeConnected, user } = useAuth();

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Channel Status */}
      <div className="flex items-center gap-3">
        {isYouTubeConnected ? (
          <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-xl">
            {profile?.channelThumbnail ? (
              <img
                src={profile.channelThumbnail}
                alt={profile.channelTitle || 'Channel'}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-rose-500/40"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center text-xs font-bold text-white">
                YT
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-100 max-w-[140px] truncate">
                  {profile?.channelTitle || 'Connected Channel'}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <span className="text-[10px] text-zinc-400 block -mt-0.5">
                {(profile?.subscriberCount || 0).toLocaleString()} Subscribers
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={connectYouTubeChannel}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600/10 border border-rose-500/30 text-rose-400 text-xs font-medium hover:bg-rose-600/20 transition-all"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Connect YouTube Channel (1-Click)
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Interactive Tour Guide Button */}
        <InteractiveTour />

        {/* Credits Badge */}
        <Link
          href="/dashboard/billing"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all group"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <span className="text-xs font-bold text-zinc-100">{profile?.credits ?? 0}</span>
            <span className="text-[10px] text-zinc-400 ml-1">Credits</span>
          </div>
          <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center ml-1">
            <Plus className="w-3 h-3" />
          </div>
        </Link>

        {/* Live In-App Alerts Notification Center */}
        <NotificationCenter />

        {/* Channel Reconnect / Sync Icon */}
        <button
          onClick={connectYouTubeChannel}
          title="Refresh YouTube Connection & Scopes"
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
          />
        )}
      </div>
    </header>
  );
}
