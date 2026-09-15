'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Gift, Sparkles, Trophy, Shuffle, CheckCircle2, AlertCircle, RefreshCw, Copy, ExternalLink, Filter, Users, ThumbsUp, MessageSquare, ArrowLeft } from 'lucide-react';

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  authorUrl: string;
  text: string;
  likes: number;
  date: string;
}

export default function GiveawayPickerPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any | null>(null);
  const [rawComments, setRawComments] = useState<CommentItem[]>([]);
  
  // Filters
  const [filterDuplicates, setFilterDuplicates] = useState(true);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [minLikes, setMinLikes] = useState(0);

  // Winner state
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<CommentItem | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Canvas confetti ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchComments = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!videoUrl.trim()) {
      setError('Please enter a valid YouTube video URL or ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setWinner(null);

    try {
      const res = await fetch('/api/youtube/public-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: videoUrl.trim(), maxResults: 100 }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch video comments.');
      }

      setVideoData(data.video);
      setRawComments(data.comments || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your video URL.');
    } finally {
      setLoading(false);
    }
  };

  // Filtered entries
  const eligibleComments = React.useMemo(() => {
    let list = [...rawComments];

    // Filter by required keyword/hashtag
    if (filterKeyword.trim()) {
      const kw = filterKeyword.toLowerCase().trim();
      list = list.filter((c) => c.text.toLowerCase().includes(kw));
    }

    // Filter by min likes
    if (minLikes > 0) {
      list = list.filter((c) => c.likes >= minLikes);
    }

    // Filter duplicates by author name
    if (filterDuplicates) {
      const seen = new Set<string>();
      const unique: CommentItem[] = [];
      for (const item of list) {
        const authorKey = item.author.toLowerCase().trim();
        if (!seen.has(authorKey)) {
          seen.add(authorKey);
          unique.push(item);
        }
      }
      return unique;
    }

    return list;
  }, [rawComments, filterDuplicates, filterKeyword, minLikes]);

  // Confetti trigger
  const launchConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: any[] = [];
    const colors = ['#f43f5e', '#fb7185', '#fbbf24', '#34d399', '#60a5fa', '#a855f7', '#ec4899'];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 10 + 6,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 18,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.35,
        opacity: 1,
      });
    }

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.007;

        if (p.opacity > 0) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (active) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  };

  // Pick Winner with countdown & animation
  const handlePickWinner = () => {
    if (eligibleComments.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setIsSpinning(false);
        const randomIndex = Math.floor(Math.random() * eligibleComments.length);
        const chosen = eligibleComments[randomIndex];
        setWinner(chosen);
        setTimeout(() => launchConfetti(), 100);
      }
    }, 800);
  };

  const copyWinnerProof = () => {
    if (!winner || !videoData) return;
    const text = `🏆 Giveaway Winner Picked with SW Tech Giveaway Picker!\n\nWinner: ${winner.author}\nComment: "${winner.text}"\nVideo: ${videoData.title}\nTotal Eligible Entries: ${eligibleComments.length}\nDate: ${new Date().toLocaleDateString()}\nVerified by https://swgayanbhumi.in/tools/giveaway-picker`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500 selection:text-white relative">
      <Navbar />

      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/tools" className="hover:text-rose-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Creator Tools
          </Link>
          <span>/</span>
          <span className="text-zinc-200 font-semibold">YouTube Giveaway Comment Picker</span>
        </div>

        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-3">
            <Gift className="w-3.5 h-3.5" />
            100% Free & Fair Random Picker
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            YouTube Random Giveaway Comment Picker
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Pick transparent, unbiased winners for your YouTube giveaways, contests, and lucky draws in seconds.
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8 shadow-2xl mb-8">
          <form onSubmit={fetchComments} className="space-y-4">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Paste YouTube Video URL or Video ID
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or shorts/xyz"
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading Comments...
                  </>
                ) : (
                  <>
                    <Shuffle className="w-4 h-4" />
                    Fetch Comments
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Video Preview & Filter Settings */}
        {videoData && (
          <div className="space-y-6">
            {/* Video Banner */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={videoData.thumbnailUrl}
                alt={videoData.title}
                className="w-full sm:w-40 h-24 object-cover rounded-xl ring-1 ring-zinc-700"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                  Connected Video
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1 truncate">
                  {videoData.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">{videoData.channelTitle}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-300">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                    {rawComments.length} Total Loaded Comments
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    {eligibleComments.length} Eligible Entries
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 uppercase tracking-wider mb-4">
                <Filter className="w-4 h-4 text-rose-400" />
                Giveaway Rules & Filters
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Filter Duplicates */}
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterDuplicates}
                    onChange={(e) => setFilterDuplicates(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                  <div>
                    <span className="font-semibold text-white block">Filter Duplicates</span>
                    <span className="text-[10px] text-zinc-400">1 entry per unique user</span>
                  </div>
                </label>

                {/* Filter Keyword */}
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="font-semibold text-white block mb-1">Require Specific Keyword / Tag</span>
                  <input
                    type="text"
                    value={filterKeyword}
                    onChange={(e) => setFilterKeyword(e.target.value)}
                    placeholder="e.g. #giveaway or enter"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Minimum Likes */}
                <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="font-semibold text-white block mb-1">Minimum Comment Likes</span>
                  <input
                    type="number"
                    min="0"
                    value={minLikes}
                    onChange={(e) => setMinLikes(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Winner Action Section */}
            <div className="text-center py-6">
              {countdown !== null && (
                <div className="my-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 mx-auto flex items-center justify-center text-4xl font-black text-white animate-bounce shadow-2xl shadow-rose-600/50">
                    {countdown}
                  </div>
                  <p className="text-sm font-bold text-rose-400 mt-4 animate-pulse">
                    Picking a lucky winner from {eligibleComments.length} entries...
                  </p>
                </div>
              )}

              {!isSpinning && countdown === null && (
                <button
                  onClick={handlePickWinner}
                  disabled={eligibleComments.length === 0}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-base shadow-xl shadow-rose-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Pick Random Winner Now!
                  </span>
                </button>
              )}
            </div>

            {/* Winner Announcement Card */}
            {winner && (
              <div className="rounded-3xl bg-gradient-to-b from-rose-950/50 via-zinc-900 to-zinc-950 border-2 border-rose-500 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-4">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Official Giveaway Winner
                </div>

                <div className="flex flex-col items-center gap-3 mb-6">
                  <img
                    src={winner.avatar}
                    alt={winner.author}
                    className="w-20 h-20 rounded-full ring-4 ring-rose-500 shadow-xl object-cover"
                  />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
                      {winner.author}
                    </h2>
                    {winner.authorUrl && (
                      <a
                        href={winner.authorUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-rose-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        View YouTube Profile <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="max-w-xl mx-auto bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 italic mb-6 shadow-inner">
                  "{winner.text}"
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                  <button
                    onClick={copyWinnerProof}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Copied Winner Proof!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Shareable Winner Proof
                      </>
                    )}
                  </button>
                  <button
                    onClick={handlePickWinner}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Pick Another Winner
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
