import React from 'react';
import { X, Bell, Trophy, Zap, Key, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRoomModal?: (matchId?: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onOpenRoomModal,
}) => {
  const { notifications, markNotificationAsRead } = useAuth();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ROOM_OPEN':
        return <Key className="w-4 h-4 text-amber-400" />;
      case 'MATCH_WIN':
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'DEPOSIT_BONUS':
        return <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />;
      case 'REFUND':
        return <RotateCcw className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#0F1422] border border-[#1F293D] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-purple-500 to-amber-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Notifications</h2>
              <p className="text-xs text-gray-400">Match updates, Room IDs & Payouts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#151C2C] text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-xs">No notifications yet.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.type === 'ROOM_OPEN' && onOpenRoomModal) {
                    onOpenRoomModal(n.matchId);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-[#151C2C] border-gray-800/80 text-gray-400'
                    : 'bg-[#182032] border-purple-500/40 text-white shadow-md shadow-purple-500/5'
                }`}
              >
                <div className="p-2 rounded-xl bg-[#0F1422] border border-gray-800 shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-bold text-xs text-white truncate">{n.title}</h4>
                    <span className="text-[10px] text-gray-500 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-snug">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
