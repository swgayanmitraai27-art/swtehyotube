import React, { useState } from 'react';
import { X, ShieldCheck, Zap, Wallet, AlertCircle, Trophy, Crosshair, ArrowRight, UserCheck, Flame } from 'lucide-react';
import { Match } from '../types';
import { useAuth } from '../context/AuthContext';
import { calculateWalletDeduction } from '../lib/constants';

interface JoinMatchModalProps {
  match: Match | null;
  onClose: () => void;
  onOpenWallet: () => void;
  onSuccessJoined: () => void;
}

export const JoinMatchModal: React.FC<JoinMatchModalProps> = ({
  match,
  onClose,
  onOpenWallet,
  onSuccessJoined,
}) => {
  const { user, deductMatchFee, updateIGNAndUID } = useAuth();

  const [ign, setIgn] = useState<string>(user?.freeFireIGN || '');
  const [uid, setUid] = useState<string>(user?.freeFireUID || '');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!match) return null;

  const realBalance = user?.real_balance || 0;
  const bonusBalance = user?.bonus_balance || 0;

  const deduction = calculateWalletDeduction(match.entryFee, realBalance, bonusBalance);

  const handleConfirmJoin = () => {
    setErrorMsg('');

    if (!ign.trim()) {
      setErrorMsg('Please enter your Free Fire In-Game Name (IGN)');
      return;
    }

    if (!uid.trim() || uid.trim().length < 6) {
      setErrorMsg('Please enter a valid numeric Free Fire UID (Minimum 6-10 digits)');
      return;
    }

    if (!deduction.canAfford) {
      setErrorMsg(`Insufficient balance. You need ₹${deduction.shortfall} more Real Cash.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const success = deductMatchFee(match.id, deduction.realDeducted, deduction.bonusDeducted, ign.trim(), uid.trim());
      setIsSubmitting(false);

      if (success) {
        onSuccessJoined();
      } else {
        setErrorMsg('Failed to join match. Please check your wallet balance.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#0F1422] border border-[#1F293D] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Glow header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Confirm Match Registration</h2>
              <p className="text-xs text-gray-400">Free Fire UID Verification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#151C2C] text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Match Summary Pill */}
        <div className="bg-[#151C2C] rounded-2xl p-3.5 border border-gray-800/80 mb-4">
          <div className="text-xs font-black text-white mb-1.5 line-clamp-1">{match.title}</div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Map: <b className="text-gray-200">{match.map}</b></span>
            <span>Per Kill: <b className="text-red-400">{match.perKill > 0 ? `₹${match.perKill}` : 'N/A'}</b></span>
            <span>Booyah: <b className="text-amber-400">₹{match.prizeDistribution.rank1}</b></span>
          </div>
        </div>

        {/* Mandatory Free Fire IGN & UID inputs */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
              1. Free Fire In-Game Name (IGN) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. OP_SAMSHER_YT"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
              2. Free Fire UID (Numeric ID) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 839201948 (From FF Profile)"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition font-mono"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              ⚠️ Make sure UID matches your Free Fire profile so prizes are credited automatically.
            </p>
          </div>
        </div>

        {/* Dual-Wallet Deduction Breakdown */}
        <div className="bg-[#151C2C] rounded-2xl p-3.5 border border-gray-800/80 mb-4 space-y-2 text-xs">
          <div className="font-bold text-gray-300 uppercase text-[11px] mb-1 flex items-center justify-between">
            <span>Payment Breakdown</span>
            <span className="text-amber-400 font-normal">10% Bonus Rule Applied</span>
          </div>

          <div className="flex justify-between items-center text-gray-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> From Bonus Wallet (Max 10%)
            </span>
            <span className="font-bold text-amber-400">-₹{deduction.bonusDeducted} Coins</span>
          </div>

          <div className="flex justify-between items-center text-gray-400">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" /> From Real Wallet (90%)
            </span>
            <span className="font-bold text-emerald-400">-₹{deduction.realDeducted}</span>
          </div>

          <div className="pt-2 border-t border-gray-800 flex justify-between items-center font-bold">
            <span className="text-white">Total Entry Fee</span>
            <span className="text-white font-extrabold text-sm">₹{match.entryFee}</span>
          </div>
        </div>

        {/* Error / Shortfall notice */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5">
          {!deduction.canAfford ? (
            <button
              onClick={() => {
                onClose();
                onOpenWallet();
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-600/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Add Cash (Get 50% Bonus Free)</span>
            </button>
          ) : (
            <button
              onClick={handleConfirmJoin}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xl shadow-red-600/30 uppercase tracking-wider"
            >
              {isSubmitting ? (
                <span>Registering Slot...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Confirm & Book Slot • ₹{match.entryFee}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
