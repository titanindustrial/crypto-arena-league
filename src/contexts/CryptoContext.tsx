
import React, { createContext, useContext, useState, useEffect } from "react";
import { CryptoCurrency } from "../types";
import { toast } from "sonner";

interface CryptoContextType {
  cryptos: CryptoCurrency[];
  loading: boolean;
  error: string | null;
  refreshCryptos: () => Promise<void>;
  getCryptoBySymbol: (symbol: string) => CryptoCurrency | undefined;
}

const CryptoContext = createContext<CryptoContextType>({
  cryptos: [],
  loading: true,
  error: null,
  refreshCryptos: async () => {},
  getCryptoBySymbol: () => undefined,
});

const mockCryptoData: CryptoCurrency[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    currentPrice: 62345.78,
    previousPrice: 61982.45,
    change24h: 0.59,
    marketCap: 1233456789000,
    volume24h: 28765432100,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    currentPrice: 3487.21,
    previousPrice: 3512.67,
    change24h: -0.72,
    marketCap: 423456789000,
    volume24h: 15432678900,
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "Binance Coin",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    currentPrice: 567.89,
    previousPrice: 559.34,
    change24h: 1.53,
    marketCap: 87654321000,
    volume24h: 4321987600,
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    currentPrice: 145.67,
    previousPrice: 142.31,
    change24h: 2.36,
    marketCap: 43210987000,
    volume24h: 3456789100,
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    currentPrice: 0.48,
    previousPrice: 0.49,
    change24h: -2.04,
    marketCap: 16789012300,
    volume24h: 987654300,
  },
  {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    currentPrice: 0.62,
    previousPrice: 0.61,
    change24h: 1.64,
    marketCap: 32109876000,
    volume24h: 1876543200,
  },
  {
    id: "polkadot",
    symbol: "DOT",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    currentPrice: 7.82,
    previousPrice: 7.91,
    change24h: -1.14,
    marketCap: 9876543200,
    volume24h: 654321000,
  },
  {
    id: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    currentPrice: 0.12,
    previousPrice: 0.118,
    change24h: 1.69,
    marketCap: 15432100000,
    volume24h: 1234567890,
  },
];

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      
      // Mock API call - this would be a real fetch in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add some randomness to prices to simulate market changes
      const updatedCryptos = mockCryptoData.map(crypto => {
        const priceChange = (Math.random() * 5 - 2.5) / 100; // -2.5% to +2.5%
        const previousPrice = crypto.currentPrice;
        const newPrice = previousPrice * (1 + priceChange);
        const change24h = ((newPrice - previousPrice) / previousPrice) * 100;
        
        return {
          ...crypto,
          previousPrice,
          currentPrice: newPrice,
          change24h,
        };
      });
      
      setCryptos(updatedCryptos);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch cryptocurrency data");
      setLoading(false);
      toast.error("Failed to load cryptocurrency data");
    }
  };

  useEffect(() => {
    fetchCryptos();

    // Update prices every 30 seconds
    const interval = setInterval(fetchCryptos, 30000);
    return () => clearInterval(interval);
  }, []);

  const getCryptoBySymbol = (symbol: string) => {
    return cryptos.find(crypto => crypto.symbol === symbol);
  };

  return (
    <CryptoContext.Provider value={{ cryptos, loading, error, refreshCryptos: fetchCryptos, getCryptoBySymbol }}>
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => useContext(CryptoContext);
