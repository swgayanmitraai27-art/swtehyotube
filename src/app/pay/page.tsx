'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Trophy, ShieldCheck, Zap, ArrowLeft, CheckCircle2, AlertCircle, Coins, Sparkles, Loader2 } from 'lucide-react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const app = searchParams.get('app') || 'skillwinner';
  const userId = searchParams.get('userId') || searchParams.get('uid') || 'guest_user';
  const initialAmount = Number(searchParams.get('amount')) || 50;

  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<{ real: number; bonus: number; txId: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [razorpayReady, setRazorpayReady] = useState<boolean>(false);

  const isSkillWinner = app.toLowerCase().includes('skill') || app.toLowerCase().includes('esport');

  const presetPacks = [
    { real: 10, bonus: 1, label: 'Starter Pack', tag: 'Fast Match' },
    { real: 20, bonus: 2, label: 'Pro Pack', tag: '+10% Bonus' },
    { real: 50, bonus: 5, label: 'Gamer Choice', tag: 'Popular', popular: true },
    { real: 100, bonus: 10, label: 'Champion Pack', tag: '+10% Extra Cash' },
    { real: 200, bonus: 20, label: 'Esports Legend', tag: 'Max Value' },
    { real: 500, bonus: 50, label: 'VIP Pack', tag: 'Mega Bonus' },
  ];

  const currentAmount = customAmount ? Number(customAmount) : selectedAmount;
  const currentBonus = Number((currentAmount * 0.10).toFixed(2)); // 10% Extra Deposit Cash

  const handlePayNow = async () => {
    if (currentAmount < 10) {
      setErrorMsg('Minimum deposit amount is ₹10');
      return;
    }
    setErrorMsg('');
    setIsProcessing(true);

    try {
      // 1. Create order on backend
      const res = await fetch('/api/skillwinner/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: currentAmount,
          name: isSkillWinner ? 'SkillWinner Player' : 'SW Tech Customer',
        }),
      });

      const data = await res.json();
      if (!data.success || !data.orderId) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      // 2. Open Razorpay Checkout (Pre-filled to skip phone number & go direct to UPI QR)
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: isSkillWinner ? 'SkillWinner Esports' : 'SW Tech Solution',
        description: data.description || `Add ₹${currentAmount} to Wallet`,
        order_id: data.orderId,
        image: isSkillWinner ? 'https://swgayanbhumi.in/logo.png' : 'https://swgayanbhumi.in/logo.png',
        prefill: {
          name: 'Gamer',
          email: 'gamer@swgayanbhumi.in',
          contact: '9876543210',
          method: 'upi',
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI / QR Code / GPay / PhonePe',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['qr', 'intent', 'collect'],
                  },
                ],
              },
            },
            sequence: ['block.upi'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/skillwinner/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                amount: currentAmount,
                bonusCoins: currentBonus,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setPaymentDetails({
                real: currentAmount,
                bonus: currentBonus,
                txId: response.razorpay_payment_id,
              });
              setPaymentSuccess(true);
            } else {
              setErrorMsg(verifyData.error || 'Payment verification failed');
            }
          } catch (err: any) {
            setErrorMsg(err.message || 'Payment verification error');
          } finally {
            setIsProcessing(false);
          }
        },
        theme: {
          color: isSkillWinner ? '#E50914' : '#6366F1',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Razorpay SDK is not ready yet. Please try again in a few seconds.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
      setIsProcessing(false);
    }
  };

  if (paymentSuccess && paymentDetails) {
    return (
      <div className="min-h-screen bg-[#0A0E17] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#121826] border border-emerald-500/30 rounded-3xl p-6 md:p-8 text-center shadow-2xl shadow-emerald-500/10 animate-fade-in">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-400 text-sm mb-6">Your wallet has been credited with 10% Extra Deposit Cash.</p>

          <div className="bg-[#1A2234] rounded-2xl p-4 mb-6 border border-gray-800 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Real Cash Paid</span>
              <span className="font-bold text-emerald-400 text-base">₹{paymentDetails.real}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">10% Extra Deposit Bonus</span>
              <span className="font-bold text-amber-400 text-base">+₹{paymentDetails.bonus}</span>
            </div>
            <div className="pt-2 border-t border-gray-700/60 flex justify-between items-center text-sm">
              <span className="text-gray-300 font-semibold">Total Deposit Cash Added</span>
              <span className="font-extrabold text-white text-lg">₹{Number((paymentDetails.real + paymentDetails.bonus).toFixed(2))}</span>
            </div>
            <div className="text-[11px] text-gray-500 pt-1">
              Transaction ID: <span className="font-mono text-gray-400">{paymentDetails.txId}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.opener) {
                window.close();
              } else {
                window.location.href = 'https://booyehreward.vercel.app';
              }
            }}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Booyah Rewards App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
      />

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-lg w-full bg-[#0F1422]/90 backdrop-blur-xl border border-red-500/20 rounded-3xl p-5 md:p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-800/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 via-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/30 p-2">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">SKILLWINNER</h1>
                <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/30 uppercase tracking-wider">
                  Esports Hub
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Powered by SW Tech Solution
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-gray-400">Player ID</div>
            <div className="text-xs font-mono font-bold text-amber-400 max-w-[100px] truncate">{userId}</div>
          </div>
        </div>

        {/* 10% Extra Deposit Cash Banner */}
        <div className="bg-gradient-to-r from-red-950/60 via-orange-950/40 to-amber-950/60 border border-orange-500/30 rounded-2xl p-3.5 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-orange-300">10% Instant Extra Deposit Cash Active!</div>
            <div className="text-gray-400 text-[11px]">Recharge any amount (Min ₹10) and get 10% extra deposit cash added directly to your Deposit Balance.</div>
          </div>
        </div>

        {/* Select Package */}
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-3">
            Select Deposit Amount
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {presetPacks.map((pack) => {
              const isSelected = selectedAmount === pack.real && !customAmount;
              return (
                <button
                  key={pack.real}
                  onClick={() => {
                    setSelectedAmount(pack.real);
                    setCustomAmount('');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-500/15 border-red-500 text-white shadow-lg shadow-red-500/20 scale-[1.02]'
                      : 'bg-[#151C2C] border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase">
                      HOT
                    </span>
                  )}
                  <div className="text-lg font-black text-white">₹{pack.real}</div>
                  <div className="text-[11px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                    <Coins className="w-3 h-3" /> +₹{pack.bonus} Extra Cash
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Amount Input */}
          <div className="mt-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                placeholder="Or enter custom amount (Min ₹10, No Limit)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Calculation Box */}
        <div className="bg-[#151C2C] rounded-2xl p-4 border border-gray-800/80 mb-6 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Recharge Amount (Cash Paid)</span>
            <span className="font-bold text-white">₹{currentAmount}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">10% Extra Deposit Cash Bonus</span>
            <span className="font-bold text-emerald-400">+₹{currentBonus}</span>
          </div>
          <div className="pt-2 border-t border-gray-700/50 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-200">Total Deposit Cash Credited</span>
            <span className="text-lg font-black text-emerald-400">₹{Number((currentAmount + currentBonus).toFixed(2))}</span>
          </div>
          <div className="text-[10px] text-gray-500 pt-1">
            * 100% usable to join tournaments. Ad Coins (🟡) are earned exclusively by watching ads.
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black py-4 px-6 rounded-2xl transition shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-current" /> Pay ₹{currentAmount} via UPI / QR / Cards
            </>
          )}
        </button>

        {/* Footer Security Badges */}
        <div className="mt-5 text-center flex items-center justify-center gap-4 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Secure Razorpay
          </span>
          <span>•</span>
          <span>Instant Wallet Credit</span>
          <span>•</span>
          <span>24x7 Support</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070A12] text-white flex items-center justify-center font-bold">Loading Checkout Hub...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
