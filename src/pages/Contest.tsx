
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContest } from "../contexts/ContestContext";
import { useCrypto } from "../contexts/CryptoContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LeaderboardTable } from "../components/LeaderboardTable";
import { CryptoTable } from "../components/CryptoTable";
import { PortfolioSummary } from "../components/PortfolioSummary";
import { PortfolioHoldings } from "../components/PortfolioHoldings";
import { TradeForm } from "../components/TradeForm";
import { TradeHistory } from "../components/TradeHistory";
import { Layout } from "../components/Layout";
import { formatDate, calculateTimeRemaining, calculateTimeElapsed } from "../lib/utils";
import { 
  Trophy, 
  Calendar, 
  Clock,
  Users,
  Coins,
  ListOrdered,
  Briefcase,
  LineChart,
  ArrowRightLeft,
} from "lucide-react";

const Contest = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const { currentContest, fetchContest, leaderboard, userPortfolio, trades, contestLoading } = useContest();
  const { cryptos } = useCrypto();
  const { isAuthenticated } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });
  const [activeTab, setActiveTab] = useState("leaderboard");
  
  useEffect(() => {
    if (contestId) {
      fetchContest(contestId);
    }
  }, [contestId]);
  
  useEffect(() => {
    if (currentContest?.status === "upcoming" || currentContest?.status === "active") {
      const targetDate = new Date(
        currentContest.status === "upcoming" ? currentContest.startDate : currentContest.endDate
      );
      
      const updateTimeRemaining = () => {
        setTimeRemaining(calculateTimeRemaining(targetDate.toISOString()));
      };
      
      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [currentContest]);
  
  const statusColor = {
    upcoming: "bg-blue-500/20 text-blue-500 border-blue-500/50",
    active: "bg-green-500/20 text-crypto-green border-green-500/50",
    completed: "bg-gray-500/20 text-gray-400 border-gray-500/50",
  };
  
  const filteredCryptos = cryptos.filter(crypto => 
    currentContest?.allowedCryptos.includes(crypto.symbol)
  );
  
  if (contestLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="space-y-4 w-full max-w-xl text-center">
            <div className="h-12 w-48 mx-auto bg-secondary rounded animate-pulse-slow" />
            <div className="h-6 w-96 mx-auto bg-secondary rounded animate-pulse-slow" />
            <div className="h-64 bg-secondary rounded animate-pulse-slow" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!currentContest) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Contest Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The contest you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/contests')}>Back to Contests</Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const isUserParticipant = userPortfolio !== null;
  const contestEnded = currentContest.status === "completed";
  const contestActive = currentContest.status === "active";
  const contestUpcoming = currentContest.status === "upcoming";
  
  return (
    <Layout>
      <div className="pb-12">
        {/* Contest Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold">{currentContest.name}</h1>
                <Badge variant="outline" className={statusColor[currentContest.status]}>
                  {currentContest.status.charAt(0).toUpperCase() + currentContest.status.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {currentContest.description}
              </p>
            </div>
          </div>
        </header>
        
        {/* Contest Info */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Duration
              </CardDescription>
              <CardTitle className="text-base">
                {formatDate(currentContest.startDate)} - {formatDate(currentContest.endDate)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!contestEnded && (
                <p className="text-xs text-muted-foreground">
                  {contestUpcoming ? "Starts" : "Ends"} in: {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
                </p>
              )}
              {contestEnded && (
                <p className="text-xs text-muted-foreground">
                  Ended {calculateTimeElapsed(currentContest.endDate)}
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center">
                <Users className="h-4 w-4 mr-1" /> Participants
              </CardDescription>
              <CardTitle className="text-xl">
                {currentContest.contestants}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {isUserParticipant ? "You are participating" : "You are not participating"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center">
                <Coins className="h-4 w-4 mr-1" /> Initial Balance
              </CardDescription>
              <CardTitle className="text-xl">
                ${currentContest.initialBalance.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Virtual trading capital
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center">
                <Trophy className="h-4 w-4 mr-1" /> Entry Fee
              </CardDescription>
              <CardTitle className="text-xl">
                {currentContest.entryFee} points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Winner gets {currentContest.contestants * currentContest.entryFee * 0.8} points
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Contest Content */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="leaderboard" className="flex items-center">
              <ListOrdered className="h-4 w-4 mr-2" /> Leaderboard
            </TabsTrigger>
            {isUserParticipant && contestActive && (
              <TabsTrigger value="trade" className="flex items-center">
                <ArrowRightLeft className="h-4 w-4 mr-2" /> Trade
              </TabsTrigger>
            )}
            <TabsTrigger value="portfolio" className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2" /> Portfolio
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center">
              <LineChart className="h-4 w-4 mr-2" /> Market
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Contest Leaderboard
                </CardTitle>
                <CardDescription>
                  Top performing traders in this competition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeaderboardTable entries={leaderboard} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {isUserParticipant && contestActive && (
            <TabsContent value="trade" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <LineChart className="h-5 w-5 mr-2" />
                        Available Cryptocurrencies
                      </CardTitle>
                      <CardDescription>
                        Current market prices for tradable assets
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CryptoTable 
                        cryptos={filteredCryptos} 
                      />
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  {userPortfolio && (
                    <TradeForm 
                      allowedCryptos={currentContest.allowedCryptos}
                      cryptos={cryptos}
                      portfolio={userPortfolio}
                      contestId={currentContest.id}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="portfolio" className="space-y-4">
            {isUserParticipant && userPortfolio ? (
              <>
                <PortfolioSummary 
                  portfolio={userPortfolio} 
                  initialBalance={currentContest.initialBalance}
                />
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <PortfolioHoldings 
                      portfolio={userPortfolio} 
                      cryptos={cryptos}
                    />
                  </div>
                  
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Clock className="h-5 w-5 mr-2" />
                          Recent Trades
                        </CardTitle>
                        <CardDescription>
                          Your latest trading activities
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TradeHistory trades={trades.slice(0, 5)} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <Card className="py-12">
                <CardContent className="text-center">
                  <h3 className="text-xl font-medium mb-2">
                    {isAuthenticated ? 
                      "You're not participating in this contest" : 
                      "Sign in to join this contest"
                    }
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {isAuthenticated ? 
                      contestUpcoming ? 
                        "Join this contest to get started with trading" : 
                        "This contest is no longer accepting new participants" : 
                      "Create an account or sign in to participate"
                    }
                  </p>
                  {isAuthenticated ? (
                    contestUpcoming && (
                      <Button>Join Contest</Button>
                    )
                  ) : (
                    <Button onClick={() => navigate('/login')}>Sign In</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="market" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Market Data
                </CardTitle>
                <CardDescription>
                  Current prices and market data for cryptocurrencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CryptoTable cryptos={filteredCryptos} />
              </CardContent>
            </Card>
            
            {isUserParticipant && trades.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Trade History
                  </CardTitle>
                  <CardDescription>
                    Complete record of your trading activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TradeHistory trades={trades} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Contest;
