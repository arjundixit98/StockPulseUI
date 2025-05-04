
import React, { useEffect, useState } from 'react';
import { GraphCard, StockData } from './GraphCard';
import { Search, RefreshCw, Plus, X, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WishlistSelector } from '../screener/WishlistSelector';
import { StockInfo } from '../screener/StockCard';


// Mock data for demonstration
// const mockStocks: StockData[] = [
//   {
//     symbol: 'RELIANCE',
//     name: 'Reliance Industries Ltd.',
//     currentPrice: 2567.85,
//     change: 32.45,
//     changePercentage: 1.28,
//     chartData: 'zz',
//     weekHigh52: 2900.00,
//     weekLow52: 2100.00
//   },
// ];

interface MultiGraphViewProps {
  title: string;
}

export interface Wishlist {
  id: string;
  name: string;
  symbols: string[];
}

export interface StockSymbol {
  symbol: string;
  name: string;
}

export const MultiGraphView: React.FC<MultiGraphViewProps> = ({ title }) => {
  const [availableStocks, setAvailableStocks] = useState<StockData[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<StockData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [maximizedStock, setMaximizedStock] = useState<string | null>(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [stocks, setStocks] = useState<StockInfo[]>([]);
  const [tempWishlist, setTempWishlist] = useState<string[]>([]);

  const fetchWishlists = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/wishlists/`);
      const result = await response.json();
      if(result.length === 0){
        console.log('No wishlists found');
        return [];
      }
      console.log('Queried wishlists',result);
      return result;
    } 
    
    catch (error) {
      console.log('Issue occured while loading wishlists!', error);
      return [];
    }
   
}


  const fetchStockData = async (tickers: string[]) => {
    
    const data = [];
    try{
      const tickerString = tickers.toString()
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/stocks?tickers=${tickerString}`);
      const result = await response.json();
      
      
      console.log('Queried stock data',result);
      return result;
    }
    catch(error)
    {
      console.log('Error occured while fetching historical data', error);
      return data;
    }
    
  };

  useEffect(()=> {

    const callFetchWishlists = async () => {
      const wishlists = await fetchWishlists();
      setWishlists(wishlists);
    }
     
    callFetchWishlists();

  },[]);

  const handleLoadWishlist = async (stockSymbols: string[]) => {

    const data = await fetchStockData(stockSymbols);
    setAvailableStocks(data);
    setTempWishlist(stockSymbols);
  
  };

  const handleViewAllStocks = async () => {

    //Gather stock symbols from wishlists API
    
    const wishlists = await fetchWishlists();
    console.log(wishlists);
    const stockSymbolsSet = new Set<string>();
    wishlists.forEach(wishlist => {
      wishlist.symbols.forEach(symbol => {
        stockSymbolsSet.add(symbol);
      });
    });

    const stockSymbols : string[] = [...stockSymbolsSet]
    //Fetch stock data for these stock symbols

    const data = await fetchStockData(stockSymbols);

    setAvailableStocks(data);
    setSelectedStocks(data);
    setTempWishlist([]);
  };



  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleRemoveStock = (symbol: string) => {
    setSelectedStocks(prev => prev.filter(stock => stock.symbol !== symbol));
    setMaximizedStock(null);
  };
  
  const handleAddStock = (stock: StockData) => {
    if (selectedStocks.length < 6 || maximizedStock) {
      setSelectedStocks(prev => [...prev, stock]);
      setSearchTerm('');
    }
  };
  
  const handleMaximize = (symbol: string) => {
    setMaximizedStock(prev => prev === symbol ? null : symbol);
  };
  
  const filteredAvailableStocks = availableStocks.filter(stock => 
    !selectedStocks.some(s => s.symbol === stock.symbol) &&
    (stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
     stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex items-center gap-3">
          <div className="relative flex-grow w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Add a stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-muted w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchTerm && (
              <div className="absolute left-0 right-0 top-full mt-1 glass-card rounded-lg border border-border/80 shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredAvailableStocks.length > 0 ? (
                  filteredAvailableStocks.map(stock => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleAddStock(stock)}
                      className="w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors flex justify-between items-center"
                      disabled={selectedStocks.length >= 6 && !maximizedStock}
                    >
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground">{stock.name}</div>
                      </div>
                      <Plus className="w-4 h-4" />
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-muted-foreground">No stocks found</div>
                )}
              </div>
            )}
          </div>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1.5 bg-muted hover:bg-muted/80 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            <span className="hidden md:inline">Refresh</span>
          </button>
          <Button 
            variant="outline" 
            className={cn(
              "gap-2",
              showWishlist ? "bg-primary/10 border-primary/30" : ""
            )}
            onClick={() => setShowWishlist(!showWishlist)}
          >
            <Heart className={cn("h-4 w-4", showWishlist ? "text-rose-500" : "")} />
            Wishlists
          </Button>
        </div>
      </div>


      {showWishlist && (
        <div className="animate-fadeIn">
          <WishlistSelector 
            onLoadWishlist={handleLoadWishlist} 
            currentStocks={stocks.map(stock => stock.symbol)}
          />
          
          {tempWishlist.length > 0 && (
            <div className="flex justify-between items-center py-2 mb-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                <span className="text-sm font-medium">
                  Currently viewing: {tempWishlist.length} stocks from wishlist
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleViewAllStocks}>
                View All Stocks
              </Button>
            </div>
          )}
        </div>
      )}

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedStocks.map((stock) => {
          // Skip non-maximized stocks when a stock is maximized
          if (maximizedStock && stock.symbol !== maximizedStock) return null;
          
          return (
            <div 
              key={stock.symbol} 
              className={cn(
                "relative",
                maximizedStock === stock.symbol && "md:col-span-2"
              )}
            >
              <button
                onClick={() => handleRemoveStock(stock.symbol)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-muted/80 hover:bg-muted transition-colors"
                aria-label="Remove"
              >
                <X className="w-4 h-4" />
              </button>
              <GraphCard 
                stock={stock} 
                onMaximize={handleMaximize}
                isMaximized={maximizedStock === stock.symbol}
              />
            </div>
          );
        })}
      </div>
      
      {selectedStocks.length === 0 && (
        <div className="text-center py-8 glass-card rounded-xl">
          <p className="text-muted-foreground">No stocks selected. Add stocks to compare.</p>
        </div>
      )}
      
      {!maximizedStock && selectedStocks.length > 0 && selectedStocks.length < 4 && (
        <div className="text-center text-sm text-muted-foreground">
          You can add up to {4 - selectedStocks.length} more stock{4 - selectedStocks.length !== 1 ? 's' : ''} to compare.
        </div>
      )}
    </div>
  );
};
