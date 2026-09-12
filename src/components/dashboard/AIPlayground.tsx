'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  BrainCircuit, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Film, 
  FileText, 
  User, 
  Bot,
  Zap,
  RefreshCw,
  GraduationCap,
  Laptop,
  TrendingUp,
  Briefcase,
  Gamepad2,
  Camera,
  Sliders
} from 'lucide-react';
import { AIReplySuggestion } from '@/types';

const SAMPLE_PRESETS = [
  {
    category: 'edtech',
    label: '📚 EdTech / Board Exam Doubt',
    icon: GraduationCap,
    videoTitle: 'Class 10th & 12th Board Exam 2026 Strategy - 4 Months Master Plan',
    videoDescription: 'Download Chapterwise PDF Notes from our official app. Batch enrollment link: https://swgayanbhumi.in/batch',
    commenter: 'Rahul_Kumar_10th',
    comment: 'HELLO MERA MUJHE BOERD EXAM MAI 98 PARSENT LANA HAI MUJHE AAP GIDE AKR DIJIYE TIME BHUT KAM BAHA SIRF 4 MONTH HI BACHA HAI',
    instruction: 'Hamesha student ko "Shaabaash beta" bolo, 4 months timetable recommend karo aur app link batao.',
  },
  {
    category: 'tech',
    label: '💻 Tech / Source Code Request',
    icon: Laptop,
    videoTitle: 'Build a FullStack Next.js 14 SaaS in 2 Hours with Google AI',
    videoDescription: 'Complete GitHub Source Code repository link in description. Join Discord for developer doubts.',
    commenter: 'Vikram_Dev_99',
    comment: 'Bhai tutorial bahut tagda tha! Is project ka GitHub source code aur installation commands kahan milengi?',
    instruction: 'Friendly developer tone me reply karo aur bolo description me GitHub repo link pinned hai.',
  },
  {
    category: 'finance',
    label: '📈 Finance / Stock & Course Inquiry',
    icon: TrendingUp,
    videoTitle: 'Top 3 High Growth Stocks for 2026 | Stock Market Basics',
    videoDescription: 'Open Free Demat Account: https://broker.link/swtech. Join our Zero to Hero Trading Masterclass Batch.',
    commenter: 'Aakash_Investor',
    comment: 'Sir kya main ₹5,000 se start kar sakta hoon? Aur aapka complete trading batch kab shuru ho raha hai?',
    instruction: 'Polite finance mentor tone me bolo ki ₹5,000 se SIP/learning start ho sakti hai aur masterclass link description me hai.',
  },
  {
    category: 'business_consulting',
    label: '💼 Business / Client Lead',
    icon: Briefcase,
    videoTitle: 'How to Get Your First 10 B2B High-Ticket Clients with Cold Email',
    videoDescription: 'Book a 1-on-1 Growth Consultation call with our agency: https://swgayanbhumi.in/consult',
    commenter: 'Sneha_AgencyOwner',
    comment: 'Sir mujhe meri agency ke liye sales strategy me help chahiye. Kya aapse 1-on-1 consultation book kar sakte hain?',
    instruction: 'Professional tone me welcome karo aur description me 1-on-1 booking link check karne ko bolo.',
  },
  {
    category: 'vlog_lifestyle',
    label: '🍔 Vlog / Location & Love',
    icon: Camera,
    videoTitle: 'Exploring Hidden Food Cafes in Delhi & My New Setup Tour!',
    videoDescription: 'Follow me on Instagram for daily stories. Next Sunday big surprise video coming!',
    commenter: 'Priya_Vlogs_Fan',
    comment: 'Bhai ye cafe kahan par hai? Aur aapka video edit karne ka style ek number hai, Sunday ka intezar hai! ❤️🔥',
    instruction: 'High energy grateful tone me cafe ki location batao aur Sunday video ka hype create karo.',
  },
  {
    category: 'gaming',
    label: '🎮 Gaming / Sensitivity & Stream',
    icon: Gamepad2,
    videoTitle: 'Unstoppable 1v4 Clutches in BGMI Conqueror Lobby | Live Stream Highlights',
    videoDescription: 'BGMI Sensitivity code & iPad setup details in pinned comment. Live every night 9 PM.',
    commenter: 'Gamer_Rohit_Pro',
    comment: 'Bhai kya OP clutch mara! Aapka gyroscope sensitivity code share kar do please aur next live kab aao ge?',
    instruction: 'OP streamer vibe me bolo daily night 9 PM live aate hain aur sensitivity pinned comment me hai.',
  },
];

export default function AIPlayground() {
  const { user } = useAuth();
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [videoTitle, setVideoTitle] = useState(SAMPLE_PRESETS[0].videoTitle);
  const [videoDescription, setVideoDescription] = useState(SAMPLE_PRESETS[0].videoDescription);
  const [authorName, setAuthorName] = useState(SAMPLE_PRESETS[0].commenter);
  const [commentText, setCommentText] = useState(SAMPLE_PRESETS[0].comment);
  const [customInstructions, setCustomInstructions] = useState(SAMPLE_PRESETS[0].instruction || '');
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<AIReplySuggestion[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const applyPreset = (idx: number) => {
    const p = SAMPLE_PRESETS[idx];
    setSelectedPreset(idx);
    setVideoTitle(p.videoTitle);
    setVideoDescription(p.videoDescription);
    setAuthorName(p.commenter);
    setCommentText(p.comment);
    setCustomInstructions(p.instruction || '');
    setSuggestions(null);
  };

  const handleTestAI = async () => {
    if (!commentText.trim() || !authorName.trim()) return;

    try {
      setLoading(true);
      const startTime = Date.now();

      const res = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user?.uid,
          commentText,
          authorName,
          videoTitle,
          videoDescription,
          customInstructions: customInstructions.trim() || undefined,
          category: SAMPLE_PRESETS[selectedPreset]?.category || 'edtech',
        }),
      });

      const data = await res.json();
      const elapsed = Date.now() - startTime;
      setResponseTime(elapsed);

      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error('Playground test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-900 border border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            Google Gemma 4 31B IT Thinking Playground
          </div>
          <h2 className="text-xl font-extrabold text-white">Live AI Reply Simulation Lab</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Test how Google Gemma 4 31B AI reads your <strong>Video Title</strong>, <strong>Video Description</strong>, and <strong>Custom Creator Instructions</strong> in real-time to generate natural, hyper-relevant Hinglish & Multilingual replies before posting to YouTube!
          </p>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div>
        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5">
          1-Click Niche Presets (Pick a scenario to test):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SAMPLE_PRESETS.map((p, idx) => {
            const Icon = p.icon;
            const isSelected = selectedPreset === idx;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(idx)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-2 ${
                  isSelected
                    ? 'bg-rose-600/15 border-rose-500 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-500'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold leading-tight">{p.label.split('/')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Video Context & Comment Input */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Film className="w-4 h-4 text-rose-400" />
            1. Video & Comment Input
          </h3>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Video Title</label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
              placeholder="e.g. Class 10th Board Exam 2026 Strategy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Video Description (Details & Links)</label>
            <textarea
              rows={2}
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 resize-none"
              placeholder="e.g. Free PDF notes available on our app link..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Commenter Name / Handle</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
                placeholder="e.g. Rahul_Sharma"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Engine Model</label>
              <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-rose-400 font-bold flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                Google Gemma 4 31B IT
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Viewer's Comment</label>
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 resize-none font-mono"
              placeholder="Type any YouTube comment here..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-rose-400" />
                Creator's Custom AI Instruction (विशेष निर्देश)
              </span>
              <span className="text-[10px] text-zinc-500">Optional Rule</span>
            </label>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              placeholder="e.g. Hamesha student ko motivate karo, batch link batao, polite raho..."
            />
          </div>

          <button
            type="button"
            onClick={handleTestAI}
            disabled={loading || !commentText.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-xs shadow-xl shadow-rose-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Google Gemma 4 is Thinking & Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                ⚡ Run Google Gemma 4 31B AI Simulation
              </>
            )}
          </button>
        </div>

        {/* Right: AI Output Display */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-rose-400" />
                2. Live AI Reply Suggestions
              </h3>
              {responseTime && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  ⚡ {responseTime}ms
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-zinc-300">Gemma 4 31B Reasoning in Progress...</p>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  Analyzing Video Title, Description, Commenter, and Custom Instructions to generate 4 multi-tone replies.
                </p>
              </div>
            ) : suggestions && suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((sug, idx) => (
                  <div
                    key={sug.id || idx}
                    className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-rose-500/40 transition-all text-left group relative"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {sug.toneLabel || 'Suggestion'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(sug.text, idx)}
                        className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold text-zinc-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-zinc-400" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed">{sug.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-zinc-500 text-xs">
                <BrainCircuit className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                Click <strong>"Run Google Gemma 4 31B AI Simulation"</strong> to test live replies with your custom persona & instructions!
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-rose-400" />
              100% Dynamic Video & Custom Rules Context
            </span>
            <span className="text-emerald-400 font-medium">Free Playground Simulation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
