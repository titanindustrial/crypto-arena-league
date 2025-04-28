
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CryptoCurrency, Portfolio } from "../types";
import { Briefcase } from "lucide-react";
import { formatCurrency } from "../lib/utils";

interface PortfolioHoldingsProps {
  portfolio: Portfolio;
  cryptos: CryptoCurrency[];
}

export const PortfolioHoldings: React.FC<PortfolioHoldingsProps> = ({ 
  portfolio, 
  cryptos
}) => {
  const holdings = Object.entries(portfolio.holdings).map(([symbol, holding]) => {
    const crypto = cryptos.find(c => c.symbol === symbol);
    const currentPrice = crypto?.currentPrice || 0;
    const totalValue = holding.quantity * currentPrice;
    const profitLoss = totalValue - (holding.quantity * holding.averageBuyPrice);
    const profitLossPercentage = ((currentPrice - holding.averageBuyPrice) / holding.averageBuyPrice) * 100;
    
    return {
      symbol,
      name: crypto?.name || symbol,
      image: crypto?.image,
      quantity: holding.quantity,
      averagePrice: holding.averageBuyPrice,
      currentPrice,
      totalValue,
      profitLoss,
      profitLossPercentage,
    };
  }).sort((a, b) => b.totalValue - a.totalValue);
  
  const totalHoldingsValue = holdings.reduce((sum, holding) => sum + holding.totalValue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="h-5 w-5 mr-2" />
          Portfolio Holdings
        </CardTitle>
        <CardDescription>
          Your current crypto asset holdings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {holdings.length > 0 ? (
          <div>
            <div className="text-sm mb-4">
              <span>Total Holdings Value: </span>
              <span className="font-medium">{formatCurrency(totalHoldingsValue)}</span>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Avg. Price</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right hidden md:table-cell">P/L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings.map((holding) => {
                    const isProfitable = holding.profitLossPercentage >= 0;
                    const profitLossClass = isProfitable ? "price-up" : "price-down";
                    
                    return (
                      <TableRow key={holding.symbol}>
                        <TableCell>
                          <div className="flex items-center">
                            {holding.image && (
                              <img 
                                src={holding.image} 
                                alt={holding.name} 
                                className="h-5 w-5 mr-2" 
                              />
                            )}
                            <div>
                              <div className="font-medium">{holding.symbol}</div>
                              <div className="text-xs text-muted-foreground hidden md:block">
                                {holding.name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {holding.quantity.toFixed(8)}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          {formatCurrency(holding.averagePrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(holding.currentPrice)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(holding.totalValue)}
                        </TableCell>
                        <TableCell className={`text-right ${profitLossClass} hidden md:table-cell`}>
                          {isProfitable ? "+" : ""}
                          {holding.profitLossPercentage.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            You don't have any crypto holdings yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};
