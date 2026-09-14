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
  const [selectedPlan, setSelectedPlan] = useState('pro');
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

          {/* Pillar 4: BYOK Multi-Project Quota */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-rose-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">⚡ BYOK Quota Pooling</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect your own Google Cloud projects to pool 10k, 20k, or 30k daily quota units (~18,000 replies/month) with zero server bottlenecks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-purple-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Unlimited Scale & Reliability
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

        {/* 4 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDIAN_TIER_PLANS.map((plan) => {
            const isYearly = billingCycle === 'yearly';
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits;
            const isCustom = plan.id === 'custom_bulk';

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 border text-left flex flex-col justify-between relative transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-rose-500 shadow-2xl shadow-rose-950/40 ring-1 ring-rose-500 scale-[1.02]'
                    : isCustom
                    ? 'bg-gradient-to-b from-emerald-950/40 to-zinc-950 border-emerald-500/50 shadow-xl shadow-emerald-950/30'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-red-500 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-lg whitespace-nowrap">
                    🔥 Best Value • Most Popular
                  </div>
                )}
                {isCustom && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-lg whitespace-nowrap">
                    📞 Direct Call / VIP
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-extrabold text-white">{plan.name}</h3>
                  <span className="text-[11px] text-zinc-400 font-medium block mt-1 line-clamp-2">
                    {plan.idealFor}
                  </span>

                  <div className="mt-4 flex items-baseline gap-1">
                    {isCustom ? (
                      <span className="text-2xl font-black text-emerald-400">Custom Quote</span>
                    ) : (
                      <>
                        <span className="text-3xl font-black text-white">${price.toLocaleString()}</span>
                        <span className="text-xs text-zinc-400">/{isYearly ? 'yr' : 'mo'}</span>
                      </>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                      isCustom ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {isCustom ? '20k - 500k+ AI Replies' : `${credits.toLocaleString()} AI Replies ${isYearly ? '/ yr' : '/ mo'}`}
                    </span>
                    {!isCustom && isYearly && (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                        2 Mo Free
                      </span>
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

                {isCustom ? (
                  <div className="mt-6 flex flex-col gap-2">
                    <a
                      href={`https://wa.me/918303994616?text=${encodeURIComponent(
                        'Hello SW Tech Team! I am interested in the Custom Bulk / VIP Calling Plan for my YouTube channel(s). Please share pricing & call setup details.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp (+91 8303994616)</span>
                    </a>
                    <a
                      href="tel:+918303994616"
                      className="w-full py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <PhoneCall className="w-3 h-3 text-emerald-400" />
                      <span>Direct Call: 8303994616</span>
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`mt-6 w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    Start 7-Day Free Trial
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom / Bulk Volume Plan Card */}
        <div className="mt-10 rounded-3xl p-8 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 text-left flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Custom Bulk & Agency Volume Plan
            </div>
            <h3 className="text-2xl font-black text-white">Need Custom High-Volume AI Replies or Multiple Channels?</h3>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              For Large Media Networks, Coaching Institutes, and Creator Agencies needing <strong>20,000 to 5,00,000+ Monthly AI Replies</strong>, Multi-Channel BYOK Quota Architecture, or Custom AI Fine-Tuning. Connect directly with the founder for custom enterprise pricing & instant live setup.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Custom Reply Quota (20k - 500k+/mo)
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Unlimited Multi-Channel Support
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Direct WhatsApp VIP Support & Setup
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
            <a
              href={`https://wa.me/918303994616?text=${encodeURIComponent(
                'Hello SW Tech Team! I am interested in the Custom / Bulk Plan for my YouTube channel(s). Please share custom bulk pricing & setup details.'
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
              q: 'How does the BYOK Multi-Project Quota Pooling work?',
              a: 'For high-growth channels and agencies (4,000 to 18,000+ monthly replies), you can pool your own Google Cloud projects (10k, 20k, 30k daily units) in Settings. This gives you dedicated unlimited quota directly from Google without server rate-limits.',
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
