'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/dashboard/AuthModal';
import { Youtube, Sparkles, ArrowRight, User } from 'lucide-react';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('register');

  const openAuth = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg shadow-rose-600/10 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img src="/logo.png" alt="SW Reply Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                SW Tech <span className="text-rose-500 font-extrabold">AutoReply</span>
              </span>
              <span className="text-[10px] text-zinc-400 block -mt-1">Powered by Google Gemma 4 31B AI</span>
            </div>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <Link href="/playground" className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              AI Playground (Live Demo)
            </Link>
            <Link href="/tools" className="text-zinc-300 hover:text-white font-medium flex items-center gap-1 transition-colors">
              <span className="text-xs bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">FREE</span>
              Creator Tools
            </Link>
            <Link href="/#pricing" className="hover:text-white transition-colors">Pricing (₹499/mo)</Link>
            <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-md shadow-rose-600/20 transition-all hover:gap-2.5"
                >
                  Creator Studio
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Start 7-Day Free Trial
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
      />
    </>
  );
}
