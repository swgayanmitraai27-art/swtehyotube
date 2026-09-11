'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Youtube, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ConnectPage() {
  const { user, signInWithGoogle, connectYouTubeChannel, isYouTubeConnected } = useAuth();

  useEffect(() => {
    if (user && !isYouTubeConnected) {
      // Prompt OAuth connect immediately
    }
  }, [user, isYouTubeConnected]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-rose-600/20 blur-3xl rounded-full" />

        <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-600/30">
          <Youtube className="w-8 h-8 text-white fill-white" />
        </div>

        <h1 className="text-2xl font-extrabold text-white mb-2">Connect Your YouTube Channel</h1>
        <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
          Allow SW Tech AutoReply to read your video comments and post intelligent Hinglish AI replies on your behalf.
        </p>

        {!user ? (
          <button
            onClick={signInWithGoogle}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-sm font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            1-Click Login with Google
          </button>
        ) : isYouTubeConnected ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
              Channel already connected! You're ready to automate replies.
            </div>
            <Link
              href="/dashboard"
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold flex items-center justify-center gap-2"
            >
              Go to Dashboard Studio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <button
            onClick={connectYouTubeChannel}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-sm font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Youtube className="w-4 h-4 fill-white" />
            Grant YouTube Permissions
          </button>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Zero Spam Guarantee • 100% Safe OAuth 2.0
        </div>
      </div>
    </div>
  );
}
