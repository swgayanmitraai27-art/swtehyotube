import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { FileText, ArrowLeft, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

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
              <p className="text-xs text-zinc-400 mt-0.5">Last Updated: September 22, 2026 • SW Tech Solution (swgayanbhumi.in)</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 space-y-6 leading-relaxed">
            {/* YouTube API Services & Google Terms Notice */}
            <section className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-950 border border-rose-500/40">
              <h2 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                1. YouTube API Services Terms of Service
              </h2>
              <p className="text-xs text-zinc-200 leading-relaxed mb-2">
                <strong>SW Tech AutoReply uses YouTube API Services.</strong> By accessing, subscribing to, or using our application, you explicitly acknowledge and agree to be bound by the{' '}
                <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline font-bold">
                  YouTube Terms of Service (https://www.youtube.com/t/terms)
                </a>{' '}
                and the{' '}
                <a href="http://www.google.com/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline font-bold">
                  Google Privacy Policy (http://www.google.com/policies/privacy)
                </a>.
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Users can review their connected Google apps and revoke access at any time via the Google security settings page at{' '}
                <a href="https://myaccount.google.com/connections?filters=3,4&hl=en" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline font-semibold">
                  https://myaccount.google.com/connections?filters=3,4&amp;hl=en
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Agreement to Terms</h2>
              <p>
                By accessing or using <strong>SW Tech AutoReply</strong> (accessible at <Link href="https://swgayanbhumi.in" className="text-rose-400 underline">swgayanbhumi.in</Link>), you agree to be bound by these Terms of Service, our Privacy Policy, and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Description of Service</h2>
              <p>
                SW Tech AutoReply is a SaaS tool designed for YouTube creators to manage, analyze sentiment, and automate comment replies using Google Generative AI in strict compliance with YouTube Data API v3 terms and Developer Policies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. User Responsibilities &amp; Acceptable Use</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li>You are solely responsible for maintaining the confidentiality of your Google and YouTube account authentication sessions.</li>
                <li>You agree not to configure automated persona prompts to send abusive, defamatory, illegal, deceptive, harassing, or hateful messages on YouTube.</li>
                <li>You agree to comply fully with the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline">YouTube Community Guidelines</a> and YouTube Developer Policies at all times.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Subscriptions, Payments &amp; Refunds (Razorpay)</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li>Paid subscription plans (Starter ₹499/mo, Growth ₹999/mo, Pro ₹1,999/mo) and credit packs are processed securely via Razorpay (UPI, NetBanking, Debit/Credit Cards).</li>
                <li>Monthly and annual plans renew according to the chosen billing cycle until cancelled by the creator.</li>
                <li>Refund requests are evaluated on a case-by-case basis within 7 days of purchase if service credits remain unused.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">6. YouTube API Data Handling &amp; Retention</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li>YouTube API data is fetched in real-time during active sessions and cached for a maximum of 30 days in strict accordance with YouTube Developer Policies (Section III.E.4b).</li>
                <li>Users can request complete data deletion at any time by emailing <strong className="text-white">swgayanmitraai27@gmail.com</strong>. Data will be completely purged within 48 hours.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">7. Limitation of Liability</h2>
              <p>
                SW Tech Solution will not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">8. Contact Information</h2>
              <p>If you have any questions regarding these Terms, contact us at:</p>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                <p><strong className="text-white">Company:</strong> SW Tech Solution</p>
                <p><strong className="text-white">Website:</strong> <Link href="https://swgayanbhumi.in" className="text-rose-400">https://swgayanbhumi.in</Link></p>
                <p><strong className="text-white">Email:</strong> swgayanmitraai27@gmail.com</p>
                <p><strong className="text-white">Phone / WhatsApp:</strong> +91 8303994616</p>
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
