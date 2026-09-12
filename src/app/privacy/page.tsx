import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Youtube } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | SW Tech AutoReply (SW Gyanbhumi)',
  description: 'Privacy Policy and Google User Data policy compliance for SW Tech YouTube AutoReply.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Privacy Policy</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Last Updated: September 11, 2026 • SW Tech Solution (swgayanbhumi.in)</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                1. Introduction & Overview
              </h2>
              <p>
                Welcome to <strong>SW Tech AutoReply</strong> ("we," "our," or "service"), operated by <strong>SW Tech Solution</strong> at <Link href="https://swgayanbhumi.in" className="text-rose-400 underline">swgayanbhumi.in</Link>. 
                We provide an AI-powered YouTube comment management, sentiment analysis, and auto-reply automation platform for content creators.
              </p>
              <p>
                This Privacy Policy describes how we collect, use, store, and protect your information when you connect your Google and YouTube account with our application.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                2. Google & YouTube User Data We Access
              </h2>
              <p>
                When you authenticate via Google OAuth 2.0, we request explicit permission for the following Google API scopes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li><code>https://www.googleapis.com/auth/youtube.force-ssl</code>: Used exclusively to post creator-approved or automated comment replies on your YouTube channel videos.</li>
                <li><code>https://www.googleapis.com/auth/youtube.readonly</code>: Used to fetch your channel metadata (channel title, avatar, subscriber count) and list unreplied video comment threads.</li>
                <li><code>userinfo.profile</code> & <code>userinfo.email</code>: Used to create and manage your secure account session.</li>
              </ul>
            </section>

            <section className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-rose-200">
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-400" /> Google API Limited Use Disclosure
              </h3>
              <p className="text-xs text-zinc-300">
                SW Tech AutoReply strictly adheres to the <strong>Google API Services User Data Policy</strong>, including the Limited Use requirements. 
                We do NOT sell, lease, or distribute your YouTube data to any third-party advertisers, data brokers, or external AI model training datasets.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. How We Use and Process Data</h2>
              <p>Your data is used solely for the following operational purposes:</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>To display incoming unreplied comments on your creator studio dashboard.</li>
                <li>To pass comment context into Google Gemma 4 31B IT Thinking AI (Powered by Google AI) for generating high-quality context-aware replies in 140+ languages.</li>
                <li>To post replies directly to YouTube upon your click or via your configured auto-pilot rules.</li>
                <li>To safeguard your channel's 10,000 daily YouTube API quota by pre-filtering spam and emoji-only comments locally.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Data Storage & Security</h2>
              <p>
                All user profile data and OAuth tokens are stored securely in Google Cloud Firebase Firestore with strict encryption at rest and in transit (HTTPS/TLS). 
                We do not download or store video files or media assets; we only reference direct YouTube CDN links.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. User Control & Data Deletion</h2>
              <p>
                You retain complete ownership and control over your YouTube data:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>You can disconnect your YouTube channel at any time from your Creator Studio settings.</li>
                <li>You can revoke app permissions directly from your <Link href="https://myaccount.google.com/permissions" target="_blank" className="text-rose-400 underline">Google Account Permissions Manager</Link>.</li>
                <li>To request complete deletion of your account and tokens, email us at <strong className="text-white">swgayanmitraai27@gmail.com</strong>, and all your records will be purged within 48 hours.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">6. Contact Information</h2>
              <p>For any privacy-related questions or data requests, please contact:</p>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                <p><strong>Company:</strong> SW Tech Solution</p>
                <p><strong>Website:</strong> <Link href="https://swgayanbhumi.in" className="text-rose-400">https://swgayanbhumi.in</Link></p>
                <p><strong>Email:</strong> swgayanmitraai27@gmail.com</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} SW Tech Solution. All rights reserved.
      </footer>
    </div>
  );
}
