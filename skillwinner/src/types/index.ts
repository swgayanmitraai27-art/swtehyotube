export type MatchMode =
  | 'SOLO_RANK_KILL'
  | 'SQUAD_RANK'
  | 'CS_4V4'
  | 'CS_2V2'
  | 'LONE_WOLF_1V1'
  | 'WEEKLY_GADGET'
  | 'MEGA_IPHONE';

export type MatchStatus = 'UPCOMING' | 'ROOM_OPEN' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export interface MatchPrizeDistribution {
  rank1: number | string;
  rank2?: number;
  rank3?: number;
  rank4_10?: number;
  rank4_5?: number;
  perKill: number;
  totalPrizePool: number;
  platformProfit: number;
  gatewayFee: number;
  physicalPrize?: string;
}

export interface Match {
  id: string;
  title: string;
  game: 'FREE_FIRE' | 'FREE_FIRE_MAX';
  mode: MatchMode;
  map: 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'NexTerra' | 'Iron Cage (1v1)';
  entryFee: number;
  perKill: number;
  maxSlots: number;
  filledSlots: number;
  startTime: string;
  status: MatchStatus;
  roomId?: string;
  roomPassword?: string;
  minPlayersRequired: number;
  prizeDistribution: MatchPrizeDistribution;
  rulesDescription?: string;
  bannerImage?: string;
  isMegaMatch?: boolean;
  megaPrizeName?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  freeFireIGN?: string;
  freeFireUID?: string;
  real_balance: number;
  bonus_balance: number;
  total_matches_played: number;
  total_winnings: number;
  total_kills: number;
  isAgeVerified: boolean;
  stateRestricted: boolean;
  role?: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface MatchRegistration {
  id: string;
  matchId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  freeFireIGN: string;
  freeFireUID: string;
  slotNumber: number;
  entryFee: number;
  realPaid: number;
  bonusPaid: number;
  killsWon?: number;
  rankWon?: number;
  prizeWon?: number;
  joinedAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'MATCH_JOIN' | 'MATCH_WIN' | 'WITHDRAWAL' | 'REFUND' | 'BONUS_REWARD';
  realAmount: number;
  bonusAmount: number;
  status: 'SUCCESS' | 'PENDING' | 'REJECTED';
  description: string;
  createdAt: string;
  upiId?: string;
  payoutTxId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone: string;
  freeFireIGN?: string;
  amount: number;
  upiId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'ROOM_OPEN' | 'MATCH_WIN' | 'DEPOSIT_BONUS' | 'REFUND' | 'ALERT';
  matchId?: string;
  time: string;
  read: boolean;
}
