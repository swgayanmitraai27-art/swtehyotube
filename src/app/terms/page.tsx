import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { FileText, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | SW Tech AutoReply (SW Gyanbhumi)',
  description: 'Terms of Service and User Agreement for SW Tech YouTube AutoReply.',
};

export default function TermsOfServicePage() {
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
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Terms of Service</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Last Updated: September 11, 2026 • SW Tech Solution (swgayanbhumi.in)</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Agreement to Terms</h2>
              <p>
                By accessing or using <strong>SW Tech AutoReply</strong> (accessible at <Link href="https://swgayanbhumi.in" className="text-rose-400 underline">swgayanbhumi.in</Link>), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Description of Service</h2>
              <p>
                SW Tech AutoReply is a SaaS tool designed for YouTube creators to manage, analyze sentiment, and automate comment replies using Google Gemma 4 31B IT Thinking AI (Powered by Google AI) in compliance with YouTube Data API v3 terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. User Responsibilities & Acceptable Use</h2>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>You are solely responsible for maintaining the confidentiality of your Google/YouTube account credentials.</li>
                <li>You agree not to configure the AI tool to send abusive, defamatory, illegal, or harassing messages on YouTube.</li>
                <li>You agree to comply with the <Link href="https://www.youtube.com/t/terms" target="_blank" className="text-rose-400 underline">YouTube Community Guidelines and Terms of Service</Link>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Subscriptions, Payments & Refunds (Razorpay)</h2>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>Paid plans (Starter $19/mo, Pro $39/mo, Enterprise $99/mo) and credit packs are processed securely via <strong>Razorpay</strong>.</li>
                <li>Monthly and annual plans renew according to the chosen billing cycle until cancelled by the user.</li>
                <li>Refund requests are evaluated on a case-by-case basis within 7 days of purchase if service credits remain unused.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. YouTube API & Service Availability</h2>
              <p>
                While we employ smart quota optimization algorithms to safeguard your 10,000 daily YouTube API limit, YouTube API availability and daily quota allocations are governed solely by Google Cloud policies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">6. Limitation of Liability</h2>
              <p>
                SW Tech Solution will not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">7. Contact Information</h2>
              <p>If you have any questions regarding these Terms, contact us at:</p>
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
