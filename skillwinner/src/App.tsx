import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Zap,
  Crosshair,
  Users,
  ShieldCheck,
  Key,
  HelpCircle,
  Download,
  AlertTriangle,
  Sparkles,
  Smartphone,
  Headphones,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MatchCard } from './components/MatchCard';
import { JoinMatchModal } from './components/JoinMatchModal';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { WalletModal } from './components/WalletModal';
import { ProfileModal } from './components/ProfileModal';
import { InAppPaymentModal } from './components/InAppPaymentModal';
import { NotificationModal } from './components/NotificationModal';
import { LoginModal } from './components/LoginModal';
import { AdminPanel } from './components/AdminPanel';
import { INITIAL_MATCHES } from './lib/constants';
import { Match } from './types';
import { useAuth } from './context/AuthContext';

export function App() {
  const { user, isAdmin, userRegistrations } = useAuth();

  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Modals
  const [joiningMatch, setJoiningMatch] = useState<Match | null>(null);
  const [viewingRoomMatch, setViewingRoomMatch] = useState<Match | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isInAppDepositOpen, setIsInAppDepositOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  const handleAddMatch = (newMatch: Match) => {
    setMatches((prev) => [newMatch, ...prev]);
  };

  const handleUpdateMatch = (updated: Match) => {
    setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleMatchJoinedSuccess = () => {
    if (joiningMatch) {
      setMatches((prev) =>
        prev.map((m) => (m.id === joiningMatch.id ? { ...m, filledSlots: m.filledSlots + 1 } : m))
      );
      setJoiningMatch(null);
    }
  };

  const filteredMatches = matches.filter((m) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'SOLO') return m.mode === 'SOLO_RANK_KILL';
    if (selectedFilter === 'WEEKLY') return m.mode === 'WEEKLY_GADGET';
    if (selectedFilter === 'MONTHLY') return m.mode === 'MEGA_IPHONE';
    if (selectedFilter === 'CS') return m.mode === 'CS_4V4' || m.mode === 'CS_2V2';
    if (selectedFilter === '1V1') return m.mode === 'LONE_WOLF_1V1';
    if (selectedFilter === 'SQUAD') return m.mode === 'SQUAD_RANK';
    return true;
  });

  const filterTabs = [
    { id: 'ALL', label: '🔥 All Matches' },
    { id: 'SOLO', label: '🎯 Solo (Rank+Kill)' },
    { id: 'WEEKLY', label: '🎧 Sunday Gadget Cup' },
    { id: 'MONTHLY', label: '📱 Monthly iPhone' },
    { id: 'CS', label: '⚔️ Clash Squad' },
    { id: '1V1', label: '🥊 1v1 Lone Wolf' },
    { id: 'SQUAD', label: '🛡️ Squad Wars' },
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex flex-col font-sans selection:bg-red-600 selection:text-white pb-12">
      {/* Top Navbar */}
      <Navbar
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenInAppDeposit={() => setIsInAppDepositOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-6 flex-1">
        {/* Admin Panel Toggle */}
        {isAdmin && (
          <div className="animate-fade-in">
            <AdminPanel
              matches={matches}
              onAddMatch={handleAddMatch}
              onUpdateMatch={handleUpdateMatch}
            />
          </div>
        )}

        {/* Hero Banner / Promo */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-950 via-[#151C2C] to-amber-950/60 border border-red-500/30 p-5 sm:p-7 shadow-2xl">
          <div className="max-w-xl relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-current" /> Free Fire Max Tournaments
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              PLAY. KILL. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-400">WIN CASH & GADGETS.</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              Rank prizes + <span className="text-amber-400 font-bold">₹5 to ₹25 Per Kill</span> direct to Real Wallet. Plus Weekly Gaming Headsets & Monthly iPhone 15 Tournaments!
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => setIsInAppDepositOpen(true)}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" /> Fast Add Cash (50% Bonus)
              </button>

              <div className="px-3.5 py-2 rounded-xl bg-[#0F1422]/80 border border-gray-800 text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 70/30 Dynamic Split System
              </div>
            </div>
          </div>
        </div>

        {/* Registered Matches Quick Access Bar (If user joined any) */}
        {userRegistrations.length > 0 && (
          <div className="bg-[#0F1422] border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white">
                  You are registered in {userRegistrations.length} Match(es)!
                </div>
                <div className="text-[11px] text-gray-400">
                  Custom Room ID & Password will be unlocked 15 min before start.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const joined = matches.find((m) => m.id === userRegistrations[0].matchId);
                if (joined) setViewingRoomMatch(joined);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-4 py-2 rounded-xl text-xs transition"
            >
              View Room Credentials
            </button>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-[1.02]'
                  : 'bg-[#0F1422] text-gray-400 hover:text-white border border-[#1F293D]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onJoinClick={(m) => setJoiningMatch(m)}
              onViewRoomClick={(m) => setViewingRoomMatch(m)}
            />
          ))}
        </div>
      </main>

      {/* Footer & Compliance */}
      <footer className="max-w-6xl mx-auto px-3 sm:px-6 pt-10 text-center text-xs text-gray-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-gray-400 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>SkillWinner Esports • Indian Skill Gaming Compliant</span>
        </div>
        <p className="text-[11px] max-w-xl mx-auto text-gray-600">
          Strictly 18+ only. Real-money gaming carries financial risk. Play responsibly.
          Not available for users located in Andhra Pradesh, Telangana, Assam, Odisha, Sikkim, and Nagaland.
        </p>
      </footer>

      {/* Modals */}
      <JoinMatchModal
        match={joiningMatch}
        onClose={() => setJoiningMatch(null)}
        onOpenWallet={() => setIsInAppDepositOpen(true)}
        onSuccessJoined={handleMatchJoinedSuccess}
      />

      <RoomDetailsModal
        match={viewingRoomMatch}
        onClose={() => setViewingRoomMatch(null)}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />

      <InAppPaymentModal
        isOpen={isInAppDepositOpen}
        onClose={() => setIsInAppDepositOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenRoomModal={(matchId) => {
          setIsNotificationsOpen(false);
          const m = matches.find((match) => match.id === matchId);
          if (m) setViewingRoomMatch(m);
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
