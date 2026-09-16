import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Youtube, Server, Database, Sparkles, UserX, Trash2, Mail } from 'lucide-react';

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
              <p className="text-xs text-zinc-400 mt-0.5">Last Updated: September 16, 2026 • SW Tech Solution (swgayanbhumi.in)</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 space-y-6 leading-relaxed">
            {/* 1. Introduction */}
            <section>
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                1. Introduction &amp; Overview
              </h2>
              <p>
                Welcome to <strong>SW Tech AutoReply</strong> (&quot;we,&quot; &quot;our,&quot; &quot;us,&quot; or &quot;Application&quot;), operated by <strong>SW Tech Solution</strong> at <Link href="https://swgayanbhumi.in" className="text-rose-400 underline">swgayanbhumi.in</Link>. 
                SW Tech AutoReply is an AI-powered YouTube comment management, sentiment analysis, and creator community engagement platform designed to help YouTube creators respond intelligently to their video comments.
              </p>
              <p>
                We are committed to protecting your privacy and handling Google and YouTube user data with the highest standards of security, transparency, and compliance. This Privacy Policy details the types of data we collect, how it is used, how it is stored, and <strong>with whom Google user data is shared, transferred, or disclosed</strong>.
              </p>
            </section>

            {/* 2. Google & YouTube User Data We Access */}
            <section>
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                2. Google &amp; YouTube User Data We Access
              </h2>
              <p>
                When you sign in and authenticate with Google OAuth 2.0, our application requests access to the following minimum necessary Google API scopes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                <li>
                  <strong className="text-white"><code>https://www.googleapis.com/auth/youtube.force-ssl</code>:</strong> Used strictly to post creator-approved or automated comment replies to comment threads on your YouTube videos, and to moderate or delete abusive/spam comments according to your configured persona settings.
                </li>
                <li>
                  <strong className="text-white"><code>https://www.googleapis.com/auth/youtube.readonly</code>:</strong> Used to view your channel metadata (channel title, channel ID, subscriber count, avatar) and retrieve incoming top-level comments and comment replies from your uploaded videos.
                </li>
                <li>
                  <strong className="text-white"><code>userinfo.profile</code> &amp; <code>userinfo.email</code>:</strong> Used solely to authenticate your creator account session, verify your identity, and display your creator profile details in the studio dashboard.
                </li>
              </ul>
            </section>

            {/* 3. How We Use and Process Google User Data */}
            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. How We Use and Process Google User Data</h2>
              <p>We access and process Google user data strictly for providing user-facing features requested by the creator, including:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li>Displaying incoming unreplied comments in your creator studio feed.</li>
                <li>Analyzing comment sentiment and generating context-aware suggested replies tailored to your chosen niche, tone, and language preferences.</li>
                <li>Executing comment replies on your YouTube channel upon manual creator approval or via user-activated 24/7 Auto-Pilot rules.</li>
                <li>Conserving your daily YouTube API quota by executing local client-side spam, toxic language, and emoji-only pre-filtering.</li>
              </ul>
            </section>

            {/* 4. DATA SHARING DISCLOSURE (CRITICAL FOR GOOGLE VERIFICATION) */}
            <section className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 text-rose-400">
                <Lock className="w-5 h-5 text-rose-400 shrink-0" />
                4. With Whom We Share, Transfer, or Disclose Google User Data
              </h2>
              <p className="text-zinc-300">
                In compliance with Google API Services User Data Policy requirements, we provide full disclosure regarding all entities with whom Google user data is shared, transferred, or disclosed:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                    <Server className="w-4 h-4 text-emerald-400" />
                    A. Authorized Service Providers &amp; Sub-Processors
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    We only share Google user data with trusted third-party service providers (sub-processors) who are strictly necessary to operate our application infrastructure:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-zinc-400">
                    <li>
                      <strong className="text-zinc-200">Google Cloud Platform &amp; Firebase (Google LLC):</strong> Used for secure cloud infrastructure, encrypted user database storage (Firestore), and OAuth user authentication session management.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Google AI / Gemini API (Google LLC):</strong> Used to generate intelligent, contextual reply text suggestions for video comments. Comment snippets are sent ephemerally during active generation and are not stored or retained by third parties.
                    </li>
                    <li>
                      <strong className="text-zinc-200">Razorpay Software Private Limited:</strong> Used exclusively for processing subscription and credit package payments. Razorpay does <strong>NOT</strong> have access to any Google or YouTube user data.
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                  <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    B. Strict Non-Disclosure &amp; Non-Sale Guarantees
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-300">
                    <li>
                      <strong>NO SALE OF USER DATA:</strong> We do <strong>NOT</strong> sell, rent, lease, trade, or distribute Google user data or YouTube data to any third parties, commercial brokers, or advertising networks under any circumstances.
                    </li>
                    <li>
                      <strong>NO ADVERTISING OR MARKETING USE:</strong> Google user data is <strong>NEVER</strong> used, transferred, or disclosed to serve personalized, retargeted, or interest-based advertisements.
                    </li>
                    <li>
                      <strong>NO AI/ML MODEL TRAINING:</strong> Google user data is <strong>NEVER</strong> used, transferred, or disclosed to develop, train, or improve generalized Artificial Intelligence (AI) or Machine Learning (ML) models or LLMs.
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-amber-400" />
                    C. Limited Legal Disclosures
                  </h3>
                  <p className="text-xs text-zinc-400">
                    We will only disclose Google user data if strictly required to do so by applicable law, regulation, subpoena, court order, or lawful governmental request, or when necessary to protect the security, legal rights, or safety of our users and the public.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Google API Limited Use Requirements Compliance */}
            <section className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/30 to-zinc-900 border border-rose-500/40 text-rose-200">
              <h2 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                5. Google API Services User Data Policy Compliance &amp; Limited Use
              </h2>
              <p className="text-xs text-zinc-200 leading-relaxed">
                <strong>SW Tech AutoReply&apos;s use and transfer to any other app of information received from Google APIs will adhere to the <Link href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" className="text-rose-400 underline font-semibold">Google API Services User Data Policy</Link>, including the Limited Use requirements.</strong>
              </p>
            </section>

            {/* 6. Data Storage & Security */}
            <section>
              <h2 className="text-lg font-bold text-white mb-2">6. Data Storage, Security &amp; Retention</h2>
              <p>
                We implement industry-standard administrative, physical, and technical safeguards to protect your personal information and Google user data:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                <li>All data transmission is encrypted in transit using industry-standard TLS 1.3 / HTTPS encryption.</li>
                <li>OAuth tokens and user configuration settings are stored with AES-256 encryption at rest inside Google Cloud Firebase Firestore.</li>
                <li>We retain Google user data only for as long as your creator account remains active. Upon disconnection or account termination, data is permanently purged.</li>
              </ul>
            </section>

            {/* 7. User Control, Permissions Revocation & Data Deletion */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white mb-2">7. User Control, Permissions Revocation &amp; Data Deletion</h2>
              <p>
                You have full control over your Google and YouTube data at all times:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                    <UserX className="w-4 h-4 text-rose-400" />
                    Revoke Google Access
                  </h3>
                  <p className="text-xs text-zinc-400">
                    You can instantly revoke our application&apos;s access at any time via your official <Link href="https://myaccount.google.com/permissions" target="_blank" className="text-rose-400 underline">Google Account Security &amp; Permissions Manager</Link>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                    <Trash2 className="w-4 h-4 text-amber-400" />
                    Request Permanent Data Deletion
                  </h3>
                  <p className="text-xs text-zinc-400">
                    You can request complete and permanent deletion of your account, stored credentials, and logs by emailing us at <strong className="text-zinc-200">swgayanmitraai27@gmail.com</strong>. All records are completely deleted within 48 hours.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Contact Information */}
            <section>
              <h2 className="text-lg font-bold text-white mb-2">8. Contact Information</h2>
              <p>If you have any questions, concerns, or inquiries regarding this Privacy Policy or our Google API data practices, please reach out to us:</p>
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-1 mt-2">
                <p><strong className="text-white">Application Name:</strong> SW Tech AutoReply (SW Tech Solution)</p>
                <p><strong className="text-white">Official Website:</strong> <Link href="https://swgayanbhumi.in" className="text-rose-400">https://swgayanbhumi.in</Link></p>
                <p><strong className="text-white">Privacy &amp; Support Email:</strong> <a href="mailto:swgayanmitraai27@gmail.com" className="text-rose-400">swgayanmitraai27@gmail.com</a></p>
                <p><strong className="text-white">WhatsApp Support:</strong> +91 8303994616</p>
                <p><strong className="text-white">Owner / Developer:</strong> Aditya &amp; SW Tech Team</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} SW Tech Solution. All rights reserved. • <Link href="/privacy" className="hover:text-zinc-300">Privacy Policy</Link> • <Link href="/terms" className="hover:text-zinc-300">Terms of Service</Link>
      </footer>
    </div>
  );
}

