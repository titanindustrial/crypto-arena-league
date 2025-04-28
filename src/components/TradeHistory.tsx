
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trade } from "../types";
import { formatDate, formatTime, formatCurrency } from "../lib/utils";

interface TradeHistoryProps {
  trades: Trade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Crypto</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.length > 0 ? (
            trades.map((trade) => {
              const isBuy = trade.type === "buy";
              const typeColor = isBuy ? "price-up" : "price-down";
              const date = new Date(trade.timestamp);
              
              return (
                <TableRow key={trade.id}>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${isBuy ? "bg-green-500/20 border-green-500/50" : "bg-red-500/20 border-red-500/50"}`}
                    >
                      <span className={isBuy ? "text-crypto-green" : "text-crypto-red"}>
                        {trade.type.toUpperCase()}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {trade.cryptoSymbol}
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.quantity.toFixed(8)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(trade.price)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(trade.total)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    <div>{formatDate(trade.timestamp)}</div>
                    <div>{formatTime(trade.timestamp)}</div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No trades have been executed yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
