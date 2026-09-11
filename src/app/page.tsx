'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import RazorpayModal from '@/components/dashboard/RazorpayModal';
import { 
  Youtube, 
  Sparkles, 
  Bot, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Gift,
  Flame,
  Crown,
  Rocket
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
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-600/15 blur-[120px] rounded-full pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India's 1st Hinglish YouTube AI Comment Automation</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Turn Every YouTube Comment Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-amber-500">Superfan with AI.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Non-stop automated <strong>Hinglish replies</strong> that sound 100% like you. 
          Boost your YouTube algorithm ranking, engage every viewer, and safeguard your 10k daily API quota.
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
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 10k Quota Saver Guard
          </span>
          <span className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-rose-400" /> Gemini 1.5 Flash Speed
          </span>
        </div>

        {/* Interactive Visual Preview */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-2xl backdrop-blur-xl text-left">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-semibold text-zinc-400 ml-2">Live Hinglish Comment Auto-Reply Engine</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Auto-Pilot Active
            </span>
          </div>

          <div className="space-y-4">
            {/* Sample 1 */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-300">@rahul_coder99</span>
                <span className="text-[10px] text-zinc-500">2 mins ago</span>
              </div>
              <p className="text-sm text-zinc-200 mb-3">"Bhai kya mast video thi! Iska part 2 kab aayega please batado??"</p>
              
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
                <Bot className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[10px] text-rose-400 block uppercase">Gemini 1.5 Auto-Reply</span>
                  <p>@rahul_coder99 Shukriya bhai! ❤️ Part 2 par kaam chal raha hai, Sunday ko shaam 6 baje live hoga! Stay tuned! 🔥</p>
                </div>
              </div>
            </div>

            {/* Sample 2 */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-300">@tech_lover_india</span>
                <span className="text-[10px] text-zinc-500">8 mins ago</span>
              </div>
              <p className="text-sm text-zinc-200 mb-3">"OP Bhaiya! Dil khush kar diya systemm 🔥"</p>
              
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
                <Bot className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[10px] text-rose-400 block uppercase">Gemini 1.5 Auto-Reply</span>
                  <p>@tech_lover_india Love you brother! ❤️ Aise hi support banaye rakho, next video aur bhi dhamaakedaar hogi!</p>
                </div>
              </div>
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
            Save hours every week. Safe Gemini AI limits keep your profit margins over 90%.
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
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 px-4 text-center text-xs text-zinc-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center">
              <Youtube className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bold text-white">SW Tech Solution</span>
          </div>
          <p>© {new Date().getFullYear()} SW Tech Solution. Built with Next.js, Google Gemini & Razorpay.</p>
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
