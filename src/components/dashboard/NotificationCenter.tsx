'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, ShieldAlert, Sparkles, RefreshCw, CheckCircle2, Trash2, X, AlertTriangle, Zap, Check } from 'lucide-react';

export interface AppNotification {
  id: string;
  type: 'alert' | 'automation' | 'quota' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    type: 'alert',
    title: '🚨 Toxic Link Automatically Blocked',
    message: 'Suspicious crypto promotional link from @cryptodaily_bot was caught and suppressed by Toxic Cleaner.',
    timestamp: '10 mins ago',
    isRead: false,
  },
  {
    id: 'n-2',
    type: 'automation',
    title: '⚡ Auto-Pilot Active & Generating Replies',
    message: 'Google Gemma 4 31B drafted & published 18 contextual replies with auto-mention @username.',
    timestamp: '1 hour ago',
    isRead: false,
  },
  {
    id: 'n-3',
    type: 'quota',
    title: '🔄 Twin-Project Multiplier Standby',
    message: 'Google Cloud Project A quota healthy (8,650 daily units available). Auto-switch node ready.',
    timestamp: '3 hours ago',
    isRead: true,
  },
  {
    id: 'n-4',
    type: 'system',
    title: '🎁 Free Giveaway Picker Tool Live',
    message: 'You can now pick fair random giveaway winners and export comments to CSV under the Tools menu.',
    timestamp: '1 day ago',
    isRead: true,
  },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'alert' | 'automation' | 'quota'>('all');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Load notifications from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('swtech_notifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
        localStorage.setItem('swtech_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
      }
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, []);

  const saveNotifications = (items: AppNotification[]) => {
    setNotifications(items);
    try {
      localStorage.setItem('swtech_notifications', JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save notifications:', e);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotifications(updated);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all focus:outline-none"
        title="Notifications & Live Alerts"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-zinc-950/95 border border-zinc-800 shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Live In-App Alerts</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold bg-rose-500/20 border border-rose-500/30 text-rose-300 px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-2 bg-zinc-900/50 border-b border-zinc-800 text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('alert')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filter === 'alert' ? 'bg-rose-500/20 text-rose-300' : 'text-zinc-400 hover:text-white'}`}
            >
              🚨 Alerts
            </button>
            <button
              onClick={() => setFilter('automation')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filter === 'automation' ? 'bg-purple-500/20 text-purple-300' : 'text-zinc-400 hover:text-white'}`}
            >
              ⚡ Auto-Pilot
            </button>
            <button
              onClick={() => setFilter('quota')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filter === 'quota' ? 'bg-emerald-500/20 text-emerald-300' : 'text-zinc-400 hover:text-white'}`}
            >
              🔄 Quota
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-900">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
                No notifications in this category.
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 group ${item.isRead ? 'bg-zinc-950 hover:bg-zinc-900/40' : 'bg-rose-950/15 hover:bg-rose-950/25 border-l-2 border-rose-500'}`}
                >
                  <div className="mt-0.5">
                    {item.type === 'alert' && <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />}
                    {item.type === 'automation' && <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />}
                    {item.type === 'quota' && <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {item.type === 'system' && <Zap className="w-4 h-4 text-blue-400 shrink-0" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-white truncate">{item.title}</span>
                      <span className="text-[10px] text-zinc-500 shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 p-1 transition-opacity shrink-0"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950 text-center flex items-center justify-between px-4">
              <button
                onClick={clearAll}
                className="text-[10px] text-zinc-500 hover:text-rose-400 transition-colors"
              >
                Clear all alerts
              </button>
              <span className="text-[10px] text-zinc-500">Live 24/7 Monitor</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
