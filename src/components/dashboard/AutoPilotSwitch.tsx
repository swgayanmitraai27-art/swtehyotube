'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bot, ShieldCheck, Zap, AlertTriangle, Check } from 'lucide-react';

export default function AutoPilotSwitch() {
  const { user, profile, refreshProfile } = useAuth();
  const [enabled, setEnabled] = useState(profile?.autoPilotEnabled || false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggleAutoPilot = async () => {
    if (!user) return;
    const newState = !enabled;
    try {
      setLoading(true);
      setMessage(null);
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          autoPilotEnabled: newState,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEnabled(newState);
        await refreshProfile();
        setMessage(newState ? 'Auto-Pilot Activated! Background scanner is active.' : 'Switched to Manual Copilot Review Mode.');
      }
    } catch (err) {
      console.error('Failed to toggle auto-pilot:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'
          }`}>
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Auto-Pilot Hands-Free Mode</h3>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {enabled ? 'RUNNING AUTOMATICALLY' : 'MANUAL APPROVAL ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
              {enabled
                ? 'Gemini 1.5 Flash scans your video comments every 20 mins, filters spam locally, and automatically posts engaging Hinglish replies on YouTube without needing your manual click.'
                : 'You are currently in Copilot Mode. All suggested replies require your 1-click manual approval before being posted to YouTube.'}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={toggleAutoPilot}
          disabled={loading}
          className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            enabled ? 'bg-emerald-500' : 'bg-zinc-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {message && (
        <div className="mt-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" />
          {message}
        </div>
      )}
    </div>
  );
}
