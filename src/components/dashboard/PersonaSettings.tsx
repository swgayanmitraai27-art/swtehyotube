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
  BookOpen,
  BrainCircuit,
  Key,
  PhoneCall,
  Video,
  ExternalLink,
  Layers,
  Crown,
  Lock,
  Youtube
} from 'lucide-react';
import Link from 'next/link';

export default function PersonaSettings() {
  const { user, profile, connectYouTubeChannel } = useAuth();
  const [settings, setSettings] = useState<CreatorPersonaConfig>(DEFAULT_CREATOR_PERSONA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const handleSaveAndConnect = async () => {
    if (!user) return;
    try {
      setSaving(true);
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
        connectYouTubeChannel();
      }
    } catch (err) {
      console.error('Failed to save settings and connect:', err);
    } finally {
      setSaving(false);
    }
  };

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
          <GraduationCap className="w-4 h-4 text-rose-500" />
          Channel Niche & Category
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Select your channel category so Google Gemma 4 AI automatically understands your audience context (e.g. Students asking for notes vs Developers asking for code).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: 'edtech', name: '📚 EdTech / Coaching', desc: 'For Teachers, Students, Courses & Notes' },
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
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Your App / Brand Name</label>
              <input
                type="text"
                value={settings.appName || ''}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                placeholder="e.g. My Official App"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">App Download Link / Play Store</label>
              <input
                type="text"
                value={settings.appDownloadLink || ''}
                onChange={(e) => setSettings({ ...settings, appDownloadLink: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                placeholder="https://play.google.com/store/apps/details?id=..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Target Audience</label>
              <input
                type="text"
                value={settings.targetAudience || ''}
                onChange={(e) => setSettings({ ...settings, targetAudience: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                placeholder="e.g. Class 10th & 12th Board Students / Tech Enthusiasts"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Persona Tone & Bio */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <BrainCircuit className="w-4 h-4 text-rose-500" />
          Google Gemma 4 AI Creator Persona & Tone
        </h3>
        <p className="text-xs text-zinc-400">
          Configure how Google Gemma 4 AI speaks to your viewers and community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Creator / Teacher Name</label>
            <input
              type="text"
              value={settings.creatorName}
              onChange={(e) => setSettings({ ...settings, creatorName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
              placeholder="e.g. Aman / Rohit / SW Tech"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Channel Name</label>
            <input
              type="text"
              value={settings.channelName}
              onChange={(e) => setSettings({ ...settings, channelName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
              placeholder="e.g. SW Gyan Bhumi / Tech Guide"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Language Style</label>
            <select
              value={settings.languageMode}
              onChange={(e: any) => setSettings({ ...settings, languageMode: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
            >
              <optgroup label="🇮🇳 Indian & Regional Languages">
                <option value="hinglish">🇮🇳 Hinglish (Natural Indian Conversational - Recommended)</option>
                <option value="hindi">🇮🇳 हिन्दी (Pure Devanagari Hindi)</option>
                <option value="gujarati">🇮🇳 ગુજરાતી (Gujarati - State Boards)</option>
                <option value="bhojpuri">🇮🇳 भोजपुरी (Bhojpuri)</option>
                <option value="bengali">🇮🇳 বাংলা (Bengali)</option>
                <option value="marathi">🇮🇳 मराठी (Marathi)</option>
                <option value="tamil">🇮🇳 தமிழ் (Tamil)</option>
                <option value="telugu">🇮🇳 తెలుగు (Telugu)</option>
                <option value="punjabi">🇮🇳 ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="urdu">🇮🇳 اردو (Urdu)</option>
              </optgroup>
              <optgroup label="🌍 Global & International Languages">
                <option value="english">🇺🇸 English (US / UK)</option>
                <option value="spanish">🇪🇸 Español (Spanish)</option>
                <option value="french">🇫🇷 Français (French)</option>
                <option value="german">🇩🇪 Deutsch (German)</option>
                <option value="japanese">🇯🇵 日本語 (Japanese)</option>
                <option value="arabic">🇸🇦 العربية (Arabic)</option>
              </optgroup>
              <optgroup label="🤖 Intelligent Mode">
                <option value="auto">🌐 Auto-Detect (Google Gemma 4 140+ Languages)</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>🎭 AI Voice Tone & Personality</span>
              <span className="text-[10px] text-rose-400 font-normal">Gemma 4 Persona</span>
            </label>
            <select
              value={settings.toneStyle}
              onChange={(e: any) => setSettings({ ...settings, toneStyle: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500 font-medium"
            >
              <optgroup label="🎭 Creator Voice & Personality Tones">
                <option value="witty_funny">🎭 Witty / Funny (मजाकिया • Humorous, Sarcastic & Witty Comebacks)</option>
                <option value="professional_educator">🎓 Professional / Educator (गंभीर/शिक्षक • Academic, Authoritative & Formal)</option>
                <option value="casual_friendly">🤝 Casual / Friendly (दोस्ताना • Warm, Approachable & Best-Friend Vibe)</option>
                <option value="hype_energetic">⚡ Hype / Energetic (उत्साही • High-Octane Emojis & Unstoppable Hype)</option>
                <option value="supportive_mentor">💖 Supportive / Mentor (प्रेरक • Empathetic, Patient & Reassuring)</option>
                <option value="short_crisp">🎯 Short & Crisp (सटीक 1-Liner • Punchy, Direct & Zero Fluff)</option>
              </optgroup>
              <optgroup label="🇮🇳 Regional / Indian Modes">
                <option value="pro_mentor">🎓 Encouraging Mentor (Polite Hinglish Guidance)</option>
                <option value="friendly_bro">🤝 Friendly Bhai/Bro (Desi Colloquial Bhai Vibe)</option>
              </optgroup>
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
            placeholder="Describe what your channel teaches (e.g., educational classes, programming guides, finance strategies)..."
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
              placeholder="e.g. — Team SW Tech ❤️"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Default CTA</label>
            <input
              type="text"
              value={settings.callToAction || ''}
              onChange={(e) => setSettings({ ...settings, callToAction: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
              placeholder="e.g. Resources ke liye description check karein!"
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800/80">
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
            <span>Creator's Custom AI Instructions & Rules (विशेष निर्देश)</span>
            <span className="text-[10px] text-rose-400 font-bold">Google Gemma 4 Strictly Follows</span>
          </label>
          <textarea
            rows={3}
            value={settings.customInstructions || ''}
            onChange={(e) => setSettings({ ...settings, customInstructions: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 focus:outline-none focus:border-rose-500 resize-none"
            placeholder="e.g. 1. Hamesha student ko 'beta/bhai' kehkar motivate karo, 2. Har doubt me Telegram group join karne ko bolo, 3. Kabhi rude ya negative reply mat do, 4. Shuruat 'Namaste' se karo..."
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            Aap jo bhi niyam yahan likhenge, Google Gemma 4 AI har ek comment reply me unhe 100% follow karega.
          </p>
        </div>
      </div>

      {/* Quota & Spam Protection Rules */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Smart Filters & Quota Saver Guard
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          Pre-filter low-value comments before calling YouTube API to conserve your 10,000 daily quota units.
        </p>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-zinc-200">Skip Emoji-Only Comments</div>
              <div className="text-[10px] text-zinc-400">Save quota by ignoring single-emoji comments (e.g. '🔥', '❤️')</div>
            </div>
            <input
              type="checkbox"
              checked={settings.filterEmojiOnly}
              onChange={(e) => setSettings({ ...settings, filterEmojiOnly: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-zinc-200">Spam & Self-Promotion Filter</div>
              <div className="text-[10px] text-zinc-400">Auto-skip comments matching blacklisted keywords</div>
            </div>
            <input
              type="checkbox"
              checked={settings.filterRepetitiveSpam}
              onChange={(e) => setSettings({ ...settings, filterRepetitiveSpam: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                Auto-Delete Toxic & Abusive Comments (AI YouTube Cleaner)
              </div>
              <div className="text-[10px] text-zinc-400">Instantly delete abusive, hate, or defamatory comments from your YouTube channel</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoDeleteToxicComments ?? true}
              onChange={(e) => setSettings({ ...settings, autoDeleteToxicComments: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-zinc-200">Auto-Like Comment on AI Reply</div>
              <div className="text-[10px] text-zinc-400">Automatically heart/like the comment when reply is posted</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoLikeOnReply}
              onChange={(e) => setSettings({ ...settings, autoLikeOnReply: e.target.checked })}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </label>

          {/* Comment Freshness / Max Age Filter (Credit Protection) */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 col-span-1 md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Smart Credit Saver: Only Reply to Fresh Comments
                </div>
                <div className="text-[10px] text-zinc-400">
                  Protects your credits by skipping old/dead comments from months ago. Only fresh active viewers get replies!
                </div>
              </div>
              <select
                value={settings.maxCommentAgeHours || 48}
                onChange={(e) => setSettings({ ...settings, maxCommentAgeHours: Number(e.target.value) })}
                className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500 font-semibold shrink-0"
              >
                <option value={24}>Fresh Only (Last 24 Hours)</option>
                <option value={48}>Recommended (Last 48 Hours)</option>
                <option value={72}>Last 3 Days</option>
                <option value={168}>Last 7 Days</option>
                <option value={720}>Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blacklist Keywords Management */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <label className="block text-xs font-semibold text-zinc-300 mb-2">Blacklisted Spam Keywords</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBlacklistWord();
                }
              }}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              placeholder="Type keyword and press Enter (e.g. telegram link, sub4sub)"
            />
            <button
              type="button"
              onClick={addBlacklistWord}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {settings.blacklistKeywords.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300"
              >
                {word}
                <button
                  type="button"
                  onClick={() => removeBlacklistWord(word)}
                  className="text-zinc-500 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Project BYOK Quota Pool Card (Dedicated High Volume Setup) */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold mb-2">
              <Layers className="w-3.5 h-3.5" />
              Multi-Project BYOK Quota Pooling (Optional & Free)
            </div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              Dedicated Google Cloud Project Quota Keys
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              By default, your account runs on our shared high-speed server quota. For high-volume channels (Pro/Enterprise 4k–8k+ replies), you can pool your own Google Cloud projects to get up to <strong>30,000 daily quota units (~18,000 replies/month)</strong>.
            </p>
          </div>

          {/* 1-on-1 WhatsApp Live Call CTA (Paid Subscribers Only) */}
          {profile?.plan && profile?.plan !== 'free' ? (
            <a
              href={`https://wa.me/918303994616?text=${encodeURIComponent(
                `Hello SW Tech Team! I am an active paid member (${profile?.plan} plan). I want to schedule my 1-on-1 5-Minute Live Video Setup Call with the Founder on WhatsApp. Channel: ${settings.channelName || 'Creator'}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition-all shadow-lg shadow-emerald-950/50"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Book 5-Min Live Setup Call 📞</span>
            </a>
          ) : (
            <Link
              href="/dashboard/billing"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-rose-600 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all shadow-lg"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Upgrade to Unlock Live Setup Call 🔒</span>
            </Link>
          )}
        </div>

        {/* Quota Math Badge Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">1 Project Key</span>
            <div className="text-sm font-black text-white">10,000 Units/day</div>
            <div className="text-[11px] text-zinc-400">~6,000 AI Replies/mo</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-0.5">2 Project Keys (Pro)</span>
            <div className="text-sm font-black text-white">20,000 Units/day</div>
            <div className="text-[11px] text-zinc-400">~12,000 AI Replies/mo</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">3 Project Keys (Enterprise)</span>
            <div className="text-sm font-black text-white">30,000 Units/day</div>
            <div className="text-[11px] text-zinc-400">~18,000 AI Replies/mo</div>
          </div>
        </div>

        {/* 3 Dedicated Project Blocks (OAuth Client ID & Client Secret) */}
        <div className="space-y-4 pt-2">
          {/* Project 1 */}
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-xs font-bold text-white">Google Cloud Project 1 (Primary Dedicated Quota)</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">10,000 Units/day (~6k replies/mo)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5">
                  Project 1 OAuth Client ID
                </label>
                <input
                  type="text"
                  value={settings.customClientId || ''}
                  onChange={(e) => setSettings({ ...settings, customClientId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-rose-500"
                  placeholder="xxxx.apps.googleusercontent.com"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5">
                  Project 1 Client Secret
                </label>
                <input
                  type="password"
                  value={settings.customClientSecret || ''}
                  onChange={(e) => setSettings({ ...settings, customClientSecret: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-rose-500"
                  placeholder="GOCSPX-xxxx..."
                />
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-xs font-bold text-white">Google Cloud Project 2 (Pro Expansion Pool)</span>
              </div>
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">+10,000 Units/day (Total 20k Quota)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5">
                  Project 2 OAuth Client ID
                </label>
                <input
                  type="text"
                  value={settings.customClientId2 || ''}
                  onChange={(e) => setSettings({ ...settings, customClientId2: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-rose-500"
                  placeholder="xxxx.apps.googleusercontent.com"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5">
                  Project 2 Client Secret
                </label>
                <input
                  type="password"
                  value={settings.customClientSecret2 || ''}
                  onChange={(e) => setSettings({ ...settings, customClientSecret2: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-rose-500"
                  placeholder="GOCSPX-xxxx..."
                />
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-xs font-bold text-white">Google Cloud Project 3 (Enterprise High-Volume Pool)</span>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">+10,000 Units/day (Total 30k Quota)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5">
                  Project 3 OAuth Client ID
                </label>
                <input
                  type="text"
                  value={settings.customClientId3 || ''}
                  onChange={(e) => setSettings({ ...settings, customClientId3: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-rose-500"
                  placeholder="xxxx.apps.googleusercontent.com"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5">
                  Project 3 Client Secret
                </label>
                <input
                  type="password"
                  value={settings.customClientSecret3 || ''}
                  onChange={(e) => setSettings({ ...settings, customClientSecret3: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-rose-500"
                  placeholder="GOCSPX-xxxx..."
                />
              </div>
            </div>
          </div>

          {/* Quick Action: Save & Connect YouTube */}
          <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-zinc-400">
              💡 <span className="text-zinc-200 font-semibold">Ready to connect?</span> Enter your Client ID & Secret, then click below to connect with your own Google Cloud app name and zero quota limits!
            </p>
            <button
              type="button"
              onClick={handleSaveAndConnect}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <Youtube className="w-4 h-4 text-white" />
              {saving ? 'Saving...' : 'Save & Connect YouTube'}
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        {savedMessage ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4" /> Persona Settings Saved Successfully!
          </div>
        ) : (
          <div />
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Persona Settings'}
        </button>
      </div>
    </form>
  );
}
