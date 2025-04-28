
import React, { useState } from "react";
import { useContest } from "../contexts/ContestContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContestCard } from "../components/ContestCard";
import { Layout } from "../components/Layout";
import { Link } from "react-router-dom";
import { Filter, Search, Plus } from "lucide-react";

type ContestStatus = "all" | "upcoming" | "active" | "completed";

const Contests = () => {
  const { contests, userContests, loading } = useContest();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContestStatus>("all");

  // Filter contests based on search and status
  const filteredContests = contests.filter(contest => {
    const matchesSearch = contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : contest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="pb-12">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Trading Contests</h1>
            <p className="text-muted-foreground">
              Join competitive trading contests with virtual crypto assets
            </p>
          </div>
          {isAuthenticated && (
            <Link to="/create-contest">
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Create Contest
              </Button>
            </Link>
          )}
        </header>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contests..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <Select 
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as ContestStatus)}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contests</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Contest Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="h-64 rounded-lg bg-secondary animate-pulse-slow" />
            ))}
          </div>
        ) : filteredContests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map(contest => (
              <ContestCard 
                key={contest.id} 
                contest={contest} 
                joined={userContests.some(c => c.id === contest.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No contests found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Try different search terms or filters" : "There are no contests available at the moment"}
            </p>
            {isAuthenticated && (
              <Link to="/create-contest">
                <Button>Create a Contest</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Contests;
