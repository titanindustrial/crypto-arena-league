
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContestType } from "../types";
import { Calendar, Users, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { useContest } from "../contexts/ContestContext";

interface ContestCardProps {
  contest: ContestType;
  joined?: boolean;
}

export const ContestCard: React.FC<ContestCardProps> = ({ contest, joined = false }) => {
  const { isAuthenticated } = useAuth();
  const { joinContest, loading } = useContest();
  
  const statusColor = {
    upcoming: "bg-blue-500/20 text-blue-500 border-blue-500/50",
    active: "bg-green-500/20 text-crypto-green border-green-500/50",
    completed: "bg-gray-500/20 text-gray-400 border-gray-500/50",
  };
  
  const handleJoinContest = (e: React.MouseEvent) => {
    e.preventDefault();
    joinContest(contest.id);
  };

  return (
    <Link to={`/contest/${contest.id}`}>
      <Card className="h-full transition-all hover:border-primary hover:shadow-md hover:shadow-primary/10">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{contest.name}</CardTitle>
              <CardDescription className="mt-1">{contest.description}</CardDescription>
            </div>
            <Badge variant="outline" className={statusColor[contest.status]}>
              {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Starts: {formatDate(contest.startDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Ends: {formatDate(contest.endDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Initial: ${contest.initialBalance.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {contest.contestants} participants
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Allowed Cryptocurrencies</div>
            <div className="flex flex-wrap gap-1">
              {contest.allowedCryptos.map((crypto) => (
                <Badge key={crypto} variant="secondary" className="text-xs">
                  {crypto}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Entry: {contest.entryFee} points
          </div>
          {!joined && contest.status === "upcoming" && isAuthenticated && (
            <Button 
              size="sm" 
              onClick={handleJoinContest} 
              disabled={loading}
            >
              Join Contest
            </Button>
          )}
          {joined && (
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
              Joined
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};
