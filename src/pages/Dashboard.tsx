
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useContest } from "../contexts/ContestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ContestCard } from "../components/ContestCard";
import { Layout } from "../components/Layout";
import { Award, Calendar, Plus } from "lucide-react";
import { formatDate } from "../lib/utils";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { userContests, loading } = useContest();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const activeContests = userContests.filter(contest => contest.status === "active");
  const upcomingContests = userContests.filter(contest => contest.status === "upcoming");
  const completedContests = userContests.filter(contest => contest.status === "completed");

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="pb-12">
        {/* Dashboard Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
          <p className="text-muted-foreground">
            Manage your crypto contests and track your performance
          </p>
        </header>
        
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>My Contests</CardDescription>
              <CardTitle className="text-2xl">{userContests.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {activeContests.length} active, {upcomingContests.length} upcoming
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Available Points</CardDescription>
              <CardTitle className="text-2xl">{user.points}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Use points to join contests
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Best Performance</CardDescription>
              <CardTitle className="text-2xl text-crypto-green">+24.6%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                In "Bull Market Bonanza" contest
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Member Since</CardDescription>
              <CardTitle className="text-2xl">{formatDate(user.createdAt)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Active community member
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Create Contest CTA */}
        <Card className="mb-8 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">Create Your Own Contest</h3>
                <p className="text-muted-foreground">
                  Set your own rules and invite friends to compete
                </p>
              </div>
              <Link to="/create-contest">
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Create Contest
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Active Contests */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Award className="h-6 w-6 mr-2 text-crypto-gold" />
              Active Contests
            </h2>
            {activeContests.length > 0 && (
              <Link to="/contests" className="text-primary hover:underline">
                View All
              </Link>
            )}
          </div>
          
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="h-64 rounded-lg bg-secondary animate-pulse-slow" />
              ))}
            </div>
          ) : activeContests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeContests.map(contest => (
                <ContestCard key={contest.id} contest={contest} joined={true} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  You don't have any active contests
                </p>
                <Link to="/contests">
                  <Button>Browse Contests</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
        
        {/* Upcoming Contests */}
        {upcomingContests.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                Upcoming Contests
              </h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingContests.map(contest => (
                <ContestCard key={contest.id} contest={contest} joined={true} />
              ))}
            </div>
          </section>
        )}
        
        {/* Completed Contests */}
        {completedContests.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Completed Contests</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedContests.map(contest => (
                <ContestCard key={contest.id} contest={contest} joined={true} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
