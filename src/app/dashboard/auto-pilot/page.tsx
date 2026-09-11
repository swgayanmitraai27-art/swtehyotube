'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AutoPilotSwitch from '@/components/dashboard/AutoPilotSwitch';
import { 
  Bot, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function AutoPilotPage() {
  const { user, profile, isYouTubeConnected, refreshProfile } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const handleRunSyncNow = async () => {
    if (!user || !isYouTubeConnected) return;

    try {
      setSyncing(true);
      setSyncResult(null);

      const res = await fetch(`/api/youtube/sync-auto-pilot?uid=${user.uid}`);
      const data = await res.json();
      setSyncResult(data);
      await refreshProfile();
    } catch (err: any) {
      console.error('Auto-pilot manual sync error:', err);
      setSyncResult({ success: false, error: err.message || 'Sync failed' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-400" />
          Auto-Pilot Automation & Rules
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Configure automated background comment replies matching your creator persona and monitor sync history.
        </p>
      </div>

      {/* Main Switch */}
      <AutoPilotSwitch />

      {/* Trigger Sync Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Play className="w-4 h-4 text-rose-500" />
            Run Instant Auto-Pilot Cycle
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-lg">
            Trigger an on-demand cycle right now to scan for unreplied comments, generate Gemini Hinglish replies, and post them automatically.
          </p>
        </div>

        <button
          onClick={handleRunSyncNow}
          disabled={syncing || !isYouTubeConnected}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-bold shadow-lg shadow-rose-600/20 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Scanning & Auto-Replying...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              Run Auto-Pilot Sync Now
            </>
          )}
        </button>
      </div>

      {/* Sync Result Feedback */}
      {syncResult && (
        <div className={`p-4 rounded-2xl border text-xs ${
          syncResult.success ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-red-950/20 border-red-500/30 text-red-300'
        }`}>
          {syncResult.success ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Auto-Pilot Cycle Complete! Processed and sent {syncResult.results?.[0]?.repliesSent || 0} automated replies.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Error during sync: {syncResult.error}</span>
            </div>
          )}
        </div>
      )}

      {/* Auto-Pilot Rules & Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4" />
            Background Cron Interval
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Vercel Cron runs every <strong>20 minutes</strong> to safeguard YouTube quota limits and reply promptly.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            Spam & Emoji Pre-Filter
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Local filter skips bot links and emoji-only comments, saving 50 YouTube quota units per comment.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
            <Zap className="w-4 h-4" />
            Safety Fallback
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            If user credits reach 0, auto-pilot safely pauses without interrupting your YouTube channel.
          </p>
        </div>
      </div>
    </div>
  );
}
