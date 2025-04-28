
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Portfolio } from "../types";
import { ArrowUp, ArrowDown, Wallet, LineChart, History } from "lucide-react";
import { formatCurrency } from "../lib/utils";

interface PortfolioSummaryProps {
  portfolio: Portfolio;
  initialBalance: number;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ 
  portfolio, 
  initialBalance 
}) => {
  const isProfitable = portfolio.profitLossPercentage >= 0;
  const profitLossClass = isProfitable ? "text-crypto-green" : "text-crypto-red";
  const ProfitLossIcon = isProfitable ? ArrowUp : ArrowDown;

  // Calculate portfolio allocation
  const holdingsValue = Object.entries(portfolio.holdings).reduce((total, [_, holding]) => {
    return total + (holding.quantity * holding.averageBuyPrice);
  }, 0);
  
  const cashPercentage = (portfolio.virtualBalance / portfolio.totalValue) * 100;
  const holdingsPercentage = (holdingsValue / portfolio.totalValue) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center">
            <Wallet className="h-4 w-4 mr-1" />
            Available Balance
          </CardDescription>
          <CardTitle className="text-2xl">
            {formatCurrency(portfolio.virtualBalance)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {cashPercentage.toFixed(1)}% of total portfolio
          </div>
          <Progress value={cashPercentage} className="mt-2 h-1" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center">
            <History className="h-4 w-4 mr-1" />
            Initial Investment
          </CardDescription>
          <CardTitle className="text-2xl">
            {formatCurrency(initialBalance)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Starting capital for trading
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center">
            <LineChart className="h-4 w-4 mr-1" />
            Current Value
          </CardDescription>
          <CardTitle className="text-2xl">
            {formatCurrency(portfolio.totalValue)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center text-sm ${profitLossClass}`}>
            <ProfitLossIcon className="h-4 w-4 mr-1" />
            <span className="font-medium">
              {isProfitable ? "+" : ""}
              {portfolio.profitLossPercentage.toFixed(2)}% ({formatCurrency(portfolio.profitLoss)})
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
