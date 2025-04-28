
import React, { createContext, useContext, useState, useEffect } from "react";
import { ContestType, Portfolio, LeaderboardEntry, Trade } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface ContestContextType {
  contests: ContestType[];
  userContests: ContestType[];
  currentContest: ContestType | null;
  leaderboard: LeaderboardEntry[];
  userPortfolio: Portfolio | null;
  trades: Trade[];
  loading: boolean;
  contestLoading: boolean;
  createContest: (contest: Omit<ContestType, "id" | "contestants" | "createdBy" | "creatorName">) => Promise<void>;
  joinContest: (contestId: string) => Promise<void>;
  fetchContest: (contestId: string) => Promise<void>;
  executeTrade: (trade: Omit<Trade, "id" | "timestamp">) => Promise<void>;
}

const ContestContext = createContext<ContestContextType>({
  contests: [],
  userContests: [],
  currentContest: null,
  leaderboard: [],
  userPortfolio: null,
  trades: [],
  loading: true,
  contestLoading: false,
  createContest: async () => {},
  joinContest: async () => {},
  fetchContest: async () => {},
  executeTrade: async () => {},
});

const mockContests: ContestType[] = [
  {
    id: "contest-1",
    name: "Crypto Masters Challenge",
    description: "Compete with the best traders in a 7-day trading challenge!",
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    initialBalance: 100000,
    contestants: 128,
    status: "upcoming",
    allowedCryptos: ["BTC", "ETH", "BNB", "SOL", "ADA", "XRP", "DOT", "DOGE"],
    createdBy: "admin-1",
    creatorName: "CryptoArena Official",
    entryFee: 50,
  },
  {
    id: "contest-2",
    name: "Bull Market Bonanza",
    description: "Test your skills in a bull market simulation with high volatility!",
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    initialBalance: 50000,
    contestants: 76,
    status: "active",
    allowedCryptos: ["BTC", "ETH", "BNB", "SOL"],
    createdBy: "admin-1",
    creatorName: "CryptoArena Official",
    entryFee: 25,
  },
  {
    id: "contest-3",
    name: "Altcoin Adventure",
    description: "Focus on altcoins only! No BTC or ETH allowed in this competition.",
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    initialBalance: 75000,
    contestants: 92,
    status: "completed",
    allowedCryptos: ["BNB", "SOL", "ADA", "XRP", "DOT", "DOGE"],
    createdBy: "admin-1",
    creatorName: "CryptoArena Official",
    entryFee: 30,
  }
];

const generateMockLeaderboard = (contestId: string, count: number): LeaderboardEntry[] => {
  const entries: LeaderboardEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    const profit = Math.random() * 40 - 10; // -10% to +30%
    entries.push({
      userId: `user-${i + 1}`,
      username: `trader${i + 1}`,
      profilePicture: i % 5 === 0 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}` : undefined,
      rank: i + 1,
      portfolioValue: 100000 * (1 + profit / 100),
      profitLossPercentage: profit,
      trades: Math.floor(Math.random() * 50) + 5,
    });
  }
  
  // Sort by portfolio value
  return entries.sort((a, b) => b.portfolioValue - a.portfolioValue);
};

export const ContestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [contests, setContests] = useState<ContestType[]>([]);
  const [userContests, setUserContests] = useState<ContestType[]>([]);
  const [currentContest, setCurrentContest] = useState<ContestType | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPortfolio, setUserPortfolio] = useState<Portfolio | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [contestLoading, setContestLoading] = useState(false);

  const fetchContests = async () => {
    setLoading(true);
    
    // Mock API call - this would be a real fetch in production
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setContests(mockContests);
    
    // Filter for user contests if user is logged in
    if (user) {
      // Randomly assign some contests to the user for demo purposes
      const randomUserContests = mockContests
        .filter(() => Math.random() > 0.3) // Randomly select ~70% of contests
        .map(contest => ({
          ...contest,
          contestants: contest.contestants + 1, // Add the user
        }));
        
      setUserContests(randomUserContests);
    }
    
    setLoading(false);
  };

  const fetchContest = async (contestId: string) => {
    setContestLoading(true);
    
    // Mock API call - this would be a real fetch in production
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const contest = mockContests.find(c => c.id === contestId);
    
    if (contest) {
      setCurrentContest(contest);
      
      // Generate mock leaderboard
      const mockLeaderboard = generateMockLeaderboard(contestId, contest.contestants);
      
      // Insert user into leaderboard if logged in
      if (user) {
        const userRank = Math.floor(Math.random() * (contest.contestants / 2)) + 1;
        const userProfit = Math.random() * 25 - 5; // -5% to +20%
        
        const userEntry: LeaderboardEntry = {
          userId: user.id,
          username: user.username,
          profilePicture: user.profilePicture,
          rank: userRank,
          portfolioValue: contest.initialBalance * (1 + userProfit / 100),
          profitLossPercentage: userProfit,
          trades: Math.floor(Math.random() * 30) + 3,
        };
        
        // Create a new array with user inserted at the appropriate rank
        const updatedLeaderboard = [...mockLeaderboard];
        updatedLeaderboard.splice(userRank - 1, 0, userEntry);
        
        // Re-adjust ranks
        updatedLeaderboard.forEach((entry, idx) => {
          entry.rank = idx + 1;
        });
        
        setLeaderboard(updatedLeaderboard);
        
        // Create mock portfolio
        const mockPortfolio: Portfolio = {
          contestId,
          userId: user.id,
          virtualBalance: contest.initialBalance * 0.4,
          holdings: {
            BTC: {
              quantity: 0.32,
              averageBuyPrice: 61200,
            },
            ETH: {
              quantity: 4.5,
              averageBuyPrice: 3400,
            },
            SOL: {
              quantity: 25,
              averageBuyPrice: 142.5,
            },
          },
          totalValue: contest.initialBalance * (1 + userProfit / 100),
          profitLoss: contest.initialBalance * userProfit / 100,
          profitLossPercentage: userProfit,
        };
        
        setUserPortfolio(mockPortfolio);
        
        // Generate mock trades
        const mockTrades: Trade[] = [];
        const tradeCount = userEntry.trades;
        
        for (let i = 0; i < tradeCount; i++) {
          const isBuy = Math.random() > 0.4;
          const cryptoIndex = Math.floor(Math.random() * contest.allowedCryptos.length);
          const cryptoSymbol = contest.allowedCryptos[cryptoIndex];
          
          let quantity, price;
          
          if (cryptoSymbol === "BTC") {
            quantity = Math.random() * 0.5;
            price = 60000 + Math.random() * 5000;
          } else if (cryptoSymbol === "ETH") {
            quantity = Math.random() * 5;
            price = 3000 + Math.random() * 1000;
          } else {
            quantity = Math.random() * 50;
            price = 50 + Math.random() * 200;
          }
          
          // Round quantity to reasonable decimal places
          quantity = Number(quantity.toFixed(4));
          
          const total = quantity * price;
          
          mockTrades.push({
            id: `trade-${contestId}-${i}`,
            userId: user.id,
            contestId,
            cryptoSymbol,
            type: isBuy ? "buy" : "sell",
            quantity,
            price,
            total,
            timestamp: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
        
        // Sort trades by timestamp (newest first)
        mockTrades.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setTrades(mockTrades);
      } else {
        setLeaderboard(mockLeaderboard);
        setUserPortfolio(null);
        setTrades([]);
      }
    } else {
      toast.error("Contest not found");
    }
    
    setContestLoading(false);
  };

  const createContest = async (contestData: Omit<ContestType, "id" | "contestants" | "createdBy" | "creatorName">) => {
    if (!user) {
      toast.error("You must be logged in to create a contest");
      return;
    }
    
    setLoading(true);
    
    // Mock API call - this would be a real fetch in production
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newContest: ContestType = {
      ...contestData,
      id: `contest-${Date.now()}`,
      contestants: 1,
      createdBy: user.id,
      creatorName: user.username,
    };
    
    setContests([newContest, ...contests]);
    setUserContests([newContest, ...userContests]);
    
    setLoading(false);
    toast.success("Contest created successfully!");
  };

  const joinContest = async (contestId: string) => {
    if (!user) {
      toast.error("You must be logged in to join a contest");
      return;
    }
    
    setLoading(true);
    
    // Mock API call - this would be a real fetch in production
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if contest exists
    const contest = contests.find(c => c.id === contestId);
    
    if (!contest) {
      setLoading(false);
      toast.error("Contest not found");
      return;
    }
    
    // Check if user already joined
    const alreadyJoined = userContests.some(c => c.id === contestId);
    
    if (alreadyJoined) {
      setLoading(false);
      toast.error("You have already joined this contest");
      return;
    }
    
    // Update contest
    const updatedContest = {
      ...contest,
      contestants: contest.contestants + 1,
    };
    
    // Update contests list
    setContests(contests.map(c => c.id === contestId ? updatedContest : c));
    
    // Add to user contests
    setUserContests([...userContests, updatedContest]);
    
    setLoading(false);
    toast.success("Successfully joined the contest!");
  };

  const executeTrade = async (tradeData: Omit<Trade, "id" | "timestamp">) => {
    if (!user) {
      toast.error("You must be logged in to execute trades");
      return;
    }
    
    if (!userPortfolio) {
      toast.error("Portfolio not found");
      return;
    }
    
    setLoading(true);
    
    // Mock API call - this would be a real fetch in production
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTrade: Trade = {
      ...tradeData,
      id: `trade-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    // Update trades list
    setTrades([newTrade, ...trades]);
    
    // Update portfolio (simplified logic for demo)
    const { cryptoSymbol, type, quantity, price, total } = newTrade;
    
    const updatedPortfolio = { ...userPortfolio };
    
    if (type === "buy") {
      // Check if user has enough balance
      if (updatedPortfolio.virtualBalance < total) {
        setLoading(false);
        toast.error("Insufficient balance");
        return;
      }
      
      // Update balance
      updatedPortfolio.virtualBalance -= total;
      
      // Update holdings
      if (!updatedPortfolio.holdings[cryptoSymbol]) {
        updatedPortfolio.holdings[cryptoSymbol] = {
          quantity,
          averageBuyPrice: price,
        };
      } else {
        const currentHolding = updatedPortfolio.holdings[cryptoSymbol];
        const totalValue = currentHolding.quantity * currentHolding.averageBuyPrice + total;
        const newQuantity = currentHolding.quantity + quantity;
        
        updatedPortfolio.holdings[cryptoSymbol] = {
          quantity: newQuantity,
          averageBuyPrice: totalValue / newQuantity,
        };
      }
    } else {
      // Check if user has enough of the crypto
      if (!updatedPortfolio.holdings[cryptoSymbol] || updatedPortfolio.holdings[cryptoSymbol].quantity < quantity) {
        setLoading(false);
        toast.error(`Insufficient ${cryptoSymbol} balance`);
        return;
      }
      
      // Update balance
      updatedPortfolio.virtualBalance += total;
      
      // Update holdings
      const currentHolding = updatedPortfolio.holdings[cryptoSymbol];
      const newQuantity = currentHolding.quantity - quantity;
      
      if (newQuantity <= 0) {
        delete updatedPortfolio.holdings[cryptoSymbol];
      } else {
        updatedPortfolio.holdings[cryptoSymbol] = {
          ...currentHolding,
          quantity: newQuantity,
        };
      }
    }
    
    // Simplified portfolio value calculation
    // In a real app, this would use current market prices for each asset
    const profitChange = (Math.random() * 2 - 0.5) * (type === "buy" ? 1 : -1);
    updatedPortfolio.profitLoss += profitChange;
    updatedPortfolio.profitLossPercentage = (updatedPortfolio.profitLoss / currentContest!.initialBalance) * 100;
    updatedPortfolio.totalValue = currentContest!.initialBalance + updatedPortfolio.profitLoss;
    
    setUserPortfolio(updatedPortfolio);
    
    // Update user in leaderboard
    const updatedLeaderboard = [...leaderboard];
    const userIndex = updatedLeaderboard.findIndex(entry => entry.userId === user.id);
    
    if (userIndex !== -1) {
      updatedLeaderboard[userIndex] = {
        ...updatedLeaderboard[userIndex],
        portfolioValue: updatedPortfolio.totalValue,
        profitLossPercentage: updatedPortfolio.profitLossPercentage,
        trades: updatedLeaderboard[userIndex].trades + 1,
      };
      
      // Re-sort leaderboard by portfolio value
      updatedLeaderboard.sort((a, b) => b.portfolioValue - a.portfolioValue);
      
      // Re-adjust ranks
      updatedLeaderboard.forEach((entry, idx) => {
        entry.rank = idx + 1;
      });
      
      setLeaderboard(updatedLeaderboard);
    }
    
    setLoading(false);
    toast.success(`Successfully ${type === "buy" ? "bought" : "sold"} ${quantity} ${cryptoSymbol}`);
  };

  useEffect(() => {
    fetchContests();
  }, [user?.id]);

  return (
    <ContestContext.Provider
      value={{
        contests,
        userContests,
        currentContest,
        leaderboard,
        userPortfolio,
        trades,
        loading,
        contestLoading,
        createContest,
        joinContest,
        fetchContest,
        executeTrade,
      }}
    >
      {children}
    </ContestContext.Provider>
  );
};

export const useContest = () => useContext(ContestContext);
