import React, { useState } from 'react';
import { X, Mail, Lock, Phone, User, ShieldCheck, AlertCircle, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, registerWithEmail } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ign, setIgn] = useState('');
  const [uid, setUid] = useState('');
  const [isAgeChecked, setIsAgeChecked] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    if (mode === 'SIGNUP') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }

      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number for UPI payouts');
        return;
      }

      if (!isAgeChecked) {
        setErrorMsg('You must be 18+ and not a resident of restricted states to play');
        return;
      }

      const res = registerWithEmail(name.trim(), phone.trim(), email.trim(), password, ign.trim(), uid.trim());
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => onClose(), 1000);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = loginWithEmail(email.trim(), password);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => onClose(), 1000);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#0F1422] border border-[#1F293D] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-400" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">
                {mode === 'SIGNUP' ? 'Create Gamer Account' : 'Welcome Back Gamer'}
              </h2>
              <p className="text-xs text-gray-400">
                {mode === 'SIGNUP' ? 'Get ₹20 Trial + ₹50 Bonus Free' : 'Login with Email & Password'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#151C2C] text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="grid grid-cols-2 gap-1 bg-[#151C2C] p-1 rounded-2xl border border-gray-800 mb-4 text-xs font-bold">
          <button
            onClick={() => {
              setMode('SIGNUP');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition ${
              mode === 'SIGNUP' ? 'bg-red-500 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            New Player (Sign Up)
          </button>
          <button
            onClick={() => {
              setMode('LOGIN');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl transition ${
              mode === 'LOGIN' ? 'bg-red-500 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Existing (Login)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3 overflow-y-auto flex-1 pr-1">
          {mode === 'SIGNUP' && (
            <>
              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Samsher Khan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
                  Mobile Number (For UPI Payouts) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9935259374"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
              Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. gamer@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          {mode === 'SIGNUP' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Free Fire IGN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OP_GAMER"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Free Fire UID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 839201948"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    className="w-full bg-[#151C2C] border border-gray-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono outline-none"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 bg-[#151C2C] p-2.5 rounded-xl border border-gray-800 cursor-pointer text-[10px] text-gray-300">
                <input
                  type="checkbox"
                  checked={isAgeChecked}
                  onChange={(e) => setIsAgeChecked(e.target.checked)}
                  className="mt-0.5 rounded text-red-600 focus:ring-0 bg-[#0F1422] border-gray-700"
                />
                <span>
                  I confirm that I am <b>18+</b> and not from restricted states (AP, Telangana, Assam, Odisha, Sikkim, Nagaland).
                </span>
              </label>
            </>
          )}

          {errorMsg && (
            <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black py-3 px-4 rounded-xl transition text-xs uppercase shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>{mode === 'SIGNUP' ? 'Create Account & Claim ₹70 Bonus' : 'Login to SkillWinner'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
