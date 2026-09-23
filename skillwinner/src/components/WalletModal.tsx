import React, { useState } from 'react';
import { X, Wallet, Zap, ArrowDownToLine, ArrowUpRight, Plus, ShieldCheck, CheckCircle2, AlertCircle, History, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { user, transactions, requestWithdrawal, addWalletBalance } = useAuth();

  const [tab, setTab] = useState<'OVERVIEW' | 'ADD_CASH' | 'WITHDRAW' | 'HISTORY'>('OVERVIEW');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('100');
  const [upiId, setUpiId] = useState<string>('');
  const [withdrawStatus, setWithdrawStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [depositAmount, setDepositAmount] = useState<number>(50);

  if (!isOpen) return null;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawStatus(null);
    const res = requestWithdrawal(Number(withdrawAmount), upiId.trim());
    setWithdrawStatus(res);
    if (res.success) {
      setTimeout(() => {
        setTab('HISTORY');
        setWithdrawStatus(null);
      }, 1500);
    }
  };

  const handleAddCashRedirect = (amount: number) => {
    // Open unified payment bridge on main website
    const checkoutUrl = `/pay?app=skillwinner&userId=${encodeURIComponent(user?.uid || 'guest')}&amount=${amount}`;
    window.open(checkoutUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#0F1422] border border-[#1F293D] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-emerald-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Dual-Wallet Hub</h2>
              <p className="text-xs text-gray-400">Real Cash & 50% Bonus Coins</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#151C2C] text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 bg-[#151C2C] p-1 rounded-2xl border border-gray-800 mb-4 text-xs font-bold">
          <button
            onClick={() => setTab('OVERVIEW')}
            className={`py-2 rounded-xl transition ${
              tab === 'OVERVIEW' ? 'bg-red-500 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab('ADD_CASH')}
            className={`py-2 rounded-xl transition ${
              tab === 'ADD_CASH' ? 'bg-red-500 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            + Add Cash
          </button>
          <button
            onClick={() => setTab('WITHDRAW')}
            className={`py-2 rounded-xl transition ${
              tab === 'WITHDRAW' ? 'bg-red-500 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Withdraw
          </button>
          <button
            onClick={() => setTab('HISTORY')}
            className={`py-2 rounded-xl transition ${
              tab === 'HISTORY' ? 'bg-red-500 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Passbook
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto space-y-4 flex-1 pr-1">
          {tab === 'OVERVIEW' && (
            <>
              {/* Dual Balance Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Real Wallet */}
                <div className="bg-gradient-to-br from-emerald-950/40 to-[#121826] border border-emerald-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider mb-1">
                    Real Cash
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mb-1">₹{user?.real_balance || 0}</div>
                  <p className="text-[10px] text-emerald-300 font-medium">100% Usable & Withdrawable</p>
                </div>

                {/* Bonus Wallet */}
                <div className="bg-gradient-to-br from-amber-950/40 to-[#121826] border border-amber-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider mb-1">
                    Bonus Coins
                  </div>
                  <div className="text-2xl font-black text-amber-400 mb-1">₹{user?.bonus_balance || 0}</div>
                  <p className="text-[10px] text-amber-300 font-medium">Max 10% usable per match</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTab('ADD_CASH')}
                  className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-red-600/25"
                >
                  <Plus className="w-4 h-4" /> Add Cash (+50%)
                </button>
                <button
                  onClick={() => setTab('WITHDRAW')}
                  className="bg-[#151C2C] hover:bg-[#1A2234] border border-gray-700 text-white font-bold py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowDownToLine className="w-4 h-4 text-emerald-400" /> Withdraw UPI
                </button>
              </div>

              {/* Total Stats */}
              <div className="bg-[#151C2C] rounded-2xl p-4 border border-gray-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Total Tournaments Played</span>
                  <span className="font-bold text-white">{user?.total_matches_played || 0} Matches</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Total Winnings Won</span>
                  <span className="font-bold text-emerald-400">₹{user?.total_winnings || 0}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Total Frags (Kills)</span>
                  <span className="font-bold text-red-400">{user?.total_kills || 0} Kills</span>
                </div>
              </div>
            </>
          )}

          {tab === 'ADD_CASH' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-950/60 to-orange-950/60 border border-orange-500/30 rounded-2xl p-3.5 flex items-center gap-3">
                <Zap className="w-6 h-6 text-amber-400 fill-amber-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-orange-300">50% Instant Deposit Bonus!</div>
                  <div className="text-gray-400 text-[11px]">Pay via UPI / QR / NetBanking on official Razorpay gateway.</div>
                </div>
              </div>

              {/* Preset Options */}
              <div className="grid grid-cols-3 gap-2.5">
                {[20, 50, 100, 200, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDepositAmount(amt)}
                    className={`p-3 rounded-2xl border text-center transition ${
                      depositAmount === amt
                        ? 'bg-red-500/20 border-red-500 text-white scale-[1.02]'
                        : 'bg-[#151C2C] border-gray-800 text-gray-300'
                    }`}
                  >
                    <div className="text-lg font-black">₹{amt}</div>
                    <div className="text-[10px] text-amber-400 font-bold">+₹{Math.round(amt * 0.5)} Bonus</div>
                  </button>
                ))}
              </div>

              {/* Pay Button */}
              <button
                onClick={() => handleAddCashRedirect(depositAmount)}
                className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black py-4 px-6 rounded-2xl transition flex items-center justify-center gap-2 text-base shadow-xl shadow-red-600/30"
              >
                <span>Proceed to Pay ₹{depositAmount} via UPI / QR</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-gray-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Powered by SW Tech Solution (Razorpay Verified)
              </div>
            </div>
          )}

          {tab === 'WITHDRAW' && (
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="bg-[#151C2C] rounded-2xl p-3.5 border border-gray-800 flex justify-between items-center text-xs">
                <span className="text-gray-400">Withdrawable Real Balance:</span>
                <span className="font-extrabold text-emerald-400 text-base">₹{user?.real_balance || 0}</span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase block mb-1.5">
                  Withdrawal Amount (Min ₹50)
                </label>
                <input
                  type="number"
                  min="50"
                  max={user?.real_balance || 0}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase block mb-1.5">
                  Your UPI ID (GPay / PhonePe / Paytm / BHIM)
                </label>
                <input
                  type="text"
                  placeholder="e.g. yourname@oksbi or 9935259374@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none font-mono"
                />
              </div>

              {withdrawStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    withdrawStatus.success
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  {withdrawStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{withdrawStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-xl shadow-emerald-600/30"
              >
                <ArrowDownToLine className="w-4 h-4" /> Request UPI Withdrawal
              </button>
            </form>
          )}

          {tab === 'HISTORY' && (
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">No transactions recorded yet.</div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-[#151C2C] border border-gray-800 rounded-2xl p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{tx.description}</div>
                      <div className="text-[10px] text-gray-500">{tx.createdAt}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-black text-sm ${
                          tx.realAmount >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {tx.realAmount >= 0 ? `+₹${tx.realAmount}` : `-₹${Math.abs(tx.realAmount)}`}
                      </div>
                      {tx.bonusAmount !== 0 && (
                        <div className="text-[10px] text-amber-400 font-semibold">
                          {tx.bonusAmount > 0 ? `+₹${tx.bonusAmount} Bonus` : `-₹${Math.abs(tx.bonusAmount)} Bonus`}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
