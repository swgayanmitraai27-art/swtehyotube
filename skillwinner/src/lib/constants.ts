import { Match, MatchMode, MatchPrizeDistribution } from '../types';

/**
 * Calculates Dual-Wallet deduction:
 * Rule: User can pay a MAX of 10% of match entry fee from Bonus Wallet.
 * Remaining (min 90%) is deducted from Real Wallet.
 */
export function calculateWalletDeduction(entryFee: number, realBalance: number, bonusBalance: number) {
  const maxBonusAllowed = Math.round(entryFee * 0.1); // 10% max from bonus
  const bonusToDeduct = Math.min(bonusBalance, maxBonusAllowed);
  const realToDeduct = entryFee - bonusToDeduct;

  const canAfford = realBalance >= realToDeduct;

  return {
    entryFee,
    bonusDeducted: bonusToDeduct,
    realDeducted: realToDeduct,
    canAfford,
    shortfall: canAfford ? 0 : realToDeduct - realBalance,
  };
}

/**
 * 70/30 Profit & Prize Split Calculation Matrix
 */
export function calculateMatchFinancials(
  entryFee: number,
  totalPlayers: number,
  mode: MatchMode
): MatchPrizeDistribution {
  const totalCollection = entryFee * totalPlayers;
  const gatewayFee = Math.round(totalCollection * 0.02); // 2% Razorpay fee
  const netCollection = totalCollection - gatewayFee;

  const platformProfit = Math.round(netCollection * 0.3); // 30% Platform Profit
  const totalPrizePool = netCollection - platformProfit; // 70% Prize Pool

  let perKill = 0;
  let rank1: number | string = 0;
  let rank2 = 0;
  let rank3 = 0;
  let rank4_10 = 0;
  let physicalPrize = '';

  if (mode === 'SOLO_RANK_KILL') {
    if (entryFee <= 20) {
      perKill = 5;
      rank1 = 150;
      rank2 = 100;
      rank3 = 50;
    } else if (entryFee <= 50) {
      perKill = 10;
      rank1 = 450;
      rank2 = 250;
      rank3 = 150;
    } else {
      perKill = 20;
      rank1 = 800;
      rank2 = 450;
      rank3 = 250;
    }
  } else if (mode === 'WEEKLY_GADGET') {
    // ₹300 Weekly Sunday Gadget Tournament (100-120 players)
    physicalPrize = 'Razer Gaming Headset (₹5,000) + ₹5,000 Cash';
    rank1 = '₹10,000 Value (Headphones + Cash)';
    rank2 = 5000;
    rank3 = 2500;
    rank4_10 = 500;
    perKill = 15;
  } else if (mode === 'MEGA_IPHONE') {
    // ₹500 Monthly Mega iPhone Tournament (250-300 players)
    physicalPrize = 'Brand New Apple iPhone 15 (₹65,000)';
    rank1 = 'Apple iPhone 15 (₹65,000)';
    rank2 = 8000;
    rank3 = 4000;
    rank4_10 = 1000;
    perKill = 25;
  } else if (mode === 'SQUAD_RANK') {
    if (entryFee <= 20) {
      rank1 = 300;
      rank2 = 160;
      rank3 = 100;
    } else if (entryFee <= 50) {
      rank1 = 800;
      rank2 = 400;
      rank3 = 200;
    } else {
      rank1 = 1500;
      rank2 = 800;
      rank3 = 444;
    }
  } else if (mode === 'CS_4V4' || mode === 'CS_2V2' || mode === 'LONE_WOLF_1V1') {
    rank1 = Math.round(totalPrizePool);
  } else {
    rank1 = Math.round(totalPrizePool * 0.6);
    rank2 = Math.round(totalPrizePool * 0.25);
    rank3 = Math.round(totalPrizePool * 0.15);
  }

  return {
    rank1,
    rank2,
    rank3,
    rank4_10,
    perKill,
    totalPrizePool,
    platformProfit,
    gatewayFee,
    physicalPrize,
  };
}

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match_solo_20_01',
    title: '🔥 Solo Rank + Per Kill Battle (₹5/Kill)',
    game: 'FREE_FIRE_MAX',
    mode: 'SOLO_RANK_KILL',
    map: 'Bermuda',
    entryFee: 20,
    perKill: 5,
    maxSlots: 40,
    filledSlots: 34,
    startTime: '08:30 PM Today',
    status: 'UPCOMING',
    minPlayersRequired: 25,
    rulesDescription: '• Solo Bermuda Survival • No Teaming • Gun Properties ON • Character Skill ON • Hacks/Scripts = Permanent Ban & Forfeit.',
    prizeDistribution: {
      rank1: 150,
      rank2: 100,
      rank3: 50,
      perKill: 5,
      totalPrizePool: 549,
      platformProfit: 235,
      gatewayFee: 16,
    },
  },
  {
    id: 'match_weekly_gadget_300',
    title: '🎧 Sunday Gadget Cup: Razer Gaming Headset + ₹5,000 Cash',
    game: 'FREE_FIRE_MAX',
    mode: 'WEEKLY_GADGET',
    map: 'Bermuda',
    entryFee: 300,
    perKill: 15,
    maxSlots: 120,
    filledSlots: 82,
    startTime: 'Every Sunday 08:00 PM',
    status: 'UPCOMING',
    minPlayersRequired: 100, // Developer Rule: 100 Players Threshold or 100% Auto-Refund
    isMegaMatch: true,
    megaPrizeName: 'Razer Kraken Gaming Headphone + ₹5,000 Cash',
    rulesDescription: '• Full Map Championship • Min 100 Players threshold for mega prize • Rank 1 gets Headset + Cash • Rank 2-10 get cash prizes • Auto-refund if under 100 players.',
    prizeDistribution: {
      rank1: 'Headset + ₹5,000 Cash (₹10k Value)',
      rank2: 5000,
      rank3: 2500,
      rank4_10: 500,
      perKill: 15,
      totalPrizePool: 24696,
      platformProfit: 10584,
      gatewayFee: 720,
      physicalPrize: 'Razer Kraken Gaming Headset',
    },
  },
  {
    id: 'match_mega_iphone_500',
    title: '📱 Grand Monthly Finale: Win Apple iPhone 15 (₹65,000)',
    game: 'FREE_FIRE_MAX',
    mode: 'MEGA_IPHONE',
    map: 'Bermuda',
    entryFee: 500,
    perKill: 25,
    maxSlots: 300,
    filledSlots: 188,
    startTime: 'Month-End Sunday 09:00 PM',
    status: 'UPCOMING',
    minPlayersRequired: 250, // Developer Rule: 250 Players Threshold or 100% Auto-Refund
    isMegaMatch: true,
    megaPrizeName: 'Apple iPhone 15 (128GB Black/Blue)',
    rulesDescription: '• Grand Monthly Finale • Rank 1: Brand New iPhone 15 (Delivered to Home) • Rank 2: ₹8,000 • Rank 3: ₹4,000 • Rank 4-10: ₹1,000 each • Threshold: 250 Players (100% auto refund if not reached).',
    prizeDistribution: {
      rank1: 'Apple iPhone 15 (₹65,000)',
      rank2: 8000,
      rank3: 4000,
      rank4_10: 1000,
      perKill: 25,
      totalPrizePool: 85750,
      platformProfit: 36750,
      gatewayFee: 2500,
      physicalPrize: 'Apple iPhone 15',
    },
  },
  {
    id: 'match_solo_50_02',
    title: '⚡ Solo Pro War (₹10/Kill + ₹450 Booyah)',
    game: 'FREE_FIRE_MAX',
    mode: 'SOLO_RANK_KILL',
    map: 'Purgatory',
    entryFee: 50,
    perKill: 10,
    maxSlots: 40,
    filledSlots: 22,
    startTime: '09:15 PM Today',
    status: 'UPCOMING',
    minPlayersRequired: 25,
    rulesDescription: '• Purgatory Solo • Top 3 Win Big + ₹10 per kill • No Grenade spam in final zone.',
    prizeDistribution: {
      rank1: 450,
      rank2: 250,
      rank3: 150,
      perKill: 10,
      totalPrizePool: 1372,
      platformProfit: 588,
      gatewayFee: 40,
    },
  },
  {
    id: 'match_cs_4v4_20',
    title: '⚔️ Clash Squad 4v4: Clan War (Winner Takes All)',
    game: 'FREE_FIRE_MAX',
    mode: 'CS_4V4',
    map: 'Bermuda',
    entryFee: 20,
    perKill: 0,
    maxSlots: 8,
    filledSlots: 6,
    startTime: '08:45 PM Today',
    status: 'UPCOMING',
    minPlayersRequired: 8,
    rulesDescription: '• 4v4 Head-to-Head • Gun Properties OFF • Limited Ammo YES • Winner team gets ₹112 (₹28 each).',
    prizeDistribution: {
      rank1: 112,
      perKill: 0,
      totalPrizePool: 112,
      platformProfit: 45,
      gatewayFee: 3,
    },
  },
  {
    id: 'match_1v1_20',
    title: '🥊 Lone Wolf 1v1 Ego Match (₹28 Winner)',
    game: 'FREE_FIRE_MAX',
    mode: 'LONE_WOLF_1V1',
    map: 'Iron Cage (1v1)',
    entryFee: 20,
    perKill: 0,
    maxSlots: 2,
    filledSlots: 1,
    startTime: 'Instant (When 2 Players Join)',
    status: 'UPCOMING',
    minPlayersRequired: 2,
    rulesDescription: '• 1v1 Ego Match • Headshot Only / All Guns • Best of 5 Rounds • Winner Takes ₹28.',
    prizeDistribution: {
      rank1: 28,
      perKill: 0,
      totalPrizePool: 28,
      platformProfit: 11,
      gatewayFee: 1,
    },
  },
];
