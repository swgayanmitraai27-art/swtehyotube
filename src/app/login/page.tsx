'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Youtube, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      if (tab === 'register') {
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, name.trim() || 'Creator');
      } else {
        await signInWithEmail(email, password);
      }
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please Sign In.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4 selection:bg-rose-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-rose-600/15 via-red-600/10 to-amber-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-600/25">
          <Youtube className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="font-bold text-xl text-white tracking-tight">
          SW Tech <span className="text-rose-500 font-extrabold">AutoReply</span>
        </span>
      </Link>

      {/* Auth Card */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl z-10 backdrop-blur-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white">
            {tab === 'register' ? 'Get 50 Free AI Replies' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {tab === 'register'
              ? 'Create your free account to automate your YouTube channel'
              : 'Sign in to access your YouTube Creator Studio'}
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex bg-zinc-950 p-1 rounded-xl mb-6 text-xs font-semibold border border-zinc-800/80">
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'register' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'login' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Channel / Creator Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shiksha Classes / Tech Guru"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-xs shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{tab === 'register' ? 'Get Started Free (50 Credits)' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800/80" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-500 font-semibold">Or</span>
          </div>
        </div>

        {/* Google Sign In option */}
        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 mt-5 text-[10px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Authentication • Zero Spam</span>
        </div>
      </div>
    </div>
  );
}
