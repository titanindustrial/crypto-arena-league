
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  points: number;
  isAdmin: boolean;
  createdAt: string;
}

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  previousPrice: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export interface ContestType {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  contestants: number;
  status: "upcoming" | "active" | "completed";
  allowedCryptos: string[];
  createdBy: string;
  creatorName: string;
  entryFee: number;
}

export interface Trade {
  id: string;
  userId: string;
  contestId: string;
  cryptoSymbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
}

export interface Portfolio {
  contestId: string;
  userId: string;
  virtualBalance: number;
  holdings: {
    [symbol: string]: {
      quantity: number;
      averageBuyPrice: number;
    };
  };
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  profilePicture?: string;
  rank: number;
  portfolioValue: number;
  profitLossPercentage: number;
  trades: number;
}

export interface Bet {
  id: string;
  userId: string;
  targetUserId: string;
  contestId: string;
  amount: number;
  type: "will_win" | "will_lose";
  status: "active" | "won" | "lost";
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
