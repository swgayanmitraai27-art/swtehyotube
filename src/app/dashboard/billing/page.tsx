'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import RazorpayModal from '@/components/dashboard/RazorpayModal';
import { INDIAN_TIER_PLANS, CREDIT_PACKS, CUSTOM_ENTERPRISE_PLAN } from '@/lib/constants';
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
  Video,
  MessageSquare,
  QrCode
} from 'lucide-react';

export default function BillingPage() {
  const { profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('growth');
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
          Instant UPI (Google Pay, PhonePe, Paytm, QR), NetBanking & All Indian Cards se upgrade karein.
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
          onClick={() => openCheckout('growth')}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-bold shadow-lg shadow-rose-600/25 flex items-center gap-2 transition-all hover:scale-105"
        >
          <QrCode className="w-4 h-4" />
          Upgrade Plan / Pay with UPI
        </button>
      </div>

      {/* Monthly / Yearly Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Indian Creator Growth Plans (₹ INR)
          </h3>
          <p className="text-xs text-zinc-400">Choose the ideal capacity for your channel size (Instant UPI & Cards).</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Billing Cycle Switch */}
          <div className="inline-flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-bold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                billingCycle === 'monthly' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md shadow-rose-600/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Yearly (2 Mo Free 🎁)</span>
            </button>
          </div>
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
                  {plan.popular && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      🔥 MAIN TARGET
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400 block mb-3 line-clamp-2">{plan.idealFor}</span>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-white">₹{price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-zinc-400">/{isYearly ? 'year' : 'month'}</span>
                </div>

                <div className="mt-2 flex flex-col gap-1.5 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md text-rose-400 bg-rose-500/10">
                      Up to {credits.toLocaleString('en-IN')} AI Replies {isYearly ? '/ yr' : '/ mo'}
                    </span>
                    {isYearly && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
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

                <ul className="space-y-2 text-xs text-zinc-300 border-t border-zinc-800/80 pt-4">
                  {plan.features.map((f) => {
                    const isToxicHighlight = f.includes('Toxic') || f.includes('Spam') || f.includes('Hate Speech');
                    return (
                      <li
                        key={f}
                        className={`flex items-start gap-2 rounded-xl transition-all ${
                          isToxicHighlight
                            ? 'bg-rose-500/15 border border-rose-500/30 p-2 text-rose-200 font-semibold shadow-sm'
                            : 'p-0.5'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isToxicHighlight ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                          }`}
                        />
                        <span className="text-[11px] leading-snug">{f}</span>
                      </li>
                    );
                  })}
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
                <QrCode className="w-3.5 h-3.5" />
                {isCurrent ? 'Current Tier' : `Pay ₹${price?.toLocaleString?.('en-IN') ?? price} with UPI`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Dedicated Separate Section: Custom / DFY Enterprise ("Let's Talk") */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            💼 Custom / DFY Enterprise Plan ("Let's Talk")
          </div>
          <h3 className="text-xl font-bold text-white mb-1.5">
            Full Done-For-You (DFY) Layout with Dedicated Server Nodes
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed mb-4">
            Bade YouTube Media Networks, Coaching Institutes aur Creator Agencies ke liye jinko <strong>Unlimited / Custom Monthly AI Replies</strong>, Full Done-For-You setup aur Dedicated High-Speed Server Nodes chahiye. Founder se direct baat karke custom quote aur 1-on-1 setup lein.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Unlimited / Custom Monthly AI Reply Volume
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Dedicated Server Nodes & Full DFY Layout
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Direct Founder Phone & WhatsApp Setup (+91 8303994616)
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
          <a
            href={`https://wa.me/918303994616?text=${encodeURIComponent(
              `Namaste SW Tech Team! Mujhe Custom DFY Enterprise Plan ("Let's Talk") ke bare me discuss karna hai. Channel: ${profile?.channelTitle || 'My Channel'}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp (+91 8303994616)</span>
          </a>
          <a
            href="tel:+918303994616"
            className="px-6 py-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct Call: 8303994616</span>
          </a>
        </div>
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
              `Namaste SW Tech Team! Main paid member hoon (${profile?.plan} plan). Mujhe apna 5-Minute Live Video Setup Call schedule karna hai. Channel: ${profile?.channelTitle || 'My Channel'}`
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
          Pay-As-You-Go Extra Credit Packs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {CREDIT_PACKS.map((pack) => {
            const packPrice = `₹${pack.price}`;
            return (
              <div
                key={pack.id}
                className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <span className="font-bold text-sm text-white block">{pack.name}</span>
                  <span className="text-xs text-zinc-400">{pack.credits.toLocaleString('en-IN')} Replies</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-base font-bold text-rose-400">{packPrice}</span>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-rose-600 hover:text-white text-xs font-semibold text-zinc-200 transition-colors"
                  >
                    Buy Pack
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Trust Badge */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center gap-3 text-xs text-zinc-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        100% Encrypted & Secure Razorpay UPI (Google Pay, PhonePe, Paytm, BHIM, QR), NetBanking & All Debit/Credit Cards.
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
