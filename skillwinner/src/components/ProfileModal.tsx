import React, { useState } from 'react';
import { X, User, ShieldCheck, Trophy, Crosshair, Award, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateIGNAndUID } = useAuth();

  const [ign, setIgn] = useState(user?.freeFireIGN || '');
  const [uid, setUid] = useState(user?.freeFireUID || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateIGNAndUID(ign.trim(), uid.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#0F1422] border border-[#1F293D] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 to-amber-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Gamer Profile</h2>
              <p className="text-xs text-gray-400">Free Fire ID & Credentials</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#151C2C] text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 bg-[#151C2C] rounded-2xl p-3 border border-gray-800 mb-4 text-center">
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" /> Winnings
            </div>
            <div className="text-base font-black text-emerald-400">₹{user?.total_winnings || 0}</div>
          </div>

          <div className="border-x border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-center gap-1">
              <Crosshair className="w-3 h-3 text-red-400" /> Total Kills
            </div>
            <div className="text-base font-black text-red-400">{user?.total_kills || 0}</div>
          </div>

          <div>
            <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-center gap-1">
              <Award className="w-3 h-3 text-purple-400" /> Matches
            </div>
            <div className="text-base font-black text-white">{user?.total_matches_played || 0}</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3.5 mb-4">
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase block mb-1">
              Default Free Fire IGN (In-Game Name)
            </label>
            <input
              type="text"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              placeholder="e.g. OP_SAMSHER_YT"
              className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase block mb-1">
              Default Free Fire UID (Numeric ID)
            </label>
            <input
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="e.g. 839201948"
              className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-mono outline-none"
            />
          </div>

          {savedSuccess && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Profile credentials updated successfully!
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black py-3 px-4 rounded-xl transition text-xs uppercase shadow-lg shadow-red-600/25"
          >
            Save Free Fire Credentials
          </button>
        </form>

        {/* Legal & Age compliance */}
        <div className="bg-[#151C2C] rounded-2xl p-3 border border-gray-800 text-[11px] text-gray-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Verified 18+ Gamer • Compliant with Indian Skill Gaming Regulations</span>
        </div>
      </div>
    </div>
  );
};
