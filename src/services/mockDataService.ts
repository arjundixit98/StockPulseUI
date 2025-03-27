
import { StockInfo } from "@/components/screener/StockCard";
import { Wishlist } from "@/components/screener/WishlistSelector";
import { Holding } from "./portfolioService";

// Mock stock data for screener
export const MOCK_STOCKS: StockInfo[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    currentPrice: 2567.85,
    change: 32.45,
    changePercentage: 1.28,
    weekHigh52: 2900.00,
    weekLow52: 2100.00,
    pe: 28.5,
    sector: 'Energy',
    downFrom52WeekHigh: 11.45
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currentPrice: 896.45,
    change: 15.78,
    changePercentage: 1.79,
    weekHigh52: 950.00,
    weekLow52: 450.00,
    pe: 65.3,
    sector: 'Technology',
    downFrom52WeekHigh: 5.64
  },
  {
    symbol: 'ZOMATO.NS',
    name: 'Zomato Ltd.',
    currentPrice: 178.25,
    change: -3.45,
    changePercentage: -1.90,
    weekHigh52: 195.00,
    weekLow52: 105.00,
    pe: 42.1,
    sector: 'Consumer Services',
    downFrom52WeekHigh: 8.59
  },
  {
    symbol: 'SWIGGY.NS',
    name: 'Swiggy (Bundl Technologies)',
    currentPrice: 210.50,
    change: 4.25,
    changePercentage: 2.06,
    weekHigh52: 235.00,
    weekLow52: 120.00,
    pe: 38.7,
    sector: 'Consumer Services',
    downFrom52WeekHigh: 10.43
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    currentPrice: 3750.20,
    change: 45.75,
    changePercentage: 1.23,
    weekHigh52: 3900.00,
    weekLow52: 3200.00,
    pe: 30.2,
    sector: 'Technology',
    downFrom52WeekHigh: 3.84
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    currentPrice: 1625.40,
    change: -12.30,
    changePercentage: -0.75,
    weekHigh52: 1800.00,
    weekLow52: 1300.00,
    pe: 25.8,
    sector: 'Technology',
    downFrom52WeekHigh: 9.70
  }
];

// Mock wishlists for screener
export const MOCK_WISHLISTS: Wishlist[] = [
  {
    id: '1',
    name: 'Tech Stocks',
    symbols: ['NVDA', 'TCS', 'INFY']
  },
  {
    id: '2',
    name: 'Food Delivery',
    symbols: ['ZOMATO.NS', 'SWIGGY.NS']
  },
  {
    id: '3',
    name: 'Indian Market',
    symbols: ['RELIANCE', 'TCS', 'INFY']
  }
];

// Mock portfolio holdings
export const MOCK_HOLDINGS: Holding[] = [
  {
    id: '1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    quantity: 10,
    avgPrice: 2450.75,
    currentPrice: 2590.50,
    value: 25905.00,
    pl: 1397.50,
    plPercentage: 5.70,
    dayChange: 1.25,
    sector: 'Oil & Gas'
  },
  {
    id: '2',
    symbol: 'INFY',
    name: 'Infosys Limited',
    quantity: 25,
    avgPrice: 1340.20,
    currentPrice: 1505.75,
    value: 37643.75,
    pl: 4138.75,
    plPercentage: 12.36,
    dayChange: 2.20,
    sector: 'IT'
  },
  {
    id: '3',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    quantity: 15,
    avgPrice: 1620.40,
    currentPrice: 1580.25,
    value: 23703.75,
    pl: -601.50,
    plPercentage: -2.47,
    dayChange: -0.85,
    sector: 'Banking'
  },
  {
    id: '4',
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    quantity: 8,
    avgPrice: 3210.50,
    currentPrice: 3450.25,
    value: 27602.00,
    pl: 1917.50,
    plPercentage: 7.47,
    dayChange: 0.45,
    sector: 'IT'
  },
  {
    id: '5',
    symbol: 'TATASTEEL',
    name: 'Tata Steel Ltd',
    quantity: 30,
    avgPrice: 1150.80,
    currentPrice: 1090.40,
    value: 32712.00,
    pl: -1812.00,
    plPercentage: -5.25,
    dayChange: -1.75,
    sector: 'Metal'
  }
];

// Helper function to get mock stock data by symbols
export const getMockStocksBySymbols = (symbols: string[]): StockInfo[] => {
  if (!symbols || symbols.length === 0) return [];
  
  // First try to match exact symbols from our mock data
  const matchedStocks = MOCK_STOCKS.filter(stock => 
    symbols.includes(stock.symbol)
  );
  
  // For any symbols we don't have in our mock data, generate mock data
  const foundSymbols = matchedStocks.map(stock => stock.symbol);
  const missingSymbols = symbols.filter(symbol => !foundSymbols.includes(symbol));
  
  const generatedStocks = missingSymbols.map(symbol => ({
    symbol,
    name: `${symbol} Inc.`,
    currentPrice: Math.floor(Math.random() * 500) + 100,
    change: Math.random() > 0.5 ? Math.random() * 10 : -Math.random() * 10,
    changePercentage: Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5,
    weekHigh52: Math.floor(Math.random() * 600) + 200,
    weekLow52: Math.floor(Math.random() * 200) + 50,
    pe: Math.floor(Math.random() * 40) + 10,
    sector: 'Unknown',
    downFrom52WeekHigh: Math.random() * 15
  }));
  
  return [...matchedStocks, ...generatedStocks];
};
