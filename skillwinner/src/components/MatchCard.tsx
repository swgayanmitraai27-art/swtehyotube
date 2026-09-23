import React from 'react';
import { Trophy, Users, Crosshair, MapPin, Clock, Key, Zap, Flame, ShieldAlert } from 'lucide-react';
import { Match } from '../types';
import { useAuth } from '../context/AuthContext';

interface MatchCardProps {
  match: Match;
  onJoinClick: (match: Match) => void;
  onViewRoomClick: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onJoinClick, onViewRoomClick }) => {
  const { userRegistrations } = useAuth();
  const isJoined = userRegistrations.some((reg) => reg.matchId === match.id);

  const slotPercent = Math.round((match.filledSlots / match.maxSlots) * 100);
  const isFull = match.filledSlots >= match.maxSlots;

  const getModeBadge = () => {
    switch (match.mode) {
      case 'SOLO_RANK_KILL':
        return { label: 'Solo (Rank + Kill)', color: 'bg-red-500/20 text-red-400 border-red-500/40' };
      case 'SQUAD_RANK':
        return { label: 'Squad (Rank)', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' };
      case 'CS_4V4':
        return { label: 'Clash Squad 4v4', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' };
      case 'CS_2V2':
        return { label: 'Clash Squad 2v2', color: 'bg-teal-500/20 text-teal-400 border-teal-500/40' };
      case 'LONE_WOLF_1V1':
        return { label: 'Lone Wolf 1v1', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
      case 'MEGA_GADGET':
        return { label: 'Mega Giveaway', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse' };
      default:
        return { label: 'Battle Royale', color: 'bg-gray-500/20 text-gray-400 border-gray-500/40' };
    }
  };

  const badge = getModeBadge();

  return (
    <div className={`bg-[#0F1422] rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
      match.isMegaMatch
        ? 'border-amber-500/40 shadow-xl shadow-amber-500/10'
        : 'border-[#1F293D] hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/5'
    }`}>
      {/* Top Banner & Mode */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.color}`}>
              {badge.label}
            </span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1 bg-[#151C2C] px-2 py-0.5 rounded-full border border-gray-800">
              <MapPin className="w-3 h-3 text-red-400" /> {match.map}
            </span>
          </div>

          <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1 bg-[#151C2C] px-2.5 py-1 rounded-xl border border-gray-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> {match.startTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-base sm:text-lg text-white mb-3 line-clamp-1 leading-snug">
          {match.title}
        </h3>

        {/* Prize Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 bg-[#151C2C] rounded-2xl p-3 border border-gray-800/80 mb-4">
          {/* Entry Fee */}
          <div className="text-center">
            <div className="text-[10px] text-gray-400 font-semibold uppercase">Entry</div>
            <div className="text-base font-black text-white">₹{match.entryFee}</div>
            <div className="text-[9px] text-amber-400 font-bold">10% Bonus</div>
          </div>

          {/* Per Kill */}
          <div className="text-center border-x border-gray-800/80">
            <div className="text-[10px] text-gray-400 font-semibold uppercase flex items-center justify-center gap-0.5">
              <Crosshair className="w-3 h-3 text-red-400" /> Per Kill
            </div>
            <div className="text-base font-black text-red-400">
              {match.perKill > 0 ? `₹${match.perKill}` : 'N/A'}
            </div>
            <div className="text-[9px] text-gray-500">Instant Win</div>
          </div>

          {/* 1st Prize */}
          <div className="text-center">
            <div className="text-[10px] text-gray-400 font-semibold uppercase flex items-center justify-center gap-0.5">
              <Trophy className="w-3 h-3 text-amber-400" /> 1st Prize
            </div>
            <div className="text-base font-black text-amber-400">
              {match.isMegaMatch ? 'GIFT' : `₹${match.prizeDistribution.rank1}`}
            </div>
            <div className="text-[9px] text-emerald-400 font-bold">
              {match.isMegaMatch ? 'Phone' : 'Booyah'}
            </div>
          </div>
        </div>

        {/* Slots Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-gray-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gray-500" /> Slots Joined
            </span>
            <span className="font-bold text-gray-300">
              <span className="text-white font-extrabold">{match.filledSlots}</span> / {match.maxSlots}
            </span>
          </div>

          <div className="w-full h-2 bg-[#1A2234] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                slotPercent > 80
                  ? 'bg-gradient-to-r from-orange-500 to-red-600'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${slotPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Action Button */}
      <div className="p-4 sm:p-5 pt-0">
        {isJoined ? (
          <button
            onClick={() => onViewRoomClick(match)}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-600/20"
          >
            <Key className="w-4 h-4 text-amber-300" />
            <span>View Room ID & Password</span>
          </button>
        ) : (
          <button
            onClick={() => onJoinClick(match)}
            disabled={isFull}
            className={`w-full font-black py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2 text-sm uppercase tracking-wide ${
              isFull
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-lg shadow-red-600/25 active:scale-[0.98]'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>{isFull ? 'Match Full' : `Join Match • ₹${match.entryFee}`}</span>
          </button>
        )}
      </div>
    </div>
  );
};
