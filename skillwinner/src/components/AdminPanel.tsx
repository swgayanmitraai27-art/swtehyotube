import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Key,
  Trophy,
  CheckCircle2,
  Users,
  Clock,
  Send,
  RotateCcw,
  Sparkles,
  Smartphone,
  BookOpen,
  Phone,
  AlertTriangle,
  Gift,
} from 'lucide-react';
import { Match, MatchMode } from '../types';
import { calculateMatchFinancials } from '../lib/constants';
import { useAuth } from '../context/AuthContext';

interface AdminPanelProps {
  matches: Match[];
  onAddMatch: (newMatch: Match) => void;
  onUpdateMatch: (updated: Match) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ matches, onAddMatch, onUpdateMatch }) => {
  const {
    withdrawalRequests,
    approveWithdrawal,
    creditMatchWinnings,
    allUsers,
    addNotification,
    processAutoRefundForMatch,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'MATCHES' | 'CREATE' | 'WITHDRAWALS' | 'USERS'>('MATCHES');

  // New Match Form State
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<MatchMode>('SOLO_RANK_KILL');
  const [map, setMap] = useState<Match['map']>('Bermuda');
  const [entryFee, setEntryFee] = useState<number>(20);
  const [startTime, setStartTime] = useState<string>('08:30 PM Today');
  const [maxSlots, setMaxSlots] = useState<number>(40);
  const [minThreshold, setMinThreshold] = useState<number>(25);
  const [rulesDescription, setRulesDescription] = useState<string>(
    '• Gun Properties ON • No Hack/Script • Fair Play only. Room credentials will reveal 15 min before start.'
  );

  // Room Credentials State
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const [roomIdInput, setRoomIdInput] = useState<string>('');
  const [roomPasswordInput, setRoomPasswordInput] = useState<string>('');
  const [publishStatus, setPublishStatus] = useState<string>('');

  // Prize Distribution State
  const [rank1UID, setRank1UID] = useState<string>('839201948');
  const [rank1Kills, setRank1Kills] = useState<number>(6);
  const [rank2UID, setRank2UID] = useState<string>('');
  const [rank2Kills, setRank2Kills] = useState<number>(3);
  const [rank3UID, setRank3UID] = useState<string>('');
  const [rank3Kills, setRank3Kills] = useState<number>(2);
  const [distributeSuccess, setDistributeSuccess] = useState<string>('');
  const [refundStatus, setRefundStatus] = useState<string>('');

  const activeMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  const handleCreateMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const financials = calculateMatchFinancials(entryFee, maxSlots, mode);

    let finalTitle = title;
    let isMega = false;
    let megaPrize = '';

    if (mode === 'WEEKLY_GADGET') {
      finalTitle = finalTitle || '🎧 Sunday Gadget Cup: Razer Gaming Headset + ₹5,000 Cash';
      isMega = true;
      megaPrize = 'Razer Gaming Headset + ₹5,000 Cash';
    } else if (mode === 'MEGA_IPHONE') {
      finalTitle = finalTitle || '📱 Grand Monthly Finale: Win Apple iPhone 15 (₹65,000)';
      isMega = true;
      megaPrize = 'Brand New Apple iPhone 15';
    } else if (!finalTitle) {
      finalTitle = `${mode === 'SOLO_RANK_KILL' ? 'Solo (Rank+Kill)' : mode} Match - ₹${entryFee}`;
    }

    const newMatch: Match = {
      id: `match_${mode.toLowerCase()}_${Date.now()}`,
      title: finalTitle,
      game: 'FREE_FIRE_MAX',
      mode,
      map,
      entryFee,
      perKill: financials.perKill,
      maxSlots,
      filledSlots: 1,
      startTime,
      status: 'UPCOMING',
      minPlayersRequired: minThreshold,
      rulesDescription,
      prizeDistribution: financials,
      isMegaMatch: isMega,
      megaPrizeName: megaPrize,
    };

    onAddMatch(newMatch);
    setTitle('');
    setActiveTab('MATCHES');
  };

  const handlePublishRoom = () => {
    if (!activeMatch || !roomIdInput || !roomPasswordInput) return;

    const updated: Match = {
      ...activeMatch,
      roomId: roomIdInput.trim(),
      roomPassword: roomPasswordInput.trim(),
      status: 'ROOM_OPEN',
    };

    onUpdateMatch(updated);

    // Send in-app notification
    addNotification({
      title: `🔑 Custom Room Open: ${activeMatch.title}`,
      message: `Room ID: ${roomIdInput.trim()} | Password: ${roomPasswordInput.trim()}. Join Free Fire now!`,
      type: 'ROOM_OPEN',
      matchId: activeMatch.id,
    });

    setPublishStatus(`✅ Room ID (${roomIdInput}) published & notification dispatched!`);
    setTimeout(() => setPublishStatus(''), 4000);
  };

  const handleDistributePrizes = () => {
    if (!activeMatch) return;

    const perKillReward = activeMatch.prizeDistribution.perKill;

    // Credit Rank 1
    if (rank1UID) {
      const basePrize = typeof activeMatch.prizeDistribution.rank1 === 'number' ? activeMatch.prizeDistribution.rank1 : 5000;
      const rank1Prize = basePrize + rank1Kills * perKillReward;
      creditMatchWinnings(rank1UID, rank1Prize, rank1Kills, activeMatch.title);
    }

    // Credit Rank 2
    if (rank2UID && activeMatch.prizeDistribution.rank2) {
      const rank2Prize = activeMatch.prizeDistribution.rank2 + rank2Kills * perKillReward;
      creditMatchWinnings(rank2UID, rank2Prize, rank2Kills, activeMatch.title);
    }

    // Credit Rank 3
    if (rank3UID && activeMatch.prizeDistribution.rank3) {
      const rank3Prize = activeMatch.prizeDistribution.rank3 + rank3Kills * perKillReward;
      creditMatchWinnings(rank3UID, rank3Prize, rank3Kills, activeMatch.title);
    }

    const updated: Match = {
      ...activeMatch,
      status: 'COMPLETED',
    };
    onUpdateMatch(updated);

    setDistributeSuccess(`🎉 Prizes credited to winners' Real Wallets! 30% platform profit secured.`);
    setTimeout(() => setDistributeSuccess(''), 5000);
  };

  const handleAutoRefund = () => {
    if (!activeMatch) return;
    const res = processAutoRefundForMatch(activeMatch);

    const updated: Match = {
      ...activeMatch,
      status: 'CANCELLED',
    };
    onUpdateMatch(updated);

    setRefundStatus(`🔄 Processed 100% refund for ${res.refundedCount} players (Total ₹${res.totalAmount} refunded).`);
    setTimeout(() => setRefundStatus(''), 5000);
  };

  return (
    <div className="bg-[#0F1422] border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              ADMIN TOURNAMENT CONTROLLER
              <span className="text-[10px] bg-amber-500 text-black font-extrabold px-2 py-0.5 rounded-full">
                70/30 SPLIT ENGINE
              </span>
            </h2>
            <p className="text-xs text-gray-400">Manage Matches, Custom Rules, Player Phones & Instant Payouts</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#151C2C] p-1 rounded-2xl border border-gray-800 text-xs font-bold w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('MATCHES')}
            className={`px-3 py-2 rounded-xl transition flex-1 sm:flex-none ${
              activeTab === 'MATCHES' ? 'bg-amber-500 text-black' : 'text-gray-400'
            }`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('CREATE')}
            className={`px-3 py-2 rounded-xl transition flex-1 sm:flex-none ${
              activeTab === 'CREATE' ? 'bg-amber-500 text-black' : 'text-gray-400'
            }`}
          >
            + Create Match
          </button>
          <button
            onClick={() => setActiveTab('WITHDRAWALS')}
            className={`px-3 py-2 rounded-xl transition flex-1 sm:flex-none relative ${
              activeTab === 'WITHDRAWALS' ? 'bg-amber-500 text-black' : 'text-gray-400'
            }`}
          >
            Payouts
            {withdrawalRequests.filter((r) => r.status === 'PENDING').length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[9px]">
                {withdrawalRequests.filter((r) => r.status === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-3 py-2 rounded-xl transition flex-1 sm:flex-none ${
              activeTab === 'USERS' ? 'bg-amber-500 text-black' : 'text-gray-400'
            }`}
          >
            Players ({allUsers.length})
          </button>
        </div>
      </div>

      {/* Tab: MANAGE MATCHES (Room ID + Result Distribution + Auto Refund) */}
      {activeTab === 'MATCHES' && (
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase block mb-2">Select Live Match to Control</label>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full bg-[#151C2C] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none"
            >
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} [{m.map}] • Entry: ₹{m.entryFee} ({m.filledSlots}/{m.maxSlots} Slots) - Status: {m.status}
                </option>
              ))}
            </select>
          </div>

          {activeMatch && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Step 1: Host & Publish Custom Room */}
              <div className="bg-[#151C2C] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-black text-sm">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Step 1: Publish Custom Room ID & Password</span>
                </div>
                <p className="text-xs text-gray-400">
                  Custom Room ID aur Password dalein. Registered gamers ko app aur notification ke zariye instant mil jayega.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 block mb-1">Custom Room ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 8839201"
                      value={roomIdInput || activeMatch.roomId || ''}
                      onChange={(e) => setRoomIdInput(e.target.value)}
                      className="w-full bg-[#0F1422] border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-400 block mb-1">Room Password</label>
                    <input
                      type="text"
                      placeholder="e.g. 7788"
                      value={roomPasswordInput || activeMatch.roomPassword || ''}
                      onChange={(e) => setRoomPasswordInput(e.target.value)}
                      className="w-full bg-[#0F1422] border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-mono outline-none"
                    />
                  </div>

                  {publishStatus && (
                    <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold">
                      {publishStatus}
                    </div>
                  )}

                  <button
                    onClick={handlePublishRoom}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs uppercase shadow-lg shadow-amber-500/20"
                  >
                    <Send className="w-3.5 h-3.5" /> Publish Room & Dispatch Notification
                  </button>
                </div>
              </div>

              {/* Step 2: One-Click 70/30 Prize Distribution & Auto-Refund */}
              <div className="bg-[#151C2C] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-black text-sm">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span>Step 2: Automated Prize Distribution</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    70% Pool / 30% Profit
                  </span>
                </div>

                {/* Match Financial Summary */}
                <div className="bg-[#0F1422] rounded-xl p-3 border border-gray-800 text-[11px] grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-gray-500">Per Kill Pool</span>
                    <div className="font-bold text-red-400">₹{activeMatch.prizeDistribution.perKill}/Kill</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Booyah Prize</span>
                    <div className="font-bold text-amber-400">
                      {typeof activeMatch.prizeDistribution.rank1 === 'number'
                        ? `₹${activeMatch.prizeDistribution.rank1}`
                        : activeMatch.prizeDistribution.rank1}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Your 30% Profit</span>
                    <div className="font-bold text-emerald-400">₹{activeMatch.prizeDistribution.platformProfit}</div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Rank 1 Winner UID"
                      value={rank1UID}
                      onChange={(e) => setRank1UID(e.target.value)}
                      className="w-2/3 bg-[#0F1422] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Kills"
                      value={rank1Kills}
                      onChange={(e) => setRank1Kills(Number(e.target.value))}
                      className="w-1/3 bg-[#0F1422] border border-gray-800 rounded-xl px-3 py-2 text-xs text-red-400 font-bold"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Rank 2 UID (Optional)"
                      value={rank2UID}
                      onChange={(e) => setRank2UID(e.target.value)}
                      className="w-2/3 bg-[#0F1422] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Kills"
                      value={rank2Kills}
                      onChange={(e) => setRank2Kills(Number(e.target.value))}
                      className="w-1/3 bg-[#0F1422] border border-gray-800 rounded-xl px-3 py-2 text-xs text-red-400 font-bold"
                    />
                  </div>

                  {distributeSuccess && (
                    <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold">
                      {distributeSuccess}
                    </div>
                  )}

                  {refundStatus && (
                    <div className="p-2.5 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-300 text-xs font-bold">
                      {refundStatus}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleDistributePrizes}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3 px-3 rounded-xl transition text-xs uppercase shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Distribute Prizes
                    </button>

                    <button
                      onClick={handleAutoRefund}
                      className="bg-[#151C2C] hover:bg-red-950/40 border border-red-500/40 text-red-400 hover:text-red-300 font-black py-3 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Auto-Refund All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: CREATE MATCH (with custom rules & gadget presets) */}
      {activeTab === 'CREATE' && (
        <form onSubmit={handleCreateMatchSubmit} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase block mb-1">Game Mode</label>
              <select
                value={mode}
                onChange={(e) => {
                  const m = e.target.value as MatchMode;
                  setMode(m);
                  if (m === 'WEEKLY_GADGET') {
                    setEntryFee(300);
                    setMaxSlots(120);
                    setMinThreshold(100);
                  } else if (m === 'MEGA_IPHONE') {
                    setEntryFee(500);
                    setMaxSlots(300);
                    setMinThreshold(250);
                  } else if (m === 'CS_4V4') {
                    setMaxSlots(8);
                    setMinThreshold(8);
                  } else if (m === 'CS_2V2') {
                    setMaxSlots(4);
                    setMinThreshold(4);
                  } else if (m === 'LONE_WOLF_1V1') {
                    setMaxSlots(2);
                    setMinThreshold(2);
                  } else {
                    setMaxSlots(40);
                    setMinThreshold(25);
                  }
                }}
                className="w-full bg-[#151C2C] border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none"
              >
                <option value="SOLO_RANK_KILL">🎯 Solo (Rank + Per Kill)</option>
                <option value="WEEKLY_GADGET">🎧 Option 1: ₹300 Weekly Sunday Gadget (100-120 Players)</option>
                <option value="MEGA_IPHONE">📱 Option 2: ₹500 Monthly Mega iPhone (250-300 Players)</option>
                <option value="SQUAD_RANK">🛡️ Squad Full Map (Ranked)</option>
                <option value="CS_4V4">⚔️ Clash Squad 4v4</option>
                <option value="CS_2V2">🤝 Clash Squad 2v2</option>
                <option value="LONE_WOLF_1V1">🥊 Lone Wolf 1v1</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 uppercase block mb-1">Map</label>
              <select
                value={map}
                onChange={(e) => setMap(e.target.value as any)}
                className="w-full bg-[#151C2C] border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none"
              >
                <option value="Bermuda">Bermuda</option>
                <option value="Purgatory">Purgatory</option>
                <option value="Kalahari">Kalahari</option>
                <option value="Alpine">Alpine</option>
                <option value="NexTerra">NexTerra</option>
                <option value="Iron Cage (1v1)">Iron Cage (1v1)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase block mb-1">Custom Match Title (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 🔥 Sunday Rush Hour Battle (₹10/Kill)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#151C2C] border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase block mb-1">Entry Fee (₹)</label>
              <input
                type="number"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                className="w-full bg-[#151C2C] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white font-bold outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase block mb-1">Max Slots</label>
              <input
                type="number"
                value={maxSlots}
                onChange={(e) => setMaxSlots(Number(e.target.value))}
                className="w-full bg-[#151C2C] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white font-bold outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase block mb-1">Min Threshold</label>
              <input
                type="number"
                value={minThreshold}
                onChange={(e) => setMinThreshold(Number(e.target.value))}
                className="w-full bg-[#151C2C] border border-gray-800 rounded-xl px-3 py-2 text-sm text-amber-400 font-bold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase block mb-1">Schedule Start Time</label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="08:30 PM Today"
              className="w-full bg-[#151C2C] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase block mb-1">
              Custom Rules & Description (Visible to Gamers)
            </label>
            <textarea
              rows={3}
              value={rulesDescription}
              onChange={(e) => setRulesDescription(e.target.value)}
              placeholder="Enter specific tournament rules..."
              className="w-full bg-[#151C2C] border border-gray-800 rounded-xl p-3 text-xs text-white outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs uppercase shadow-xl shadow-red-600/25"
          >
            <Plus className="w-4 h-4" /> Save & Launch Match to App
          </button>
        </form>
      )}

      {/* Tab: USER LIST WITH PHONE NUMBERS & EMAILS */}
      {activeTab === 'USERS' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-300 uppercase">Registered Players & Credentials Directory</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allUsers.map((u) => (
              <div key={u.uid} className="bg-[#151C2C] border border-gray-800 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-white text-sm">{u.name || 'Gamer'}</span>
                    <span className="text-[10px] text-gray-400 block">{u.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold font-mono text-[11px] block">IGN: {u.freeFireIGN || 'N/A'}</span>
                    <span className="text-gray-400 font-mono text-[10px]">UID: {u.freeFireUID || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs bg-[#0F1422] px-2.5 py-1.5 rounded-xl border border-gray-800">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-gray-200">{u.phone}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 pt-1 border-t border-gray-800/80 text-[11px]">
                  <span>Real: <b className="text-emerald-400">₹{u.real_balance}</b> | Bonus: <b className="text-amber-400">₹{u.bonus_balance}</b></span>
                  <span>Matches: <b className="text-white">{u.total_matches_played}</b> | Won: <b className="text-emerald-400">₹{u.total_winnings}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: WITHDRAWALS */}
      {activeTab === 'WITHDRAWALS' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-300 uppercase">Pending Player UPI Withdrawals</div>
          {withdrawalRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">No withdrawal requests right now.</div>
          ) : (
            withdrawalRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#151C2C] border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-extrabold text-white text-sm">₹{req.amount} UPI Payout Request</div>
                  <div className="text-amber-400 font-mono mt-0.5">UPI ID: {req.upiId}</div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Phone: {req.userPhone} • Player: {req.freeFireIGN} • Requested: {req.requestedAt}
                  </div>
                </div>

                {req.status === 'PENDING' ? (
                  <button
                    onClick={() => approveWithdrawal(req.id)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-4 py-2 rounded-xl transition text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Paid (UPI Sent)
                  </button>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
