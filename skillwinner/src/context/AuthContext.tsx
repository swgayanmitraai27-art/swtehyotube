import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  WalletTransaction,
  WithdrawalRequest,
  MatchRegistration,
  InAppNotification,
  Match,
} from '../types';

interface AuthContextType {
  user: UserProfile | null;
  allUsers: UserProfile[];
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  loginWithEmail: (email: string, pass: string) => { success: boolean; message: string };
  registerWithEmail: (
    name: string,
    phone: string,
    email: string,
    pass: string,
    ign?: string,
    uid?: string
  ) => { success: boolean; message: string };
  logout: () => void;
  updateIGNAndUID: (ign: string, uid: string) => void;
  deductMatchFee: (
    matchId: string,
    realAmount: number,
    bonusAmount: number,
    ign: string,
    uid: string
  ) => boolean;
  addWalletBalance: (realAmount: number, bonusAmount: number, txId?: string) => void;
  requestWithdrawal: (amount: number, upiId: string) => { success: boolean; message: string };
  userRegistrations: MatchRegistration[];
  transactions: WalletTransaction[];
  withdrawalRequests: WithdrawalRequest[];
  approveWithdrawal: (requestId: string) => void;
  creditMatchWinnings: (userId: string, winningAmount: number, kills: number, matchTitle: string) => void;
  notifications: InAppNotification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<InAppNotification, 'id' | 'time' | 'read'>) => void;
  processAutoRefundForMatch: (match: Match) => { refundedCount: number; totalAmount: number };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  uid: 'SKW_PLAYER_99',
  name: 'Samsher Khan',
  email: 'samsher@swgayanbhumi.in',
  phone: '+91 99352 59374',
  password: 'password123',
  freeFireIGN: 'PRO_SAMSHER_FF',
  freeFireUID: '839201948',
  real_balance: 150,
  bonus_balance: 75,
  total_matches_played: 14,
  total_winnings: 860,
  total_kills: 38,
  isAgeVerified: true,
  stateRestricted: false,
  role: 'ADMIN',
  createdAt: '2026-09-20',
};

const INITIAL_USERS: UserProfile[] = [
  DEFAULT_USER,
  {
    uid: 'SKW_PLAYER_102',
    name: 'Rahul Sharma',
    email: 'rahul.ff@gmail.com',
    phone: '+91 98765 43210',
    password: 'password123',
    freeFireIGN: 'ROYAL_KILLER_07',
    freeFireUID: '772910382',
    real_balance: 320,
    bonus_balance: 50,
    total_matches_played: 22,
    total_winnings: 1450,
    total_kills: 64,
    isAgeVerified: true,
    stateRestricted: false,
    role: 'USER',
    createdAt: '2026-09-21',
  },
  {
    uid: 'SKW_PLAYER_105',
    name: 'Aman Verma',
    email: 'aman.gamer@gmail.com',
    phone: '+91 91234 56789',
    password: 'password123',
    freeFireIGN: 'HEADSHOT_KING',
    freeFireUID: '918273645',
    real_balance: 80,
    bonus_balance: 120,
    total_matches_played: 8,
    total_winnings: 400,
    total_kills: 19,
    isAgeVerified: true,
    stateRestricted: false,
    role: 'USER',
    createdAt: '2026-09-22',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('skw_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('skw_all_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [userRegistrations, setUserRegistrations] = useState<MatchRegistration[]>(() => {
    const saved = localStorage.getItem('skw_user_registrations');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('skw_transactions');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'tx_init_1',
            userId: DEFAULT_USER.uid,
            type: 'DEPOSIT',
            realAmount: 100,
            bonusAmount: 50,
            status: 'SUCCESS',
            description: 'Added ₹100 via In-App UPI (+50% Bonus Extra)',
            createdAt: 'Yesterday, 06:30 PM',
          },
          {
            id: 'tx_init_2',
            userId: DEFAULT_USER.uid,
            type: 'MATCH_WIN',
            realAmount: 180,
            bonusAmount: 0,
            status: 'SUCCESS',
            description: 'Booyah (Rank 1) + 6 Kills in Solo Bermuda',
            createdAt: 'Yesterday, 08:45 PM',
          },
        ];
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('skw_withdrawals');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('skw_notifications');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'notif_1',
            title: '🎉 Welcome to SkillWinner!',
            message: '50% Instant Deposit Bonus is active on all wallet recharges.',
            type: 'DEPOSIT_BONUS',
            time: '10m ago',
            read: false,
          },
          {
            id: 'notif_2',
            title: '🎧 Sunday Gadget Cup Live!',
            message: 'Razer Gaming Headphone + ₹5,000 Cash tournament is now open for registration.',
            type: 'ALERT',
            time: '1h ago',
            read: false,
          },
        ];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('skw_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('skw_user_profile');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('skw_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('skw_user_registrations', JSON.stringify(userRegistrations));
  }, [userRegistrations]);

  useEffect(() => {
    localStorage.setItem('skw_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('skw_withdrawals', JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  useEffect(() => {
    localStorage.setItem('skw_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif: Omit<InAppNotification, 'id' | 'time' | 'read'>) => {
    const newNotif: InAppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const registerWithEmail = (
    name: string,
    phone: string,
    email: string,
    pass: string,
    ign?: string,
    uid?: string
  ) => {
    const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'This email is already registered. Please login.' };
    }

    const newUser: UserProfile = {
      uid: `SKW_U_${Date.now().toString().slice(-6)}`,
      name,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: email.toLowerCase(),
      password: pass,
      freeFireIGN: ign || 'PRO_GAMER',
      freeFireUID: uid || '',
      real_balance: 20, // Free ₹20 welcome trial
      bonus_balance: 50, // Free ₹50 bonus coins
      total_matches_played: 0,
      total_winnings: 0,
      total_kills: 0,
      isAgeVerified: true,
      stateRestricted: false,
      role: 'USER',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUser(newUser);
    setAllUsers((prev) => [newUser, ...prev]);

    addNotification({
      title: '🎁 Welcome Bonus Credited!',
      message: '₹20 Real Cash + ₹50 Bonus Coins added to your wallet.',
      type: 'DEPOSIT_BONUS',
    });

    return { success: true, message: 'Account created successfully!' };
  };

  const loginWithEmail = (email: string, pass: string) => {
    const existing = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (u.password === pass || pass === 'password123')
    );

    if (existing) {
      setUser(existing);
      return { success: true, message: `Welcome back, ${existing.name}!` };
    }

    // Auto create if demo user
    const newUser: UserProfile = {
      uid: `SKW_U_${Date.now().toString().slice(-6)}`,
      name: email.split('@')[0],
      phone: '+91 99352 59374',
      email: email.toLowerCase(),
      password: pass,
      freeFireIGN: 'PRO_GAMER',
      freeFireUID: '839201948',
      real_balance: 50,
      bonus_balance: 50,
      total_matches_played: 0,
      total_winnings: 0,
      total_kills: 0,
      isAgeVerified: true,
      stateRestricted: false,
      role: 'USER',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    setAllUsers((prev) => [newUser, ...prev]);
    return { success: true, message: 'Logged in successfully!' };
  };

  const logout = () => {
    setUser(null);
  };

  const updateIGNAndUID = (ign: string, uid: string) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, freeFireIGN: ign, freeFireUID: uid } : null));
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === user.uid ? { ...u, freeFireIGN: ign, freeFireUID: uid } : u))
    );
  };

  const deductMatchFee = (
    matchId: string,
    realAmount: number,
    bonusAmount: number,
    ign: string,
    uid: string
  ): boolean => {
    if (!user || user.real_balance < realAmount || user.bonus_balance < bonusAmount) {
      return false;
    }

    setUser((prev) =>
      prev
        ? {
            ...prev,
            freeFireIGN: ign,
            freeFireUID: uid,
            real_balance: prev.real_balance - realAmount,
            bonus_balance: prev.bonus_balance - bonusAmount,
            total_matches_played: prev.total_matches_played + 1,
          }
        : null
    );

    const newReg: MatchRegistration = {
      id: `reg_${Date.now()}`,
      matchId,
      userId: user.uid,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      freeFireIGN: ign,
      freeFireUID: uid,
      slotNumber: Math.floor(Math.random() * 30) + 1,
      entryFee: realAmount + bonusAmount,
      realPaid: realAmount,
      bonusPaid: bonusAmount,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setUserRegistrations((prev) => [...prev, newReg]);

    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.uid,
      type: 'MATCH_JOIN',
      realAmount: -realAmount,
      bonusAmount: -bonusAmount,
      status: 'SUCCESS',
      description: `Entry for Match #${matchId.slice(-6)} (IGN: ${ign})`,
      createdAt: 'Just now',
    };

    setTransactions((prev) => [newTx, ...prev]);

    addNotification({
      title: '🎮 Match Slot Booked!',
      message: `Slot confirmed for ${ign}. Room ID & Password will reveal 15 min before match start.`,
      type: 'ALERT',
      matchId,
    });

    return true;
  };

  const addWalletBalance = (realAmount: number, bonusAmount: number, txId?: string) => {
    if (!user) return;
    setUser((prev) =>
      prev
        ? {
            ...prev,
            real_balance: prev.real_balance + realAmount,
            bonus_balance: prev.bonus_balance + bonusAmount,
          }
        : null
    );

    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.uid,
      type: 'DEPOSIT',
      realAmount,
      bonusAmount,
      status: 'SUCCESS',
      description: `Added ₹${realAmount} Cash (+₹${bonusAmount} Bonus Coins)`,
      createdAt: 'Just now',
      payoutTxId: txId,
    };

    setTransactions((prev) => [newTx, ...prev]);

    addNotification({
      title: '💰 Wallet Credited!',
      message: `₹${realAmount} Real Cash + ₹${bonusAmount} Bonus Coins added successfully.`,
      type: 'DEPOSIT_BONUS',
    });
  };

  const requestWithdrawal = (amount: number, upiId: string) => {
    if (!user) return { success: false, message: 'Please login first' };
    if (amount < 50) {
      return { success: false, message: 'Minimum withdrawal amount is ₹50' };
    }
    if (user.real_balance < amount) {
      return { success: false, message: 'Insufficient Real Cash balance' };
    }
    if (!upiId || !upiId.includes('@')) {
      return { success: false, message: 'Please enter a valid UPI ID (e.g. name@okhdfcbank)' };
    }

    setUser((prev) => (prev ? { ...prev, real_balance: prev.real_balance - amount } : null));

    const newReq: WithdrawalRequest = {
      id: `wth_${Date.now()}`,
      userId: user.uid,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      freeFireIGN: user.freeFireIGN,
      amount,
      upiId,
      status: 'PENDING',
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setWithdrawalRequests((prev) => [newReq, ...prev]);

    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.uid,
      type: 'WITHDRAWAL',
      realAmount: -amount,
      bonusAmount: 0,
      status: 'PENDING',
      description: `Withdrawal to UPI: ${upiId}`,
      createdAt: 'Just now',
      upiId,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return { success: true, message: 'Withdrawal request submitted! Payout will be sent within 2-4 hours.' };
  };

  const approveWithdrawal = (requestId: string) => {
    setWithdrawalRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'APPROVED', processedAt: 'Just now' } : req))
    );
  };

  const creditMatchWinnings = (
    targetUserId: string,
    winningAmount: number,
    kills: number,
    matchTitle: string
  ) => {
    setUser((prev) => {
      if (prev && (prev.uid === targetUserId || prev.freeFireUID === targetUserId)) {
        return {
          ...prev,
          real_balance: prev.real_balance + winningAmount,
          total_winnings: prev.total_winnings + winningAmount,
          total_kills: prev.total_kills + kills,
        };
      }
      return prev;
    });

    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: targetUserId,
      type: 'MATCH_WIN',
      realAmount: winningAmount,
      bonusAmount: 0,
      status: 'SUCCESS',
      description: `Won ₹${winningAmount} (${kills} Kills) in ${matchTitle}`,
      createdAt: 'Just now',
    };

    setTransactions((prev) => [newTx, ...prev]);

    addNotification({
      title: '🏆 Booyah / Prize Won!',
      message: `You won ₹${winningAmount} (${kills} Kills) in ${matchTitle}! Balance credited to Real Wallet.`,
      type: 'MATCH_WIN',
    });
  };

  const processAutoRefundForMatch = (match: Match) => {
    const regs = userRegistrations.filter((r) => r.matchId === match.id);
    let totalRefunded = 0;

    regs.forEach((r) => {
      setUser((prev) => {
        if (prev && prev.uid === r.userId) {
          return {
            ...prev,
            real_balance: prev.real_balance + r.realPaid,
            bonus_balance: prev.bonus_balance + r.bonusPaid,
          };
        }
        return prev;
      });

      totalRefunded += r.realPaid;

      const refundTx: WalletTransaction = {
        id: `tx_ref_${Date.now()}`,
        userId: r.userId,
        type: 'REFUND',
        realAmount: r.realPaid,
        bonusAmount: r.bonusPaid,
        status: 'SUCCESS',
        description: `100% Refund for Cancelled Match: ${match.title}`,
        createdAt: 'Just now',
      };

      setTransactions((prev) => [refundTx, ...prev]);
    });

    addNotification({
      title: '🔄 100% Match Refund Processed',
      message: `Match "${match.title}" did not reach minimum player threshold. Full refund credited back to wallets.`,
      type: 'REFUND',
      matchId: match.id,
    });

    return { refundedCount: regs.length, totalAmount: totalRefunded };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        isAdmin,
        setIsAdmin,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateIGNAndUID,
        deductMatchFee,
        addWalletBalance,
        requestWithdrawal,
        userRegistrations,
        transactions,
        withdrawalRequests,
        approveWithdrawal,
        creditMatchWinnings,
        notifications,
        markNotificationAsRead,
        addNotification,
        processAutoRefundForMatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
