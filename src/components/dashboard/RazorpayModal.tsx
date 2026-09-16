import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, X, Gift, Crown, Flame, Rocket, PhoneCall, Video, MessageSquare, QrCode } from 'lucide-react';
import { INDIAN_TIER_PLANS, CREDIT_PACKS, CUSTOM_ENTERPRISE_PLAN } from '@/lib/constants';
import { BillingCycle } from '@/types';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayModal({ isOpen, onClose, selectedPlanId = 'growth' }: RazorpayModalProps) {
  const { user, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'plan' | 'credits'>('plan');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState(selectedPlanId === 'premium' ? 'growth' : selectedPlanId === 'standard' ? 'starter' : selectedPlanId === 'enterprise' ? 'pro' : selectedPlanId);
  const [selectedPack, setSelectedPack] = useState(CREDIT_PACKS[0]?.id || 'pack_200');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      setError('Please log in first to continue checkout.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 1. Create order on backend in INR
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          planId: activeTab === 'plan' ? selectedPlan : undefined,
          billingCycle: activeTab === 'plan' ? billingCycle : undefined,
          packId: activeTab === 'credits' ? selectedPack : undefined,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order');
      }

      // 2. Open Razorpay Modal with UPI, QR, PhonePe, GPay & Cards
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'SW Tech Solution',
        description: orderData.description,
        order_id: orderData.orderId,
        prefill: {
          name: user.displayName || 'Creator',
          email: user.email || '',
        },
        theme: {
          color: '#E11D48',
        },
        handler: async (response: any) => {
          try {
            // 3. Verify payment signature on backend
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uid: user.uid,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planId: activeTab === 'plan' ? selectedPlan : undefined,
                billingCycle: activeTab === 'plan' ? billingCycle : undefined,
                packId: activeTab === 'credits' ? selectedPack : undefined,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setSuccess(true);
              await refreshProfile();
            } else {
              throw new Error(verifyData.error || 'Payment signature verification failed');
            }
          } catch (verErr: any) {
            setError(verErr.message || 'Verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full p-5 sm:p-6 relative shadow-2xl my-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            setSuccess(false);
          }}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Payment Successful! 🎉</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-6">
              Aapka plan aur AI reply credits turant channel par activate ho gaye hain. Aapka auto-pilot mode ready hai!
            </p>

            {/* 1-on-1 WhatsApp Live Video Setup Call Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 text-left mb-6 shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                  <PhoneCall className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-bold text-white">Book Your 1-on-1 Live 5-Min Video Setup Call</h4>
              </div>
              <p className="text-xs text-zinc-300 mb-4">
                Founder ke sath WhatsApp par direct 5-minute video call schedule karein jahan hum aapka Google Cloud Quota aur AI persona prompt setup karwayenge!
              </p>

              <a
                href={`https://wa.me/918303994616?text=${encodeURIComponent(
                  `🎉 Namaste SW Tech Team! Maine plan purchase kiya hai (${user.displayName || 'Creator'}). Mujhe apna 1-on-1 WhatsApp Video Setup Call schedule karna hai!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
              >
                <Video className="w-4 h-4" />
                <span>Book 5-Min Live Setup Call on WhatsApp 📞</span>
              </a>
            </div>

            <button
              onClick={() => {
                onClose();
                setSuccess(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all"
            >
              Continue to Dashboard 🚀
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-600/10 text-rose-500 border border-rose-500/20">
                  <Zap className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-extrabold text-white">Select Your Plan (Instant UPI & Cards)</h3>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Google Pay, PhonePe, Paytm, QR, NetBanking aur All Debit/Credit Cards se instant activation.
            </p>

            {/* Tab: Plan vs Credit Packs */}
            <div className="flex bg-zinc-900 p-1 rounded-xl mb-4">
              <button
                onClick={() => setActiveTab('plan')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'plan' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Monthly / Yearly Plans
              </button>
              <button
                onClick={() => setActiveTab('credits')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'credits' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Pay-As-You-Go Packs
              </button>
            </div>

            {/* Monthly vs Yearly Toggle with "2 Months Free" discount */}
            {activeTab === 'plan' && (
              <div className="flex items-center justify-center gap-3 bg-zinc-900/60 border border-zinc-800/80 p-2 rounded-2xl mb-4">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    billingCycle === 'yearly'
                      ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md shadow-rose-600/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Yearly (2 Months Free Applied 🎁)</span>
                </button>
              </div>
            )}

            {/* Plans List */}
            {activeTab === 'plan' && (
              <div className="space-y-2.5 mb-5 max-h-[340px] overflow-y-auto pr-1">
                {INDIAN_TIER_PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  const isYearly = billingCycle === 'yearly';
                  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
                  const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative ${
                        isSelected
                          ? 'bg-rose-950/30 border-rose-500 text-white shadow-lg ring-1 ring-rose-500/50'
                          : 'bg-zinc-900/40 border-zinc-800/90 text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          🔥 MOST POPULAR
                        </span>
                      )}

                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-extrabold text-sm text-white">{plan.name}</span>
                          <span className="text-[11px] text-zinc-400 block">{plan.idealFor}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-white">₹{price.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-zinc-400">/{isYearly ? 'yr' : 'mo'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 mt-1 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md text-rose-400 bg-rose-500/10">
                            {credits.toLocaleString('en-IN')} AI Replies {isYearly ? '/ yr' : '/ mo'}
                          </span>
                          {isYearly && (
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                              🎁 2 Months Free Applied
                            </span>
                          )}
                        </div>
                        {plan.competitorAdvantage && (
                          <div className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            {plan.competitorAdvantage}
                          </div>
                        )}
                      </div>

                      <ul className="text-[11px] text-zinc-400 space-y-1 border-t border-zinc-800/60 pt-2">
                        {plan.features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Credit Packs */}
            {activeTab === 'credits' && (
              <div className="space-y-2.5 mb-5">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span><strong>No plan upgrade needed:</strong> Instant 1-time credit refill added immediately to your channel balance!</span>
                </div>
                {CREDIT_PACKS.map((pack) => {
                  const isSelected = selectedPack === pack.id;
                  const packPrice = `₹${pack.price}`;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => setSelectedPack(pack.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-950/30 border-rose-500 text-white ring-1 ring-rose-500'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-white">{pack.name}</div>
                        <span className="text-xs text-zinc-400">{pack.credits.toLocaleString('en-IN')} AI comment replies</span>
                      </div>
                      <span className="text-base font-extrabold text-rose-400">{packPrice}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Pay Now Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              <QrCode className="w-4 h-4" />
              {loading ? 'Opening UPI & Payment Gateway...' : 'Pay with UPI (GPay / PhonePe / Paytm / QR) & Cards'}
            </button>

            {/* Custom Bulk / Let's Talk Section */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-zinc-900 to-zinc-950 border border-emerald-500/30 text-center">
              <span className="text-xs font-bold text-emerald-400 block mb-1">
                💼 Large Media Network, Coaching Institute ya Agency? ("Let's Talk")
              </span>
              <p className="text-[11px] text-zinc-400 mb-2">
                Unlimited AI Replies, Dedicated High-Speed Server Node aur Full DFY Layout ke liye founder se direct baat karein.
              </p>
              <a
                href={`https://wa.me/918303994616?text=${encodeURIComponent(
                  'Namaste SW Tech Team! Mujhe Custom Enterprise / DFY Plan (Let\'s Talk) ke bare me baat karni hai.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Founder on WhatsApp (+91 8303994616)</span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Encrypted & Secure Razorpay UPI (Google Pay, PhonePe, Paytm, QR) & NetBanking
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
