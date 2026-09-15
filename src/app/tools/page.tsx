'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Gift, FileSpreadsheet, ShieldAlert, Sparkles, ArrowRight, CheckCircle2, Zap, Trophy, Download, BarChart3, HelpCircle } from 'lucide-react';

export default function ToolsHubPage() {
  const tools = [
    {
      id: 'giveaway-picker',
      title: 'YouTube Random Giveaway Comment Picker',
      badge: '🔥 Most Popular',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      icon: Gift,
      iconBg: 'bg-gradient-to-tr from-rose-600 to-red-500 text-white',
      description: 'Pick 100% fair and transparent winners for your YouTube giveaways, contests, and prize raffles. Filter duplicate users and required hashtags (#giveaway) with celebratory winner animations!',
      href: '/tools/giveaway-picker',
      cta: 'Launch Giveaway Picker (Free)',
      features: ['Filter duplicate comments', 'Filter by required hashtag / keyword', 'Live animated spinner & confetti celebration', 'Shareable winner proof card'],
    },
    {
      id: 'export-comments',
      title: 'YouTube Comments Exporter (CSV & Excel)',
      badge: '⚡ 1-Click Export',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: FileSpreadsheet,
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white',
      description: 'Download every comment from any public YouTube video directly into a clean CSV file ready for Excel, Google Sheets, or data analysis.',
      href: '/tools/export-comments',
      cta: 'Export Comments to CSV (Free)',
      features: ['Exports author name, channel URL, timestamp', 'Full comment text & like counts', 'Clean UTF-8 CSV download for Excel', 'No login or credit card required'],
    },
    {
      id: 'comment-audit',
      title: 'YouTube Channel Comment Health & Spam Audit',
      badge: '🛡️ AI Scanner',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: ShieldAlert,
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white',
      description: 'Run an instant deep AI scan on any video to detect spam/scam percentage, viewer sentiment score, question categories, and response time metrics.',
      href: '/tools/comment-audit',
      cta: 'Run Free AI Comment Audit',
      features: ['Spam / crypto scam % detector', 'Positive vs Negative sentiment breakdown', 'Comment Health Score (A+ to F)', 'AI-powered action suggestions'],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-4 shadow-lg shadow-rose-500/5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            100% Free YouTube Creator Tools Suite
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Free Utility Tools Built for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-500 to-amber-400">
              Serious YouTube Creators
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-4 leading-relaxed">
            Boost engagement, run transparent giveaways, backup comments, and audit comment section health without paying a single dollar.
          </p>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all hover:-translate-y-1 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${tool.iconBg} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2.5 group-hover:text-rose-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                    {tool.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 mb-8 border-t border-zinc-800/80 pt-5">
                    {tool.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={tool.href}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md group-hover:bg-rose-600"
                >
                  <span>{tool.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Upgrade Banner to AI AutoReply */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-rose-950/40 border border-rose-500/30 p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
              Automate Your Channel 24/7
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-4">
              Ready to reply to 100% of your YouTube comments with AI?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 leading-relaxed">
              Experience the power of Google Gemma 4 31B AI with automatic @username mentions, multi-tone voice tuning, and multi-project quota multipliers.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
              >
                Start 7-Day Free Trial (100 Free Replies)
              </Link>
              <Link
                href="/#pricing"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:bg-zinc-800 font-bold text-xs transition-all"
              >
                View Plans ($39/mo)
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
