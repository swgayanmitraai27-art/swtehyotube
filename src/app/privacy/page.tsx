import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Server, Database, Sparkles, UserX, Trash2, Mail, Cookie, RefreshCw } from 'lucide-react';

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
              <p className="text-xs text-zinc-400 mt-0.5">Last Updated: September 22, 2026 • SW Tech Solution (swgayanbhumi.in)</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 space-y-6 leading-relaxed">
            {/* 1. YouTube API Services & Google Privacy Policy Notice (Policy III.A.2c) */}
            <section className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-zinc-950 border border-rose-500/40">
              <h2 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                1. YouTube API Services &amp; Google Privacy Policy
              </h2>
              <p className="text-xs text-zinc-200 leading-relaxed mb-2">
                <strong>SW Tech AutoReply uses YouTube API Services.</strong> By accessing or using our application, you agree to be bound by the{' '}
                <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline font-bold">
                  YouTube Terms of Service
                </a>{' '}
                and acknowledge that your information is handled in accordance with the{' '}
                <a href="http://www.google.com/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline font-bold">
                  Google Privacy Policy (http://www.google.com/policies/privacy)
                </a>.
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Please review the Google Privacy Policy at{' '}
                <a href="http://www.google.com/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline">
                  http://www.google.com/policies/privacy
                </a>{' '}
                and{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline">
                  https://policies.google.com/privacy
                </a>{' '}
                for full details on Google&apos;s data collection and processing practices.
              </p>
            </section>

            {/* 2. Introduction */}
            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Introduction &amp; Overview</h2>
              <p>
                Welcome to <strong>SW Tech AutoReply</strong> (&quot;we,&quot; &quot;our,&quot; &quot;us,&quot; or &quot;Application&quot;), operated by <strong>SW Tech Solution</strong> at <Link href="https://swgayanbhumi.in" className="text-rose-400 underline">swgayanbhumi.in</Link>. 
                SW Tech AutoReply is an AI-powered YouTube comment management, sentiment analysis, and creator community engagement platform designed to help YouTube creators respond intelligently to their video comments.
              </p>
              <p>
                We are committed to protecting your privacy and handling Google and YouTube user data with the highest standards of security, transparency, and compliance. This Privacy Policy details the types of data we collect, how it is used, how it is stored, how device cookies are used, and <strong>with whom Google user data is shared, transferred, or disclosed</strong>.
              </p>
            </section>

            {/* 3. Google & YouTube User Data We Access */}
            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Google &amp; YouTube User Data We Access</h2>
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

            {/* 4. How We Use and Process Google User Data */}
            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. How We Use and Process Google User Data</h2>
              <p>We access and process Google user data strictly for providing user-facing features requested by the creator, including:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li>Displaying incoming unreplied comments in your creator studio feed.</li>
                <li>Analyzing comment sentiment and generating context-aware suggested replies tailored to your chosen niche, tone, and language preferences.</li>
                <li>Executing comment replies on your YouTube channel upon manual creator approval or via user-activated 24/7 Auto-Pilot rules.</li>
                <li>Conserving your daily YouTube API quota by executing local client-side spam, toxic language, and emoji-only pre-filtering.</li>
              </ul>
            </section>

            {/* 5. Cookies, Device Storage & Third-Party Access (Policy III.A.2g) */}
            <section className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 text-amber-400">
                <Cookie className="w-5 h-5 text-amber-400 shrink-0" />
                5. Device Data, Cookies &amp; Local Storage Disclosure
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm">
                In compliance with YouTube Developer Policy Section III.A.2g, we explicitly disclose that the <strong>API Client stores, accesses, and collects (and allows third parties to do so) information directly or indirectly on or from users’ devices, including by placing, accessing, or recognizing cookies or similar technology on users&apos; devices or browsers:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-300">
                <li>
                  <strong className="text-white">Authentication &amp; Session Cookies:</strong> We and our third-party infrastructure provider (Firebase Authentication / Google LLC) place and read secure session cookies and HTTP tokens to authenticate your browser session, maintain secure logins, and protect against Cross-Site Request Forgery (CSRF).
                </li>
                <li>
                  <strong className="text-white">Browser LocalStorage &amp; SessionStorage:</strong> We use browser localStorage to store non-sensitive creator interface preferences (such as theme modes, active tab selections, and UI tour completion markers).
                </li>
                <li>
                  <strong className="text-white">Third-Party Service Identifiers:</strong> Third-party integrations (Google Cloud Platform, Google Identity Services, and Razorpay) may recognize or place essential cookies or device identifiers on your browser strictly for verifying API requests, fraud detection, and payment verification.
                </li>
              </ul>
            </section>

            {/* 6. Data Refresh, Update & Deletion Lifecycle (Policy III.E.4a-g) */}
            <section className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 text-emerald-400">
                <RefreshCw className="w-5 h-5 text-emerald-400 shrink-0" />
                6. Data Refresh, Update &amp; Deletion Lifecycle
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm">
                In compliance with YouTube Developer Policy Section III.E.4, we implement strict rules for refreshing, updating, and deleting API data:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-300">
                <li>
                  <strong className="text-white">Real-Time Refreshing:</strong> YouTube API data (channel metadata, subscriber counts, and unreplied comment threads) is fetched and refreshed in real-time when the creator actively accesses their dashboard or when Auto-Pilot triggers an automated sync.
                </li>
                <li>
                  <strong className="text-white">Maximum 30-Day Storage Limitation:</strong> No YouTube API data or content is cached or stored for more than 30 calendar days (complying strictly with Policy III.E.4b). Data older than 30 days is automatically purged and refreshed from the API.
                </li>
                <li>
                  <strong className="text-white">Immediate Purge on Revocation/Deletion:</strong> When a creator disconnects their channel or deletes their account, all associated OAuth tokens, cached comment snippets, and channel identifiers are permanently purged from our databases within 48 hours.
                </li>
              </ul>
            </section>

            {/* 7. Data Sharing Disclosure (Policy III.A.2) */}
            <section className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 text-rose-400">
                <Lock className="w-5 h-5 text-rose-400 shrink-0" />
                7. With Whom We Share, Transfer, or Disclose Google User Data
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

            {/* 8. Google API Limited Use Requirements Compliance */}
            <section className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/30 to-zinc-900 border border-rose-500/40 text-rose-200">
              <h2 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                8. Google API Services User Data Policy Compliance &amp; Limited Use
              </h2>
              <p className="text-xs text-zinc-200 leading-relaxed">
                <strong>SW Tech AutoReply&apos;s use and transfer to any other app of information received from Google APIs will adhere to the <Link href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" className="text-rose-400 underline font-semibold">Google API Services User Data Policy</Link>, including the Limited Use requirements.</strong>
              </p>
            </section>

            {/* 9. Data Storage & Security */}
            <section>
              <h2 className="text-lg font-bold text-white mb-2">9. Data Storage, Security &amp; Retention</h2>
              <p>
                We implement industry-standard administrative, physical, and technical safeguards to protect your personal information and Google user data:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                <li>All data transmission is encrypted in transit using industry-standard TLS 1.3 / HTTPS encryption.</li>
                <li>OAuth tokens and user configuration settings are stored with AES-256 encryption at rest inside Google Cloud Firebase Firestore.</li>
                <li>We retain Google user data only for as long as your creator account remains active. Upon disconnection or account termination, data is permanently purged within 48 hours.</li>
              </ul>
            </section>

            {/* 10. User Control, Permissions Revocation & Data Deletion Procedure (Policy III.A.2h) */}
            <section className="space-y-4 p-6 rounded-3xl bg-zinc-950 border border-zinc-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 text-rose-400">
                <UserX className="w-5 h-5 text-rose-400 shrink-0" />
                10. User Control, Permissions Revocation &amp; Data Deletion Procedure
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm">
                In compliance with YouTube Developer Policy Section III.A.2h, users have full control over their data and can revoke permissions or request complete deletion at any time:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
                    <UserX className="w-4 h-4 text-rose-400" />
                    A. How to Revoke Google Account Access
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-2">
                    You can instantly revoke SW Tech AutoReply&apos;s access to your YouTube and Google account at any time via the official Google Security Settings page:
                  </p>
                  <a
                    href="https://myaccount.google.com/connections?filters=3,4&hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-bold text-rose-400 hover:text-rose-300 underline break-all"
                  >
                    https://myaccount.google.com/connections?filters=3,4&amp;hl=en
                  </a>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Alternatively, visit <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-rose-400 underline">https://myaccount.google.com/permissions</a>, locate &quot;SW Tech AutoReply&quot; (or &quot;samsher&quot;), and click &quot;Remove Access&quot;.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
                    <Trash2 className="w-4 h-4 text-amber-400" />
                    B. Procedure for Deleting Stored Data
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-2">
                    To request complete and permanent deletion of your stored credentials, profile data, cached comments, and settings:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-xs text-zinc-300">
                    <li>Send an email to <strong className="text-white">swgayanmitraai27@gmail.com</strong> with the subject line <em>&quot;Data Deletion Request&quot;</em> and your channel name.</li>
                    <li>Our security team will immediately verify the request and permanently delete all tokens, database records, and logs from Firebase within <strong>48 hours</strong>.</li>
                    <li>A confirmation email will be sent upon full deletion completion.</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* 11. Contact Information */}
            <section>
              <h2 className="text-lg font-bold text-white mb-2">11. Contact Information</h2>
              <p>If you have any questions, concerns, or inquiries regarding this Privacy Policy or our YouTube API data practices, please reach out to us:</p>
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-1 mt-2">
                <p><strong className="text-white">Application Name:</strong> SW Tech AutoReply (API Client: samsher / SW Tech Solution)</p>
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
