'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import RazorpayModal from '@/components/dashboard/RazorpayModal';
import { INDIAN_TIER_PLANS, CREDIT_PACKS } from '@/lib/constants';
import { BillingCycle } from '@/types';
import { 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Plus, 
  Gift,
  ArrowRight,
  TrendingUp,
  Crown,
  Flame,
  Rocket,
  PhoneCall,
  Video
} from 'lucide-react';

export default function BillingPage() {
  const { profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const openCheckout = (planId: string) => {
    setSelectedPlanId(planId);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-rose-500" />
          Billing & AI Reply Credits (Indian Creator Plans)
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Upgrade your plan with instant Razorpay checkout (UPI / Cards / NetBanking) or top up credits.
        </p>
      </div>

      {/* Current Balance Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs font-semibold text-zinc-400 block mb-1">Your Active Balance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">{profile?.credits ?? 0}</span>
            <span className="text-sm font-semibold text-rose-400">Available AI Reply Credits</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Active Tier: <strong className="text-zinc-200 capitalize">{profile?.plan ? `${profile.plan} Plan` : 'Free Trial'}</strong>
          </p>
        </div>

        <button
          onClick={() => openCheckout('pro')}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-bold shadow-lg shadow-rose-600/25 flex items-center gap-2 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          Upgrade / Top Up Now
        </button>
      </div>

      {/* Monthly / Yearly Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            3-Tier Creator Plans
          </h3>
          <p className="text-xs text-zinc-400">Choose the ideal capacity for your channel size.</p>
        </div>

        <div className="inline-flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-bold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              billingCycle === 'monthly' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md shadow-rose-600/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Yearly (2 Months Free 🎁)</span>
          </button>
        </div>
      </div>

      {/* 3 Tier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INDIAN_TIER_PLANS.map((plan) => {
          const isCurrent = profile?.plan === plan.id;
          const isYearly = billingCycle === 'yearly';
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits;

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-rose-500 shadow-xl ring-1 ring-rose-500'
                  : 'bg-zinc-900/50 border-zinc-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-base text-white">{plan.name}</h4>
                  {isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400 block mb-3">{plan.idealFor}</span>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-white">₹{price.toLocaleString()}</span>
                  <span className="text-xs text-zinc-400">/{isYearly ? 'year' : 'month'}</span>
                </div>

                <div className="mt-2 flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                    {credits.toLocaleString()} AI Replies {isYearly ? '/ yr' : '/ mo'}
                  </span>
                  {isYearly && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      2 Mo Free
                    </span>
                  )}
                </div>

                <ul className="space-y-2 text-xs text-zinc-300 border-t border-zinc-800/80 pt-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => openCheckout(plan.id)}
                className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  plan.popular
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                    : isCurrent
                    ? 'bg-zinc-800 text-zinc-400'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
              >
                {isCurrent ? 'Current Tier' : `Select ${plan.name} (₹${price.toLocaleString()})`}
              </button>
            </div>
          );
        })}
      </div>

      {/* 1-Time Live Setup Video Call Assistance Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold mb-2">
            <PhoneCall className="w-3.5 h-3.5" />
            1-Time 1-on-1 Video Setup Call & Google Cloud Quota Setup
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Need Help Connecting Your Channel or Expanding Quota to 30,000 Units/day?
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            All paid plans include a dedicated 1-on-1 live 5-minute video call setup on WhatsApp. Our founder will personally screen-share with you to create your Google Cloud project, extract your Client ID/Secret, and ensure your dedicated quota is 100% active and working.
          </p>
        </div>

        {profile?.plan && profile?.plan !== 'free' ? (
          <a
            href={`https://wa.me/918303994616?text=${encodeURIComponent(
              `Hello SW Tech Team! I am an active paid member (${profile?.plan} plan). I want to schedule my 1-Time 5-Minute Live Video Setup Call with the Founder on WhatsApp. Channel: ${profile?.channelTitle || 'My Channel'}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            <span>Book 5-Min Live Setup Call 📞</span>
          </a>
        ) : (
          <button
            onClick={() => openCheckout('starter')}
            className="shrink-0 px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-rose-600 text-zinc-200 hover:text-white text-xs font-bold transition-all border border-zinc-700 flex items-center gap-2 shadow-lg"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Upgrade to Unlock Live Setup Call 🔒</span>
          </button>
        )}
      </div>

      {/* Pay-as-you-go Credit Packs */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          Pay-As-You-Go Credit Packs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-sm text-white block">{pack.name}</span>
                <span className="text-xs text-zinc-400">{pack.credits.toLocaleString()} Replies</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-base font-bold text-rose-400">₹{pack.price}</span>
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-rose-600 hover:text-white text-xs font-semibold text-zinc-200 transition-colors"
                >
                  Buy Pack
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Razorpay Trust Badge */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center gap-3 text-xs text-zinc-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        All transactions processed securely via Razorpay with instant UPI, Credit/Debit cards & NetBanking.
      </div>

      {/* Checkout Modal */}
      <RazorpayModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlanId={selectedPlanId}
      />
    </div>
  );
}
