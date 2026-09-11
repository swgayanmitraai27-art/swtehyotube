'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CreatorPersonaConfig } from '@/types';
import { DEFAULT_CREATOR_PERSONA } from '@/lib/constants';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  X, 
  GraduationCap, 
  Laptop, 
  TrendingUp, 
  Gamepad2, 
  Smartphone,
  BookOpen
} from 'lucide-react';

export default function PersonaSettings() {
  const { user, profile } = useAuth();
  const [settings, setSettings] = useState<CreatorPersonaConfig>(DEFAULT_CREATOR_PERSONA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/user/settings?uid=${user.uid}`);
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings({
            ...DEFAULT_CREATOR_PERSONA,
            ...data.settings,
            creatorName: data.settings.creatorName || profile?.displayName || 'Creator',
            channelName: data.settings.channelName || profile?.channelTitle || 'My Channel',
          });
        }
      } catch (err) {
        console.error('Failed to load persona settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [user, profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSaving(true);
      setSavedMessage(false);
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          settings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const addBlacklistWord = () => {
    if (!newKeyword.trim()) return;
    if (!settings.blacklistKeywords.includes(newKeyword.trim().toLowerCase())) {
      setSettings({
        ...settings,
        blacklistKeywords: [...settings.blacklistKeywords, newKeyword.trim().toLowerCase()],
      });
    }
    setNewKeyword('');
  };

  const removeBlacklistWord = (word: string) => {
    setSettings({
      ...settings,
      blacklistKeywords: settings.blacklistKeywords.filter((w) => w !== word),
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Category / Niche Selection */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-rose-500" />
          Channel Niche & Category Intelligence
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Select your channel category so Gemini AI automatically understands your audience context (e.g. Students asking for PDF notes vs Developers asking for code).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: 'edtech', name: '📚 EdTech / Coaching (Vidyakul / Classes)', desc: 'For Teachers, Students, Courses & Notes' },
            { id: 'tech', name: '💻 Tech & Coding', desc: 'Tutorials, Projects & Reviews' },
            { id: 'finance', name: '📈 Finance & Trading', desc: 'Stock Market & Business' },
            { id: 'gaming', name: '🎮 Gaming & Esports', desc: 'Streams, High Energy & Fun' },
            { id: 'vlog_lifestyle', name: '🍔 Vlog & Lifestyle', desc: 'Family & Casual' },
            { id: 'business_consulting', name: '💼 Business & Sales', desc: 'Lead Generation & Clients' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSettings({ ...settings, category: cat.id as any })}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                (settings.category || 'edtech') === cat.id
                  ? 'bg-rose-950/30 border-rose-500 text-white ring-1 ring-rose-500/50'
                  : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="font-bold text-xs text-white mb-1">{cat.name}</div>
              <div className="text-[10px] text-zinc-400 leading-tight">{cat.desc}</div>
            </button>
          ))}
        </div>

        {/* Niche Specific App & Course Fields */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-rose-400" />
            Your App & Product Promotion Settings
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Your App Name</label>
              <input
                type="text"
                value={settings.appName || ''}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                placeholder="e.g. Vidyakul App"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">App Download Link / Play Store</label>
              <input
                type="text"
                value={settings.appDownloadLink || ''}
                onChange={(e) => setSettings({ ...settings, appDownloadLink: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                placeholder="https://bit.ly/vidyakul-app"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Target Audience</label>
              <input
                type="text"
                value={settings.targetAudience || ''}
                onChange={(e) => setSettings({ ...settings, targetAudience: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                placeholder="e.g. Class 10th & 12th Board Students"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Persona Tone & Bio */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-rose-500" />
          AI Creator Persona & Indian Hinglish Tone
        </h3>
        <p className="text-xs text-zinc-400">
          Configure how Gemini speaks to your viewers and students.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Creator / Teacher Name</label>
            <input
              type="text"
              value={settings.creatorName}
              onChange={(e) => setSettings({ ...settings, creatorName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
              placeholder="e.g. Aman Sir / SW Tech"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Channel Name</label>
            <input
              type="text"
              value={settings.channelName}
              onChange={(e) => setSettings({ ...settings, channelName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
              placeholder="e.g. Vidyakul Hindi Medium / SW Tech"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Language Style</label>
            <select
              value={settings.languageMode}
              onChange={(e: any) => setSettings({ ...settings, languageMode: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            >
              <option value="hinglish">🇮🇳 Hinglish (Natural Indian Conversational - Recommended)</option>
              <option value="hindi">🇮🇳 Shuddh Hindi</option>
              <option value="english">🇺🇸 Casual English</option>
              <option value="auto">🌐 Auto-Detect</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Reply Tone</label>
            <select
              value={settings.toneStyle}
              onChange={(e: any) => setSettings({ ...settings, toneStyle: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            >
              <option value="pro_mentor">🎓 Encouraging Teacher & Mentor (Polite, Guiding, Motivating)</option>
              <option value="friendly_bro">🤝 Friendly Bhai/Bro (Colloquial & Relatable)</option>
              <option value="witty_energetic">🔥 Witty & High-Energy (OP Vibe)</option>
              <option value="polite_support">🛡️ Polite & Support Oriented</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Channel Bio & Background for AI Context
          </label>
          <textarea
            rows={2}
            value={settings.personaBio}
            onChange={(e) => setSettings({ ...settings, personaBio: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 focus:outline-none focus:border-rose-500 resize-none"
            placeholder="Describe what your channel teaches (e.g., Hindi medium board exam classes, PDF notes on app)..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Custom Signature</label>
            <input
              type="text"
              value={settings.customSignature || ''}
              onChange={(e) => setSettings({ ...settings, customSignature: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
              placeholder="e.g. — Team Vidyakul ❤️"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Default CTA</label>
            <input
              type="text"
              value={settings.callToAction || ''}
              onChange={(e) => setSettings({ ...settings, callToAction: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
              placeholder="e.g. PDF notes ke liye App download karein!"
            />
          </div>
        </div>
      </div>

      {/* Quota & Spam Protection Rules */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          YouTube Quota Saver & Spam Rules
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Protect your 10,000 daily quota limit from being wasted on emojis and bots.
        </p>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.filterEmojiOnly}
              onChange={(e) => setSettings({ ...settings, filterEmojiOnly: e.target.checked })}
              className="w-4 h-4 accent-rose-600 rounded bg-zinc-950"
            />
            <div>
              <span className="text-sm font-medium text-zinc-200">Filter Emoji-Only Comments</span>
              <p className="text-[11px] text-zinc-400">Skips comments with only 🔥, ❤️, etc. to save 50 write units per comment.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.filterRepetitiveSpam}
              onChange={(e) => setSettings({ ...settings, filterRepetitiveSpam: e.target.checked })}
              className="w-4 h-4 accent-rose-600 rounded bg-zinc-950"
            />
            <div>
              <span className="text-sm font-medium text-zinc-200">Filter Repetitive Spammers</span>
              <p className="text-[11px] text-zinc-400">Filters bot patterns with 7+ repeated letters.</p>
            </div>
          </label>
        </div>

        {/* Blacklisted Keywords */}
        <div className="mt-6">
          <label className="block text-xs font-semibold text-zinc-300 mb-2">Blacklisted Spam Keywords</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBlacklistWord())}
              placeholder="e.g. sub4sub, free crypto, telegram"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            />
            <button
              type="button"
              onClick={addBlacklistWord}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {settings.blacklistKeywords.map((word) => (
              <span
                key={word}
                className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5"
              >
                {word}
                <button
                  type="button"
                  onClick={() => removeBlacklistWord(word)}
                  className="text-zinc-500 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        {savedMessage ? (
          <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Persona & Category Settings Saved!
          </span>
        ) : <span />}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-sm font-semibold shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
