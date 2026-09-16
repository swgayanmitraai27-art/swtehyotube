'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Sparkles, 
  Youtube, 
  Sliders, 
  Bot, 
  MessageSquareReply, 
  Gift, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  HelpCircle,
  Zap,
  PlayCircle,
  Compass,
  Rocket
} from 'lucide-react';

export interface TourStep {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  tips: string[];
}

export function InteractiveTour() {
  const router = useRouter();
  const pathname = usePathname();
  const { isYouTubeConnected, connectYouTubeChannel, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGcpGuideOpen, setIsGcpGuideOpen] = useState(false);

  const completeTour = () => {
    localStorage.setItem('swtech_tour_completed_v1', 'true');
    setIsOpen(false);
  };

  const steps: TourStep[] = [
    {
      id: 1,
      title: 'Welcome to SW Tech YouTube Studio! 👋',
      subtitle: 'Aapka AI-Powered Auto-Reply & Channel Growth Partner',
      badge: 'Step 1 of 5 • Introduction',
      icon: Rocket,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/20 border-rose-500/30',
      description: 'Yeh interactive guide aapko 2 minute me sikhayega ki kaise apne YouTube channel par Google Gemma 4 31B IT AI setup karein aur har video comment ka instant smart reply automate karein.',
      tips: [
        '100% YouTube API v3 Compliant & Safe OAuth 2.0',
        'Natural Hinglish, Hindi & 140+ International Languages',
        'Daily 10,000 Quota Saver + Spam & Abusive Comment Auto-Purge'
      ]
    },
    {
      id: 2,
      title: 'Step 1: Connect YouTube Channel 🔗',
      subtitle: 'Apne YouTube Channel ko connect karein',
      badge: 'Step 2 of 5 • Connection',
      icon: Youtube,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/20 border-red-500/30',
      description: isYouTubeConnected 
        ? `Aapka channel "${profile?.channelTitle || 'YouTube'}" already successfully linked hai! 🎉 Ab next step par chaliye.`
        : 'Apna channel connect karne ke liye 1-Click Google OAuth button dabayein. Zero manual keys, zero technical setup.',
      actionText: isYouTubeConnected ? 'Channel Connected ✅' : 'Connect Channel (1-Click) 🚀',
      onAction: () => {
        if (!isYouTubeConnected) {
          connectYouTubeChannel();
        }
      },
      tips: [
        '100% Automated: Instant 1-Click Connect with zero Google Cloud setup',
        'Lightning Fast: 24/7 background AI comment monitoring & auto-replies',
        'Encrypted & Safe: Official Google YouTube Data API v3 OAuth 2.0'
      ]
    },
    {
      id: 3,
      title: 'Step 2: AI Persona & Custom Tone 🎭',
      subtitle: 'AI ko sikhayein aapki tarah bolna',
      badge: 'Step 3 of 5 • Persona Settings',
      icon: Sliders,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/20 border-indigo-500/30',
      description: 'Persona Settings page par jakar apna Channel Category (EdTech, Tech, Vlog, Gaming), Tone (Friendly, Mentor, Witty), Language Style (Hinglish/Hindi/English) aur Custom Signature set karein.',
      actionText: 'Open Persona Settings ⚙️',
      actionHref: '/dashboard/settings',
      tips: [
        'App Promotion: Apna App Download Link ya Course Website add karein',
        'Custom CTA: Har reply ke end me apna custom call-to-action add karein',
        'Spam Protection: Blacklisted keywords & spam filters configure karein'
      ]
    },
    {
      id: 4,
      title: 'Step 3: 24/7 Auto-Pilot Engine 🤖',
      subtitle: 'Comments ka automatically reply karein',
      badge: 'Step 4 of 5 • Auto-Pilot',
      icon: Bot,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20 border-emerald-500/30',
      description: 'Auto-Pilot switch ko ON karein! Jab bhi koi viewer aapki video par comment karega, AI automatically within 60 seconds natural reply post kar dega.',
      actionText: 'Go to Auto-Pilot Settings ⚡',
      actionHref: '/dashboard/auto-pilot',
      tips: [
        'Background Sync: 24/7 bina browser open rakhe chalta hai',
        'Smart Safety Guard: Emoji-only aur spam comments ko filter karke quota bachaata hai',
        'Auto-Like: Reply karte hi viewer ka comment auto-like/heart bhi ho jata hai'
      ]
    },
    {
      id: 5,
      title: 'Step 4: Live Comments Feed & AI Playground 💬',
      subtitle: 'Comments manage karein & AI test karein',
      badge: 'Step 5 of 5 • Ready to Launch',
      icon: MessageSquareReply,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20 border-amber-500/30',
      description: 'Live Comments feed me sabhi unreplied comments ko ek jagah dekhein, 1-Click me AI suggestion generate karein aur instant post karein!',
      actionText: 'Open Live Comments Studio 💬',
      actionHref: '/dashboard/comments',
      tips: [
        'AI Playground: Kisi bhi custom prompt ya comment par AI reply test karein',
        'Free Tools: Giveaway Winner Picker, CSV Export & Spam Audit tools use karein',
        'Direct Founder Call: Kisi bhi problem ke liye WhatsApp Live Setup (+91 8303994616)'
      ]
    }
  ];

  const current = steps[currentStep];
  const Icon = current.icon;

  const handleAction = () => {
    if (current.onAction) {
      current.onAction();
    } else if (current.actionHref) {
      router.push(current.actionHref);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setCurrentStep(0);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600/20 to-amber-600/20 hover:from-rose-600/30 hover:to-amber-600/30 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all shadow-sm group"
      >
        <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
        <span>App Setup Tour 🚀</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-600/15 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-lg ${current.iconBg}`}>
                  <Icon className={`w-5 h-5 ${current.iconColor}`} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                    {current.badge}
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {current.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={completeTour}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full bg-zinc-800 h-1 rounded-full my-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-rose-500 to-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="space-y-4 py-2">
              <p className="text-xs text-zinc-300 leading-relaxed">
                {current.description}
              </p>

              {current.actionText && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAction}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {current.actionText}
                  </button>

                  {current.id === 2 && (
                    <button
                      type="button"
                      onClick={() => setIsGcpGuideOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition-all flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      View GCP 5-Step Guide
                    </button>
                  )}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2 mt-3">
                <div className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Key Highlights &amp; Pro Tips:
                </div>
                <div className="space-y-1.5">
                  {current.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-zinc-800 flex items-center justify-between gap-3 mt-4">
              <button
                type="button"
                onClick={completeTour}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Skip Tour
              </button>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
                  >
                    Next Step <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={completeTour}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                  >
                    Get Started 🎉 <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function QuickLaunchChecklist() {
  const router = useRouter();
  const { isYouTubeConnected, connectYouTubeChannel, profile } = useAuth();
  const [isGcpGuideOpen, setIsGcpGuideOpen] = useState(false);

  const checklist = [
    {
      id: 1,
      title: 'Google Account Authentication',
      desc: 'Logged in as creator',
      done: true,
      action: null,
    },
    {
      id: 2,
      title: 'Connect YouTube Channel',
      desc: isYouTubeConnected ? `Connected to ${profile?.channelTitle || 'Channel'}` : 'Link your YouTube channel to start AI auto-replies',
      done: Boolean(isYouTubeConnected),
      action: !isYouTubeConnected ? (
        <button
          onClick={connectYouTubeChannel}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
        >
          <Youtube className="w-3.5 h-3.5" />
          <span>1-Click Connect</span>
        </button>
      ) : null,
    },
    {
      id: 3,
      title: 'Configure AI Persona & Tone',
      desc: 'Set EdTech/Tech niche, language, signature & App links',
      done: Boolean(profile?.channelTitle),
      action: (
        <button
          onClick={() => router.push('/dashboard/settings')}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-bold border border-zinc-700 transition-all"
        >
          Setup Persona →
        </button>
      ),
    },
    {
      id: 4,
      title: 'Enable 24/7 Auto-Pilot Switch',
      desc: profile?.autoPilotEnabled ? 'Auto-pilot is currently active and monitoring comments' : 'Turn on background AI comment auto-replying',
      done: Boolean(profile?.autoPilotEnabled),
      action: (
        <button
          onClick={() => router.push('/dashboard/auto-pilot')}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-bold border border-zinc-700 transition-all"
        >
          {profile?.autoPilotEnabled ? 'Configured' : 'Turn ON →'}
        </button>
      ),
    },
  ];

  const completedCount = checklist.filter((item) => item.done).length;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-950 border border-zinc-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              New Creator Launch Checklist
            </h3>
            <p className="text-xs text-zinc-400">
              Complete these 4 steps to start 24/7 automatic AI replies on your channel
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            {completedCount} of 4 Completed
          </span>
        </div>
      </div>

      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-5">
        <div
          className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / 4) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
              item.done
                ? 'bg-zinc-950/60 border-emerald-500/30'
                : 'bg-zinc-950/40 border-zinc-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
                    {item.id}
                  </div>
                )}
              </div>
              <div>
                <div className={`text-xs font-bold ${item.done ? 'text-zinc-200 line-through opacity-80' : 'text-white'}`}>
                  {item.title}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</div>
              </div>
            </div>

            {item.action && <div className="shrink-0">{item.action}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
