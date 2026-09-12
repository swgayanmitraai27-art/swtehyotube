'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import AIPlayground from '@/components/dashboard/AIPlayground';
import Link from 'next/link';
import { Youtube, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PublicPlaygroundPage() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <AIPlayground />

        {/* Bottom CTA to Connect YouTube */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-900 border border-rose-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30">
              <Youtube className="w-6 h-6 text-white fill-white" />
            </div>
            <h3 className="text-2xl font-black text-white">
              Ready to Automate Your Real YouTube Channel?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Connect your YouTube channel in 1 click to get <strong>50 Free Trial Credits</strong>, automatic background sync, and smart quota protection!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 flex items-center gap-2 transition-all hover:scale-105"
                >
                  Open Creator Studio Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-bold shadow-lg shadow-rose-600/25 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Youtube className="w-4 h-4 fill-white" />
                  1-Click Connect YouTube Channel (Free Trial)
                </button>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Safe OAuth 2.0 • No Credit Card Required
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 text-xs text-zinc-400 mt-auto text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center">
              <Youtube className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bold text-white">SW Tech Solution</span>
          </div>
          <div className="flex items-center gap-6 justify-center">
            <Link href="/privacy" className="hover:text-rose-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-rose-400 transition-colors">Terms of Service</Link>
          </div>
          <p>© {new Date().getFullYear()} SW Tech Solution • Powered by Google Gemma 4 31B AI</p>
        </div>
      </footer>
    </div>
  );
}
