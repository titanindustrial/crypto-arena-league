
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LeaderboardEntry } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { Trophy, ArrowUp, ArrowDown } from "lucide-react";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  const { user } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Trader</TableHead>
              <TableHead className="text-right">Portfolio Value</TableHead>
              <TableHead className="text-right">Profit/Loss</TableHead>
              <TableHead className="text-right hidden md:table-cell">Trades</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length > 0 ? (
              entries.map((entry) => {
                const isUser = user && entry.userId === user.id;
                const profitLossClass = entry.profitLossPercentage >= 0 ? "price-up" : "price-down";
                const profitLossIcon = entry.profitLossPercentage >= 0 ? 
                  <ArrowUp className="inline h-3 w-3 mr-1" /> : 
                  <ArrowDown className="inline h-3 w-3 mr-1" />;
                
                return (
                  <TableRow 
                    key={entry.userId} 
                    className={isUser ? "bg-primary/10" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        {entry.rank <= 3 ? (
                          <Trophy className={`h-4 w-4 mr-1 ${
                            entry.rank === 1 ? "text-yellow-500" : 
                            entry.rank === 2 ? "text-gray-400" : 
                            "text-amber-700"
                          }`} />
                        ) : null}
                        {entry.rank}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={entry.profilePicture} />
                          <AvatarFallback>
                            {getInitials(entry.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {entry.username}
                            {isUser && (
                              <Badge variant="outline" className="ml-2 text-xs bg-primary/20 border-primary/50">
                                You
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${entry.portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className={`text-right ${profitLossClass}`}>
                      {profitLossIcon}
                      {Math.abs(entry.profitLossPercentage).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {entry.trades}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No leaderboard data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
