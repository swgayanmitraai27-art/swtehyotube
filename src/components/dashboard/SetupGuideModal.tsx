'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  Youtube, 
  X, 
  ChevronRight, 
  ChevronDown, 
  AlertTriangle, 
  HelpCircle,
  PhoneCall,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';
import { REDIRECT_URI_PROD } from '@/lib/constants';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConnect?: () => void;
}

export function SetupGuideModal({ isOpen, onClose, onOpenConnect }: SetupGuideModalProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const redirectUri = REDIRECT_URI_PROD || 'https://swgayanbhumi.in/api/auth/google-callback';

  const copyRedirectUri = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const steps = [
    {
      step: 1,
      title: 'Create Google Cloud Project',
      subtitle: 'Google Cloud Console me free project banayein',
      tag: 'Step 1 • 1 Min',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Apne personal YouTube quota ke liye Google Cloud par 100% Free project create karein:
          </p>
          <ol className="list-decimal pl-4 space-y-2 text-zinc-300">
            <li>
              Google Cloud Console ke New Project page par jayein:
            </li>
            <li>
              Project Name me likhein: <code className="bg-zinc-800 px-2 py-0.5 rounded text-rose-400 font-mono">SWTech-AutoReply</code> ya apna Channel Name.
            </li>
            <li>
              <strong>&quot;CREATE&quot;</strong> button par click karein aur project create hone ka wait karein (5-10 sec).
            </li>
          </ol>
          <div className="pt-2">
            <a
              href="https://console.cloud.google.com/projectcreate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all"
            >
              Open Google Cloud Create Project <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ),
    },
    {
      step: 2,
      title: 'Enable YouTube Data API v3',
      subtitle: 'YouTube official API ko enable karein',
      tag: 'Step 2 • 30 Sec',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Apne create kiye gaye project me <strong>YouTube Data API v3</strong> ko activate karein:
          </p>
          <ol className="list-decimal pl-4 space-y-2 text-zinc-300">
            <li>
              Left menu se <strong>APIs &amp; Services &gt; Library</strong> par jayein ya direct link open karein.
            </li>
            <li>
              Search bar me <code className="bg-zinc-800 px-2 py-0.5 rounded text-rose-400 font-mono">YouTube Data API v3</code> search karein.
            </li>
            <li>
              Blue color ke <strong>&quot;ENABLE&quot;</strong> button par click karein.
            </li>
          </ol>
          <div className="pt-2">
            <a
              href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all"
            >
              Enable YouTube Data API v3 <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: 'Configure OAuth Consent & Add Test Users',
      subtitle: 'Apne Channel ki Gmail ID ko Test User me add karein (Important!)',
      tag: 'Step 3 • Critical',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Sabse Zaroori Step:</strong> Testing mode me hone ke kaaran Google sirf Test Users ko access deta hai. Apne YouTube Channel ka Gmail ID zaroor add karein.
            </div>
          </div>
          <ol className="list-decimal pl-4 space-y-2 text-zinc-300">
            <li>
              Left menu se <strong>OAuth consent screen</strong> par jayein.
            </li>
            <li>
              User Type me <strong>&quot;External&quot;</strong> choose karein aur <strong>&quot;CREATE&quot;</strong> dabayein.
            </li>
            <li>
              App Name me <code className="bg-zinc-800 px-2 py-0.5 rounded text-rose-400 font-mono">My Auto Reply</code> aur apna User support email bharein.
            </li>
            <li>
              &quot;Scopes&quot; step ko skip karke <strong>&quot;Save and Continue&quot;</strong> karein.
            </li>
            <li>
              <strong>&quot;Test Users&quot;</strong> tab me <strong>&quot;+ ADD USERS&quot;</strong> par click karein aur apne <strong>YouTube Channel ka Gmail ID</strong> daal kar Save karein!
            </li>
          </ol>
          <div className="pt-2">
            <a
              href="https://console.cloud.google.com/apis/credentials/consent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all"
            >
              Configure OAuth Consent Screen <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ),
    },
    {
      step: 4,
      title: 'Create OAuth Client ID (Web Application)',
      subtitle: 'Authorized Redirect URI copy karke paste karein',
      tag: 'Step 4 • Credentials',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Apne project ke liye <strong>Web Application OAuth Credentials</strong> generate karein:
          </p>
          <ol className="list-decimal pl-4 space-y-2 text-zinc-300">
            <li>
              Left menu se <strong>Credentials</strong> par jayein.
            </li>
            <li>
              Upar <strong>&quot;+ CREATE CREDENTIALS&quot;</strong> dabayein aur <strong>&quot;OAuth client ID&quot;</strong> chunein.
            </li>
            <li>
              Application Type me <strong>&quot;Web application&quot;</strong> select karein.
            </li>
            <li>
              Neeche <strong>&quot;Authorized redirect URIs&quot;</strong> me <strong>&quot;+ ADD URI&quot;</strong> click karein aur yeh exact URL paste karein:
            </li>
          </ol>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2">
            <div className="font-mono text-rose-400 text-[11px] truncate">
              {redirectUri}
            </div>
            <button
              type="button"
              onClick={copyRedirectUri}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy URI
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-zinc-400">
            5. <strong>&quot;CREATE&quot;</strong> dabate hi aapko <strong>Client ID</strong> aur <strong>Client Secret</strong> mil jayega. Dono copy kar lein.
          </p>

          <div className="pt-2">
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all"
            >
              Go to Credentials Console <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ),
    },
    {
      step: 5,
      title: 'Paste Credentials & Connect YouTube Channel',
      subtitle: 'App me save karein aur channel 1-click me connect karein',
      tag: 'Step 5 • Done 🎉',
      content: (
        <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
          <p>
            Ab aapka complete private quota setup ho chuka hai:
          </p>
          <ol className="list-decimal pl-4 space-y-2 text-zinc-300">
            <li>
              Apna <strong>Client ID</strong> aur <strong>Client Secret</strong> Settings page ke <strong>&quot;Dedicated Google Cloud Project Quota Keys&quot;</strong> section me paste karein.
            </li>
            <li>
              Neeche <strong>&quot;Save &amp; Connect YouTube&quot;</strong> button dabayein.
            </li>
            <li>
              Google Login screen par apna YouTube channel choose karein aur <strong>&quot;Continue&quot;</strong> par click karke permissions grant karein!
            </li>
          </ol>

          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Aapka channel instant connect ho jayega aur daily 10,000 quota units (~6k replies/mo) active ho jayenge!</span>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push('/dashboard/settings#gcp-keys');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all"
            >
              <span>⚙️ Go to Settings &amp; Enter Keys Now</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[activeStep - 1];

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-600/15 blur-3xl rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                YouTube Connection Setup Guide
              </h2>
              <p className="text-[11px] text-zinc-400">
                5 quick steps to connect your channel with private GCP quota
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center justify-between gap-1.5 py-3 border-b border-zinc-800/80 shrink-0">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeStep === s.step
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                activeStep === s.step ? 'bg-white text-rose-600' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {s.step}
              </span>
              <span className="hidden sm:inline">Step {s.step}</span>
            </button>
          ))}
        </div>

        {/* Single Active Step Content */}
        <div className="py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                {current.step}
              </span>
              {current.title}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
              {current.tag}
            </span>
          </div>
          <p className="text-xs text-zinc-400">{current.subtitle}</p>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 mt-2">
            {current.content}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <a
            href="https://wa.me/918303994616?text=Hi%20SW%20Tech!%20I%20need%20help%20connecting%20my%20YouTube%20Channel%20in%20Google%20Cloud."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            WhatsApp Support: +91 8303994616
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all"
              >
                Previous
              </button>
            )}
            {activeStep < 5 ? (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-rose-600/20"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20"
              >
                Done <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SetupGuideCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const redirectUri = REDIRECT_URI_PROD || 'https://swgayanbhumi.in/api/auth/google-callback';

  const copyRedirectUri = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              📖 Step-by-Step Google Cloud &amp; Channel Connection Guide
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Follow 5 quick steps to configure YouTube Data API v3, add Test Users, and get Client ID/Secret.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-zinc-700/60 shrink-0"
        >
          {isOpen ? (
            <>
              <span>Hide Guide</span> <ChevronDown className="w-3.5 h-3.5 rotate-180 transition-transform" />
            </>
          ) : (
            <>
              <span>View 5-Step Guide</span> <ChevronDown className="w-3.5 h-3.5 transition-transform" />
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 pt-5 border-t border-zinc-800 space-y-4 animate-in fade-in duration-300">
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                Create Project in Google Cloud Console
              </span>
              <a
                href="https://console.cloud.google.com/projectcreate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                Open Console <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-zinc-400 text-[11px] pl-7">
              Go to Google Cloud Console, click &apos;New Project&apos;, name it <code className="text-rose-300">SWTech-AutoReply</code>, and click Create.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Enable YouTube Data API v3
              </span>
              <a
                href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                Enable API <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-zinc-400 text-[11px] pl-7">
              Search for &quot;YouTube Data API v3&quot; in the API Library and click the blue <strong>ENABLE</strong> button.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                OAuth Consent Screen &amp; Add Test Users (CRITICAL)
              </span>
              <a
                href="https://console.cloud.google.com/apis/credentials/consent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                OAuth Consent <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-zinc-400 text-[11px] pl-7">
              Select <strong>External</strong> &gt; Set App Name &gt; In <strong>&quot;Test Users&quot;</strong> tab click <strong>&quot;+ ADD USERS&quot;</strong> and add your <strong>YouTube Channel Gmail ID</strong> so Google allows login.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                Create Web Application Credentials &amp; Redirect URI
              </span>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                Credentials <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-zinc-400 text-[11px] pl-7 mb-2">
              Credentials &gt; Create Credentials &gt; OAuth client ID &gt; Select &quot;Web application&quot; &gt; In &quot;Authorized redirect URIs&quot; add:
            </p>
            <div className="pl-7 flex items-center gap-2">
              <code className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-rose-400 text-[11px] font-mono select-all">
                {redirectUri}
              </code>
              <button
                type="button"
                onClick={copyRedirectUri}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">5</span>
                Paste Client ID &amp; Secret Below and Click Connect!
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] pl-7">
              Copy your generated Client ID and Client Secret, paste them into the Project 1 fields below, and click <strong>&quot;Save &amp; Connect YouTube&quot;</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
