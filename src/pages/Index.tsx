
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCrypto } from "../contexts/CryptoContext";
import { useContest } from "../contexts/ContestContext";
import { CryptoTable } from "../components/CryptoTable";
import { ContestCard } from "../components/ContestCard";
import { Layout } from "../components/Layout";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { cryptos, loading: cryptosLoading } = useCrypto();
  const { contests, userContests, loading: contestsLoading } = useContest();
  
  const upcomingContests = contests.filter(contest => contest.status === "upcoming");
  const activeContests = contests.filter(contest => contest.status === "active");
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text animate-glow">
            <span className="text-primary">Crypto</span>Arena League
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            The ultimate fantasy crypto trading platform where you can compete, learn, and win without risking real money.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link to="/contests">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Contests
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign Up for Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Featured Contests */}
      <section className="py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Contests</h2>
          <Link to="/contests" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        
        {contestsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="h-64 rounded-lg bg-secondary animate-pulse-slow" />
            ))}
          </div>
        ) : (
          <>
            {activeContests.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-4">Active Contests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeContests.slice(0, 3).map((contest) => (
                    <ContestCard 
                      key={contest.id} 
                      contest={contest} 
                      joined={userContests.some(c => c.id === contest.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {upcomingContests.length > 0 && (
              <div>
                <h3 className="text-xl font-medium mb-4">Upcoming Contests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingContests.slice(0, 3).map((contest) => (
                    <ContestCard 
                      key={contest.id} 
                      contest={contest} 
                      joined={userContests.some(c => c.id === contest.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activeContests.length === 0 && upcomingContests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No contests available at the moment.</p>
              </div>
            )}
          </>
        )}
      </section>
      
      {/* Live Market Data */}
      <section className="py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Live Market Data</h2>
        </div>
        
        {cryptosLoading ? (
          <div className="h-64 rounded-lg bg-secondary animate-pulse-slow" />
        ) : (
          <CryptoTable cryptos={cryptos} />
        )}
      </section>
      
      {/* How It Works */}
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 crypto-card">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 text-primary mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Join a Contest</h3>
            <p className="text-muted-foreground">
              Sign up and enter a trading contest with virtual funds. No real money at risk.
            </p>
          </div>
          
          <div className="text-center p-6 crypto-card">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 text-primary mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Trade Crypto</h3>
            <p className="text-muted-foreground">
              Buy and sell cryptocurrencies at real-time market prices to build your portfolio.
            </p>
          </div>
          
          <div className="text-center p-6 crypto-card">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 text-primary mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-medium mb-2">Win Prizes</h3>
            <p className="text-muted-foreground">
              Compete for the top spots on the leaderboard and earn points and rewards.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Test Your Trading Skills?</h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join the CryptoArena League today and compete in risk-free trading contests.
          </p>
          {isAuthenticated ? (
            <Link to="/contests">
              <Button size="lg">
                Browse All Contests
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button size="lg">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
