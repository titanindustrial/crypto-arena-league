
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CryptoCurrency } from "../types";
import { ArrowUp, ArrowDown, Search } from "lucide-react";
import { formatCurrency } from "../lib/utils";

interface CryptoTableProps {
  cryptos: CryptoCurrency[];
  onSelectCrypto?: (crypto: CryptoCurrency) => void;
}

export const CryptoTable: React.FC<CryptoTableProps> = ({ cryptos, onSelectCrypto }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCryptos = cryptos.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cryptocurrencies..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h %</TableHead>
              <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
              <TableHead className="text-right hidden md:table-cell">Volume (24h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCryptos.length > 0 ? (
              filteredCryptos.map((crypto, index) => {
                const priceChangeClass = crypto.change24h >= 0 ? "price-up" : "price-down";
                const priceChangeIcon = crypto.change24h >= 0 ? 
                  <ArrowUp className="inline h-3 w-3 mr-1" /> : 
                  <ArrowDown className="inline h-3 w-3 mr-1" />;
                
                return (
                  <TableRow 
                    key={crypto.id} 
                    className={onSelectCrypto ? "cursor-pointer hover:bg-secondary/50" : ""}
                    onClick={() => onSelectCrypto && onSelectCrypto(crypto)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <img 
                          src={crypto.image} 
                          alt={crypto.name} 
                          className="h-6 w-6 mr-2" 
                        />
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(crypto.currentPrice)}
                    </TableCell>
                    <TableCell className={`text-right ${priceChangeClass}`}>
                      {priceChangeIcon}
                      {Math.abs(crypto.change24h).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {formatCurrency(crypto.marketCap, 0)}
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {formatCurrency(crypto.volume24h, 0)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No cryptocurrencies found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
