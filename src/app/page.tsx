'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import RazorpayModal from '@/components/dashboard/RazorpayModal';
import AIPlayground from '@/components/dashboard/AIPlayground';
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
  Check
} from 'lucide-react';
import { INDIAN_TIER_PLANS } from '@/lib/constants';
import { BillingCycle } from '@/types';

export default function LandingPage() {
  const { user, signInWithGoogle } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const handleGetStarted = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else {
      signInWithGoogle();
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    if (!user) {
      signInWithGoogle();
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
          hyper-relevant, natural Hinglish, Regional Indian & Global language replies that sound 100% like you.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-base shadow-xl shadow-rose-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105"
          >
            <Youtube className="w-5 h-5 fill-white" />
            1-Click Connect YouTube Channel
          </button>
          <Link
            href="#pricing"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-base transition-all"
          >
            View Pricing (From ₹499/mo)
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 50 Free Trial Welcome Credits
          </span>
          <span className="flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-rose-400" /> Google Gemma 4 31B Deep Reasoning
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 10k Quota Saver Guard
          </span>
        </div>

        {/* Interactive Live AI Playground on Homepage */}
        <div id="playground" className="mt-14 text-left">
          <AIPlayground />
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
              Deep Mastery in 35+ Major Languages
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            Google Gemma 4 31B IT delivers breakthrough multilingual performance across Indian regional languages and international global markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Indian & Hinglish */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 hover:border-rose-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">🇮🇳 Hindi, Hinglish & Regional</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                100% natural comprehension for Devanagari Hindi and conversational Hinglish (e.g. <em>"Sir naya batch kab aayega, please reply!"</em>).
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['Hinglish', 'हिन्दी (Hindi)', 'ગુજરાતી (Gujarati)', 'भोजपुरी (Bhojpuri)', 'বাংলা (Bengali)', 'मराठी (Marathi)', 'தமிழ் (Tamil)', 'తెలుగు (Telugu)', 'ਪੰਜਾਬੀ (Punjabi)', 'اردو (Urdu)'].map((lang) => (
                  <span key={lang} className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-rose-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Tailored for Educators, Creators & State Boards
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

      {/* 3-Tier Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            3-Tier Creator Pricing (For Indian YouTubers)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Choose Your Growth Plan</h2>
          <p className="text-sm text-zinc-400 mt-2">
            Save hours every week. Google Gemma 4 31B AI automation with guaranteed 90%+ profit margins.
          </p>

          {/* Monthly / Yearly Switch with 2 Months Free */}
          <div className="inline-flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 p-1.5 rounded-2xl mt-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
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

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INDIAN_TIER_PLANS.map((plan) => {
            const isYearly = billingCycle === 'yearly';
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 border text-left flex flex-col justify-between relative transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-rose-500 shadow-2xl shadow-rose-950/40 ring-1 ring-rose-500 scale-[1.02]'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-600 to-red-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                    🔥 Best Value (Most Popular)
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                  <span className="text-xs text-zinc-400 font-medium block mt-1">
                    {plan.idealFor}
                  </span>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">₹{price.toLocaleString()}</span>
                    <span className="text-sm text-zinc-400">/{isYearly ? 'year' : 'month'}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg">
                      {credits.toLocaleString()} AI Replies {isYearly ? '/ yr' : '/ mo'}
                    </span>
                    {isYearly && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        2 Mo Free
                      </span>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3 text-xs text-zinc-300 border-t border-zinc-800/80 pt-5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`mt-8 w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  Choose {plan.name} (₹{price.toLocaleString()})
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
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
    </div>
  );
}
