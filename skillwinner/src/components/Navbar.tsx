import React from 'react';
import { Trophy, Wallet, ShieldAlert, User, ShieldCheck, Zap, Plus, Bell, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenLogin: () => void;
  onOpenInAppDeposit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWallet,
  onOpenProfile,
  onOpenNotifications,
  onOpenLogin,
  onOpenInAppDeposit,
}) => {
  const { user, isAdmin, setIsAdmin, notifications } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#070A12]/95 backdrop-blur-xl border-b border-[#1F293D] px-3 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-red-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0F1422] rounded-[14px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-white font-sans">
                SKILL<span className="text-red-500">WINNER</span>
              </span>
              <span className="text-[9px] bg-red-500/20 text-red-400 font-bold px-1.5 py-0.2 rounded border border-red-500/30">
                ESPORTS
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium truncate max-w-[130px] sm:max-w-none">
              {user ? user.phone : 'Free Fire Tournaments'}
            </p>
          </div>
        </div>

        {/* Action Controls & Wallets */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Admin Switcher */}
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`text-xs px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition ${
              isAdmin
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-[#151C2C] text-gray-400 hover:text-white border border-[#1F293D]'
            }`}
            title="Toggle Admin Mode"
          >
            {isAdmin ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isAdmin ? 'Admin View' : 'Player View'}</span>
          </button>

          {/* Dual Wallet Pill */}
          <button
            onClick={onOpenWallet}
            className="flex items-center bg-[#0F1422] hover:bg-[#151C2C] border border-[#1F293D] hover:border-emerald-500/50 rounded-2xl p-1 sm:p-1.5 transition shadow-sm group"
          >
            {/* Real Cash */}
            <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Wallet className="w-3 h-3 text-emerald-400" />
              <div className="text-left">
                <div className="text-[8px] text-gray-400 font-semibold uppercase leading-none">Real</div>
                <div className="text-[11px] sm:text-xs font-black text-emerald-400 leading-tight">
                  ₹{user?.real_balance || 0}
                </div>
              </div>
            </div>

            {/* Bonus Coins */}
            <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 ml-1 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <div className="text-left">
                <div className="text-[8px] text-gray-400 font-semibold uppercase leading-none">Bonus</div>
                <div className="text-[11px] sm:text-xs font-black text-amber-400 leading-tight">
                  ₹{user?.bonus_balance || 0}
                </div>
              </div>
            </div>

            {/* In-App Direct Add Icon */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onOpenInAppDeposit();
              }}
              title="Add Cash (In-App UPI)"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-center ml-1 group-hover:scale-105 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#0F1422] border border-[#1F293D] flex items-center justify-center text-gray-300 hover:text-white hover:border-purple-500/50 transition relative"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile / Login Trigger */}
          <button
            onClick={user ? onOpenProfile : onOpenLogin}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#0F1422] border border-[#1F293D] flex items-center justify-center text-gray-300 hover:text-white hover:border-red-500/50 transition"
            title={user ? 'Profile & Free Fire UID' : 'Login'}
          >
            {user ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
