
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CryptoCurrency, Portfolio } from "../types";
import { ArrowRightLeft } from "lucide-react";
import { useContest } from "../contexts/ContestContext";
import { formatCurrency } from "../lib/utils";

interface TradeFormProps {
  allowedCryptos: string[];
  cryptos: CryptoCurrency[];
  portfolio: Portfolio;
  contestId: string;
}

export const TradeForm: React.FC<TradeFormProps> = ({
  allowedCryptos,
  cryptos,
  portfolio,
  contestId,
}) => {
  const { executeTrade } = useContest();
  const [loading, setLoading] = useState(false);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [selectedCrypto, setSelectedCrypto] = useState<string>(allowedCryptos[0] || "BTC");
  const [amount, setAmount] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  
  const filteredCryptos = cryptos.filter(crypto => 
    allowedCryptos.includes(crypto.symbol)
  );
  
  const selectedCryptoData = cryptos.find(crypto => crypto.symbol === selectedCrypto);
  
  const handleTradeTypeChange = (value: string) => {
    setTradeType(value as "buy" | "sell");
    setAmount("");
    setQuantity("");
  };
  
  const handleCryptoChange = (value: string) => {
    setSelectedCrypto(value);
    setAmount("");
    setQuantity("");
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && selectedCryptoData) {
      const amountValue = parseFloat(value);
      if (!isNaN(amountValue) && amountValue > 0) {
        const calculatedQuantity = amountValue / selectedCryptoData.currentPrice;
        setQuantity(calculatedQuantity.toFixed(8));
      } else {
        setQuantity("");
      }
    } else {
      setQuantity("");
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);
    
    if (value && selectedCryptoData) {
      const quantityValue = parseFloat(value);
      if (!isNaN(quantityValue) && quantityValue > 0) {
        const calculatedAmount = quantityValue * selectedCryptoData.currentPrice;
        setAmount(calculatedAmount.toFixed(2));
      } else {
        setAmount("");
      }
    } else {
      setAmount("");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCryptoData || !amount || !quantity) {
      return;
    }
    
    setLoading(true);
    
    try {
      const amountValue = parseFloat(amount);
      const quantityValue = parseFloat(quantity);
      
      if (isNaN(amountValue) || isNaN(quantityValue)) {
        throw new Error("Invalid amount or quantity");
      }
      
      // Check if user has enough balance for buy
      if (tradeType === "buy" && amountValue > portfolio.virtualBalance) {
        throw new Error("Insufficient balance");
      }
      
      // Check if user has enough crypto for sell
      if (tradeType === "sell") {
        const holding = portfolio.holdings[selectedCrypto];
        if (!holding || holding.quantity < quantityValue) {
          throw new Error(`Insufficient ${selectedCrypto} balance`);
        }
      }
      
      await executeTrade({
        userId: portfolio.userId,
        contestId,
        cryptoSymbol: selectedCrypto,
        type: tradeType,
        quantity: quantityValue,
        price: selectedCryptoData.currentPrice,
        total: amountValue,
      });
      
      // Reset form after successful trade
      setAmount("");
      setQuantity("");
    } catch (error) {
      console.error("Trade execution failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const currentHolding = portfolio.holdings[selectedCrypto];
  const hasHolding = currentHolding && currentHolding.quantity > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRightLeft className="h-5 w-5 mr-2" />
          Execute Trade
        </CardTitle>
        <CardDescription>
          Buy or sell cryptocurrencies in this contest
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Trade Type</Label>
            <RadioGroup 
              defaultValue="buy"
              value={tradeType}
              onValueChange={handleTradeTypeChange}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="buy" id="buy" />
                <Label htmlFor="buy" className="cursor-pointer">Buy</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="sell" id="sell" />
                <Label htmlFor="sell" className="cursor-pointer">Sell</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="crypto">Cryptocurrency</Label>
            <Select
              value={selectedCrypto}
              onValueChange={handleCryptoChange}
            >
              <SelectTrigger id="crypto">
                <SelectValue placeholder="Select a cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {filteredCryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    <div className="flex items-center">
                      <img 
                        src={crypto.image} 
                        alt={crypto.name} 
                        className="h-4 w-4 mr-2" 
                      />
                      {crypto.name} ({crypto.symbol})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCryptoData && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="col-span-2 flex justify-between text-sm text-muted-foreground">
                <span>Current Price:</span>
                <span>{formatCurrency(selectedCryptoData.currentPrice)}</span>
              </div>
              
              {tradeType === "buy" && (
                <div className="col-span-2 flex justify-between text-sm text-muted-foreground">
                  <span>Available:</span>
                  <span>{formatCurrency(portfolio.virtualBalance)}</span>
                </div>
              )}
              
              {tradeType === "sell" && hasHolding && (
                <div className="col-span-2 flex justify-between text-sm text-muted-foreground">
                  <span>Available:</span>
                  <span>{currentHolding.quantity.toFixed(8)} {selectedCrypto}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0.00000000"
                  min="0"
                  step="0.00000001"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={
            loading || 
            !selectedCryptoData || 
            !amount || 
            !quantity || 
            parseFloat(amount) <= 0 ||
            (tradeType === "buy" && parseFloat(amount) > portfolio.virtualBalance) ||
            (tradeType === "sell" && (!currentHolding || parseFloat(quantity) > currentHolding.quantity))
          }
        >
          {loading ? "Processing..." : `${tradeType === "buy" ? "Buy" : "Sell"} ${selectedCrypto}`}
        </Button>
      </CardFooter>
    </Card>
  );
};
