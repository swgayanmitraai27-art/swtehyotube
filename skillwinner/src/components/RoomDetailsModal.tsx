import React, { useState } from 'react';
import { X, Key, Lock, Copy, Check, Clock, ShieldAlert, Gamepad2, Info } from 'lucide-react';
import { Match } from '../types';
import { useAuth } from '../context/AuthContext';

interface RoomDetailsModalProps {
  match: Match | null;
  onClose: () => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ match, onClose }) => {
  const { userRegistrations } = useAuth();
  const [copiedField, setCopiedField] = useState<string>('');

  if (!match) return null;

  const registration = userRegistrations.find((r) => r.matchId === match.id);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const hasRoomDetails = Boolean(match.roomId && match.roomPassword);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#0F1422] border border-[#1F293D] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Custom Room Credentials</h2>
              <p className="text-xs text-gray-400">Free Fire Match Access</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#151C2C] text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player Slot Badge */}
        {registration && (
          <div className="bg-[#151C2C] rounded-2xl p-3 border border-gray-800 mb-4 flex items-center justify-between text-xs">
            <span className="text-gray-400">Registered In-Game Name:</span>
            <span className="font-bold text-amber-400 font-mono">{registration.freeFireIGN} ({registration.freeFireUID})</span>
          </div>
        )}

        {hasRoomDetails ? (
          <div className="space-y-3 mb-5">
            {/* Room ID */}
            <div className="bg-[#151C2C] border border-gray-800 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Custom Room ID</div>
                <div className="text-xl font-black font-mono text-white tracking-widest">{match.roomId}</div>
              </div>
              <button
                onClick={() => copyToClipboard(match.roomId || '', 'roomId')}
                className="px-3 py-2 bg-[#1A2234] hover:bg-[#20293D] border border-gray-700 rounded-xl text-xs font-bold text-gray-200 flex items-center gap-1.5 transition"
              >
                {copiedField === 'roomId' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'roomId' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Room Password */}
            <div className="bg-[#151C2C] border border-gray-800 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Room Password</div>
                <div className="text-xl font-black font-mono text-amber-400 tracking-widest">{match.roomPassword}</div>
              </div>
              <button
                onClick={() => copyToClipboard(match.roomPassword || '', 'roomPassword')}
                className="px-3 py-2 bg-[#1A2234] hover:bg-[#20293D] border border-gray-700 rounded-xl text-xs font-bold text-gray-200 flex items-center gap-1.5 transition"
              >
                {copiedField === 'roomPassword' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'roomPassword' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#151C2C] border border-amber-500/20 rounded-2xl p-5 text-center mb-5">
            <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-bounce" />
            <h4 className="text-sm font-bold text-white mb-1">Room ID will reveal soon</h4>
            <p className="text-xs text-gray-400">
              Custom Room ID & Password will be automatically published here <b className="text-amber-300">15 minutes</b> before match start ({match.startTime}).
            </p>
          </div>
        )}

        {/* Important Rules */}
        <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-3.5 mb-5 text-[11px] text-gray-300 space-y-1.5">
          <div className="font-bold text-red-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Fair Play & Tournament Rules:
          </div>
          <div>• Hacks, scripts, emulator bugs, or teaming up in Solo matches will lead to permanent ban & wallet forfeit.</div>
          <div>• Join Free Fire Custom Room with the exact same IGN ({registration?.freeFireIGN || 'Registered IGN'}).</div>
          <div>• Results & prizes are credited to your Real Wallet immediately after match screenshot verification.</div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full bg-[#151C2C] hover:bg-[#1A2234] border border-gray-700 text-white font-bold py-3 px-4 rounded-xl transition text-sm"
        >
          Got it, Close
        </button>
      </div>
    </div>
  );
};
