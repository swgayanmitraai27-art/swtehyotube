'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { FileSpreadsheet, Download, RefreshCw, AlertCircle, Search, Copy, CheckCircle2, ArrowLeft, MessageSquare, ThumbsUp, Calendar, ExternalLink } from 'lucide-react';

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  authorUrl: string;
  text: string;
  likes: number;
  date: string;
  replyCount: number;
}

export default function ExportCommentsPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchComments = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!videoUrl.trim()) {
      setError('Please enter a valid YouTube video URL.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/youtube/public-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: videoUrl.trim(), maxResults: 100 }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract video comments.');
      }

      setVideoData(data.video);
      setComments(data.comments || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your video URL.');
    } finally {
      setLoading(false);
    }
  };

  const filteredComments = React.useMemo(() => {
    if (!searchQuery.trim()) return comments;
    const q = searchQuery.toLowerCase();
    return comments.filter((c) => c.author.toLowerCase().includes(q) || c.text.toLowerCase().includes(q));
  }, [comments, searchQuery]);

  const downloadCSV = () => {
    if (comments.length === 0) return;

    const headers = ['Author', 'Author URL', 'Comment Text', 'Likes', 'Date', 'Reply Count'];
    const rows = comments.map((c) => [
      `"${c.author.replace(/"/g, '""')}"`,
      `"${c.authorUrl || ''}"`,
      `"${c.text.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      c.likes,
      `"${new Date(c.date).toLocaleString()}"`,
      c.replyCount || 0,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `youtube-comments-${videoData?.id || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/tools" className="hover:text-rose-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Creator Tools
          </Link>
          <span>/</span>
          <span className="text-zinc-200 font-semibold">YouTube Comments Exporter</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            100% Free YouTube Comments Exporter
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Export YouTube Comments to CSV / Excel
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Download full comments, author names, timestamps, and like metrics from any public YouTube video in seconds.
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
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Extracting Comments...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Fetch & Prepare CSV
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

        {/* Video Preview & Data Table */}
        {videoData && (
          <div className="space-y-6">
            {/* Header with Download Action */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={videoData.thumbnailUrl}
                  alt={videoData.title}
                  className="w-24 h-16 object-cover rounded-xl ring-1 ring-zinc-700"
                />
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{videoData.title}</h3>
                  <p className="text-xs text-zinc-400">{videoData.channelTitle} • {comments.length} Comments Ready</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={downloadCSV}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download CSV (.csv)
                </button>
              </div>
            </div>

            {/* Filter Search Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search comments by keyword or author name..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-xs text-zinc-400 shrink-0">
                Showing {filteredComments.length} of {comments.length}
              </span>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-bold bg-zinc-950/60">
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Comment Text</th>
                    <th className="py-3 px-4 text-center">Likes</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredComments.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-850/40 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img src={c.avatar} alt={c.author} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-semibold text-zinc-200">{c.author}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-300 max-w-md line-clamp-2">
                        {c.text}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-zinc-300">
                        {c.likes}
                      </td>
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {new Date(c.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
