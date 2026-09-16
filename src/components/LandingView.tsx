'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import RazorpayModal from '@/components/dashboard/RazorpayModal';
import AIPlayground from '@/components/dashboard/AIPlayground';
import AuthModal from '@/components/dashboard/AuthModal';
import { 
  Youtube, 
  Sparkles, 
  Bot, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Gift,
  FileSpreadsheet,
  ShieldAlert,
  Globe2,
  BrainCircuit,
  Languages,
  Layers,
  Compass,
  Check,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import { INDIAN_TIER_PLANS } from '@/lib/constants';
import { BillingCycle } from '@/types';

export default function LandingView() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const handleGetStarted = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else {
      setAuthModalOpen(true);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-r from-rose-600/20 via-red-600/15 to-amber-600/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold shadow-inner">
            <BrainCircuit className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Powered by Google Gemma 4 31B IT Thinking Model</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Globe2 className="w-3.5 h-3.5" />
            <span>140+ Global Languages • 35+ Deep Mastery</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.12] max-w-5xl mx-auto">
          Turn Every YouTube Comment Into a Superfan with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-500">
            Google Gemma 4 31B AI.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
          The next-generation <strong>Google AI Thinking Model</strong> that deeply analyzes your 
          <strong> Video Title</strong>, <strong>Video Description</strong>, and <strong>Channel Persona</strong> before crafting 
          hyper-relevant, high-converting replies in English & 140+ global languages that sound 100% like you.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-base shadow-xl shadow-rose-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            Start 7-Day Free Trial (1-Click Connect)
          </button>
          <Link
            href="#pricing"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-base transition-all"
          >
            View Plans & Pricing ($ USD)
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 🎁 7-Day Full Free Trial
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
            <Sparkles className="w-4 h-4 text-amber-400" /> 100 Free AI Reply Credits
          </span>
          <span className="flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-rose-400" /> Google Gemma 4 31B AI
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> No Credit Card Required
          </span>
        </div>

        {/* Interactive Live AI Playground on Homepage */}
        <div id="playground" className="mt-14 text-left">
          <AIPlayground />
        </div>
      </section>

      {/* 4-Pillar Features Showcase Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Everything Modern YouTubers Need to Scale
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for Top YouTubers, Podcasters & Creator Agencies
          </h2>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            Stop spending 3+ hours daily typing repetitive replies. Let AI handle community engagement, fan questions, product link placements, and spam cleaning 24/7 on auto-pilot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: AI Comment Summary */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-rose-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">🧠 AI Video Comment Summary</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                1-Click analyze 1,000+ comments per video. AI instantly extracts audience sentiment, top viewer questions, and high-converting next video ideas.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Audience Intelligence
            </div>
          </div>

          {/* Pillar 2: Auto-Mention & App Promotion */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-rose-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">🏷️ Auto-Mention & Product Links</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tags every commenter with their unique @username and intelligently embeds your newsletter, affiliate link, app, or course in replies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-rose-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 3x Higher CTR & Conversions
            </div>
          </div>

          {/* Pillar 3: Toxic Comment Auto-Cleaner */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">🛡️ Abusive & Spam Auto-Delete</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Instantly detects hate speech, toxic harassment, sub4sub spam, and scam bots, automatically wiping them off YouTube 24/7.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Clean Channel Reputation
            </div>
          </div>

          {/* Pillar 4: 1-Click Instant Automation */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-rose-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">⚡ 1-Click Instant Setup</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect your YouTube channel in 10 seconds with 1-click Google OAuth. Zero manual API keys, zero Google Cloud setup, and instant 24/7 automation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-purple-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 100% Automated & Hassle-Free
            </div>
          </div>
        </div>
      </section>

      {/* Language & Intelligence Showcase Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
            <Languages className="w-3.5 h-3.5" />
            Global AI Multilingual Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            140+ Languages Supported with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-500">
              Native Nuance in 35+ Major Languages
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            Google Gemma 4 31B IT delivers breakthrough multilingual accuracy across North America, Europe, Asia, Latin America, and global markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: English & Americas */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-rose-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">🇺🇸 English & Americas</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Ultra-natural conversational English across US, UK, Canada, Australia, and Latin America.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['English (US)', 'English (UK)', 'English (Australia)', 'Español (Latin America)', 'Português (Brasil)', 'Français (Canada)'].map((lang) => (
                  <span key={lang} className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-rose-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> High-Retention YouTube Slang & Tone
            </div>
          </div>

          {/* Card 2: European Languages */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">🌍 European & Western Markets</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Ready for international expansion with major European languages processed with high nuance and cultural context.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['English (US/UK)', 'Español (Spanish)', 'Français (French)', 'Deutsch (German)', 'Italiano (Italian)', 'Nederlands (Dutch)', 'Dansk (Danish)'].map((lang) => (
                  <span key={lang} className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Global Stripe Billing Ready
            </div>
          </div>

          {/* Card 3: Asian & Middle-Eastern */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">🌏 Asian & Middle-Eastern</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Deep character, script, and vocabulary understanding across East Asia and Middle East languages.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['日本語 (Japanese)', '한국어 (Korean)', '中文 (Mandarin)', 'العربية (Arabic)', 'فارسی (Persian/Farsi)'].map((lang) => (
                  <span key={lang} className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 140+ Worldwide Languages
            </div>
          </div>
        </div>
      </section>

      {/* Global 4-Tier Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
            <Globe2 className="w-3.5 h-3.5" />
            Global Creator & Agency Growth Plans ($ USD)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Choose Your Growth Plan</h2>
          <p className="text-sm text-zinc-400 mt-2">
            Save hours every week. All plans include a <strong>7-Day Full Free Trial</strong> with 100 free AI replies and zero upfront commitment.
          </p>

          {/* Billing Cycle Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {/* Monthly / Yearly Switch with 2 Months Free */}
            <div className="inline-flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-2xl">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-lg shadow-rose-600/20'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Pay Yearly (Get 2 Months Free 🎁)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INDIAN_TIER_PLANS.map((plan) => {
            const isYearly = billingCycle === 'yearly';
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 border text-left flex flex-col justify-between relative transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-rose-500 shadow-2xl shadow-rose-950/40 ring-1 ring-rose-500 scale-[1.02]'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-red-500 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-lg whitespace-nowrap">
                    🔥 Most Popular • Main Target
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-extrabold text-white">{plan.name}</h3>
                  <span className="text-[11px] text-zinc-400 font-medium block mt-1 line-clamp-2">
                    {plan.idealFor}
                  </span>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">₹{price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-zinc-400">/{isYearly ? 'yr' : 'mo'}</span>
                  </div>

                  <div className="mt-2 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg text-rose-400 bg-rose-500/10">
                        Up to {credits.toLocaleString('en-IN')} AI Replies {isYearly ? '/ yr' : '/ mo'}
                      </span>
                      {isYearly && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                          2 Mo Free
                        </span>
                      )}
                    </div>
                    {plan.competitorAdvantage && (
                      <div className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                        {plan.competitorAdvantage}
                      </div>
                    )}
                  </div>

                  <ul className="mt-5 space-y-2 text-xs text-zinc-300 border-t border-zinc-800/80 pt-4">
                    {plan.features.map((feature) => {
                      const isToxicHighlight = feature.includes('Toxic') || feature.includes('Spam') || feature.includes('Hate Speech');
                      return (
                        <li
                          key={feature}
                          className={`flex items-start gap-2 rounded-xl transition-all ${
                            isToxicHighlight
                              ? 'bg-rose-500/15 border border-rose-500/30 p-2 text-rose-200 font-semibold shadow-sm'
                              : 'p-1'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isToxicHighlight ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                            }`}
                          />
                          <span className="leading-snug text-[11px]">{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`mt-6 w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  Start 7-Day Free Trial (Pay ₹{price?.toLocaleString?.('en-IN')})
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Competitor Value Comparison Matrix Banner */}
        <div className="mt-12 rounded-3xl p-6 sm:p-8 bg-zinc-900/80 border border-zinc-800 text-left shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                SW Tech vs. Competitors (Value Matrix)
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Side-by-Side Comparison: Why Indian Creators Switch to SW Tech
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Relatable Hinglish/Hindi AI, 100% quota safety, and instant UPI checkout at the best pricing in India.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-bold bg-zinc-950/60">
                  <th className="py-3.5 px-4 rounded-l-xl">Plan Tier</th>
                  <th className="py-3.5 px-4 text-rose-400 font-extrabold">🚀 SW Tech AutoReply</th>
                  <th className="py-3.5 px-4 text-zinc-400">Other Tools / Competitors</th>
                  <th className="py-3.5 px-4 text-emerald-400 font-extrabold rounded-r-xl">Your Super-Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr className="bg-zinc-950/40">
                  <td className="py-3.5 px-4 font-bold text-white">Free Trial</td>
                  <td className="py-3.5 px-4 font-bold text-rose-400">100 Free AI Replies (Gemma 4 31B)</td>
                  <td className="py-3.5 px-4 text-zinc-400">Only 20 actions / month</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">
                    🎁 5x More Free Replies + Natural Hinglish Thinking Model
                  </td>
                </tr>
                <tr className="bg-zinc-950/20">
                  <td className="py-3.5 px-4 font-bold text-white">🟢 Starter Plan</td>
                  <td className="py-3.5 px-4 font-bold text-rose-400">₹499/mo • Up to 1,500 AI Replies</td>
                  <td className="py-3.5 px-4 text-zinc-400">Expensive USD pricing ($19 = ₹1,600+) with no UPI</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">
                    ✅ 3x Cheaper for Indian Creators + Instant UPI (GPay/PhonePe)
                  </td>
                </tr>
                <tr className="bg-rose-950/25 border border-rose-500/30">
                  <td className="py-3.5 px-4 font-extrabold text-white flex items-center gap-1.5">
                    <span>👑 Growth Plan (Main Target)</span>
                    <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-bold">BEST VALUE</span>
                  </td>
                  <td className="py-3.5 px-4 font-black text-rose-400">₹999/mo • Up to 4,500 AI Replies</td>
                  <td className="py-3.5 px-4 text-zinc-400">$49/mo (₹4,200+) for only 1,500 replies</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-400">
                    🏆 3x MORE replies at 1/4th the price with Twin-Project Multiplier!
                  </td>
                </tr>
                <tr className="bg-zinc-950/40">
                  <td className="py-3.5 px-4 font-bold text-white">🚀 Pro Plan (Bade Channels)</td>
                  <td className="py-3.5 px-4 font-bold text-rose-400">₹1,999/mo • Up to 6,000 AI Replies</td>
                  <td className="py-3.5 px-4 text-zinc-400">$139/mo (₹11,800+) for only 5,000 replies</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">
                    ⚡ Peak Quota Handling + Advanced Spam & Harassment Purge
                  </td>
                </tr>
                <tr className="bg-emerald-950/20 border-emerald-500/30">
                  <td className="py-3.5 px-4 font-bold text-white">💼 Custom / DFY Enterprise</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">Let's Talk • Unlimited / Custom</td>
                  <td className="py-3.5 px-4 text-zinc-400">Restrictive enterprise tiers with no DFY support</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">
                    🏢 Full Done-For-You (DFY) layout with dedicated server nodes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dedicated Separate Section: Custom / DFY Enterprise ("Let's Talk") */}
        <div className="mt-10 rounded-3xl p-8 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 text-left flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              💼 Custom / DFY Enterprise Plan ("Let's Talk")
            </div>
            <h3 className="text-2xl font-black text-white">Full Done-For-You (DFY) Layout with Dedicated Server Nodes</h3>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              Bade YouTube Media Networks, Production Houses, Online Coaching Institutes aur Creator Agencies ke liye jinko <strong>Unlimited / Custom Monthly AI Replies</strong>, Full Done-For-You setup, Dedicated High-Speed Server Nodes, ya Multi-Channel MCN Architecture chahiye. Founder se direct baat karein custom quote aur white-glove setup ke liye.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Unlimited / Custom Monthly AI Reply Volume (10k - 5,00,000+)
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Dedicated Server Nodes & Full DFY Layout
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Direct Phone & WhatsApp Founder Calling Support (+91 8303994616)
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
            <a
              href={`https://wa.me/918303994616?text=${encodeURIComponent(
                'Namaste SW Tech Team! Mujhe Custom DFY Enterprise Plan ("Let\'s Talk") ke bare me baat karni hai. Please share custom quote and setup details.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp (+91 8303994616)</span>
            </a>
            <a
              href="tel:+918303994616"
              className="px-6 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Call: 8303994616</span>
            </a>
          </div>
        </div>
      </section>

      {/* Free YouTube Creator Tools Suite Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-3">
            <Gift className="w-3.5 h-3.5" />
            100% Free Creator Growth Tools
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Free Tools to Supercharge Your YouTube Channel
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            No credit card or login required. Run giveaways, export comments to Excel, and scan for spam bot attacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Giveaway Picker */}
          <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all hover:-translate-y-1 shadow-xl group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-4">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">VIRAL TOOL</span>
              <h3 className="text-lg font-bold text-white mt-2 group-hover:text-rose-400 transition-colors">
                Random Giveaway Comment Picker
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Pick fair, unbiased giveaway winners from any YouTube video with live spinner, confetti celebration, and duplicate user filters.
              </p>
            </div>
            <Link
              href="/tools/giveaway-picker"
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-rose-600 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>Launch Giveaway Picker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Export to CSV */}
          <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all hover:-translate-y-1 shadow-xl group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">1-CLICK EXPORT</span>
              <h3 className="text-lg font-bold text-white mt-2 group-hover:text-emerald-400 transition-colors">
                Export YouTube Comments to CSV
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Download every single comment, username, date, and like metric directly into an Excel & Google Sheets-ready CSV file.
              </p>
            </div>
            <Link
              href="/tools/export-comments"
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-600 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>Export Comments to CSV</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Comment Health Audit */}
          <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all hover:-translate-y-1 shadow-xl group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">AI AUDIT</span>
              <h3 className="text-lg font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">
                Comment Health & Spam Audit
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Analyze sentiment ratios, catch toxic crypto scam bots, and get AI recommendations to improve viewer retention.
              </p>
            </div>
            <Link
              href="/tools/comment-audit"
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-blue-600 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>Run Free AI Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SEO-Rich FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-extrabold text-white">Everything You Need to Know</h2>
          <p className="text-xs text-zinc-400 mt-2">
            Clear answers about Google Gemma 4 AI, YouTube quota, safety, and app download conversions.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'How does the YouTube AI Auto-Reply & Auto-Mention tool work?',
              a: 'Our platform connects to your YouTube channel via Google OAuth and constantly monitors incoming comments. Google Gemma 4 31B AI analyzes your video title, description, and custom channel persona to generate hyper-relevant replies in natural English and 140+ global languages, tags the commenter with @mention, and attaches your official product, link, or newsletter.',
            },
            {
              q: 'Is it 100% safe and compliant with YouTube Community Guidelines?',
              a: 'Yes, 100%. We strictly use the official Google YouTube Data API v3 and Google Generative AI with strict rate-limiting, intelligent quota caching, and anti-spam delays. Your channel credentials and tokens are encrypted with enterprise-grade security.',
            },
            {
              q: 'Can it automatically delete abusive and toxic comments?',
              a: 'Yes! Our built-in Toxic Comment Filter scans for vulgar abuses, scams, sub4sub links, and derogatory keywords, and automatically deletes them from YouTube to protect your channel brand reputation 24/7.',
            },
            {
              q: 'How does the 1-Click YouTube Channel Connection work?',
              a: 'Simply click "Connect YouTube Channel" and sign in with your Google account. Our automated backend handles all API tokens, quota management, and auto-reply scheduling behind the scenes with enterprise-grade encryption.',
            },
            {
              q: 'How do I get the 1-on-1 Live 5-Minute Setup Video Call with the Founder?',
              a: 'All Pro & Enterprise members get instant access to book a 1-Time 5-minute live screen-share setup call on WhatsApp / Google Meet directly from their dashboard. Our founder will personally walk you through Google Cloud project creation, OAuth setup, and custom persona configuration.',
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-left transition-all hover:border-zinc-700"
            >
              <h3 className="text-sm sm:text-base font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 px-4 text-xs text-zinc-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center">
              <Youtube className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bold text-white">SW Tech Solution</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-rose-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-rose-400 transition-colors">Terms of Service</Link>
          </div>
          <p>© {new Date().getFullYear()} SW Tech Solution • Powered by Google Gemma 4 31B AI</p>
        </div>
      </footer>

      {/* Razorpay Modal */}
      <RazorpayModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlanId={selectedPlan}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="register"
      />
    </div>
  );
}
