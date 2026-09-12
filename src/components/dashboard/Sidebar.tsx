'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquareReply, 
  Bot, 
  Sliders, 
  CreditCard, 
  Youtube, 
  Sparkles,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Playground', href: '/dashboard/playground', icon: Sparkles, badge: 'NEW' },
    { name: 'Live Comments', href: '/dashboard/comments', icon: MessageSquareReply, badge: 'Copilot' },
    { name: 'Auto-Pilot Rules', href: '/dashboard/auto-pilot', icon: Bot, badge: profile?.autoPilotEnabled ? 'ON' : 'OFF' },
    { name: 'AI Persona & Tone', href: '/dashboard/settings', icon: Sliders },
    { name: 'Billing & Credits', href: '/dashboard/billing', icon: CreditCard, badge: `${profile?.credits ?? 0} cr` },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Logo Section */}
        <div className="h-16 px-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
            <Youtube className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white leading-tight">SW Tech Solution</h1>
            <p className="text-[10px] text-zinc-400">YouTube AutoReply Studio</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-600/10 text-rose-500 border border-rose-500/20 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-500' : 'text-zinc-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      item.badge === 'ON'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isActive
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pro Plan Status Card */}
      <div className="p-4 m-3 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-900/40 border border-zinc-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {profile?.plan === 'pro' ? 'Pro Creator Plan' : profile?.plan === 'starter' ? 'Starter Plan' : profile?.plan === 'enterprise' ? 'Enterprise' : 'Free Trial'}
          </span>
          <span className="text-[10px] text-zinc-500">{profile?.credits || 0} Credits Left</span>
        </div>
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-rose-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, ((profile?.credits || 0) / 500) * 100)}%` }}
          />
        </div>
        <Link
          href="/dashboard/billing"
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-3 h-3 text-rose-400" />
          Upgrade to ₹499/mo
        </Link>
      </div>
    </aside>
  );
}
