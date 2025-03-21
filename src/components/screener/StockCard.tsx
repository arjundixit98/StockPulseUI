
import React from 'react';
import { ArrowUp, ArrowDown, Sparkles, MoreHorizontal, ExternalLink, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface TickerInfo {
  symbol: string
}

export interface StockInfo {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercentage: number;
  weekHigh52: number;
  weekLow52: number;
  pe: number | null;
  sector: string;
  downFrom52WeekHigh: number;
}

interface StockCardProps {
  stock: StockInfo;
  onAddToWishlist?: (symbol: string) => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onAddToWishlist }) => {
  const isUp = stock.change > 0;
  const isDown = stock.change < 0;
  
  // Calculate how far the current price is from 52 week high and low (as percentage)
  const percentFrom52WeekHigh = ((stock.weekHigh52 - stock.currentPrice) / stock.weekHigh52) * 100;
  const percentFrom52WeekLow = ((stock.currentPrice - stock.weekLow52) / stock.weekLow52) * 100;
  
  // Determine the "buy opportunity" status based on how far from 52 week high
  const isBuyOpportunity = percentFrom52WeekHigh > 20;
  
  const handleWishlistClick = () => {
    if (onAddToWishlist) {
      onAddToWishlist(stock.symbol);
    } else {
      // This is a fallback for when the component is used without the callback
      toast.success(`${stock.symbol} added to temporary wishlist`);
    }
  };
  
  return (
    <div className="stock-card animate-fadeIn w-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{stock.symbol}</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">{stock.sector}</span>
          </div>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
        </div>
        <div className="flex gap-1">
          <button 
            className="p-1.5 rounded-full hover:bg-muted transition-colors text-rose-500 hover:text-rose-600"
            onClick={handleWishlistClick}
            title="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <Sparkles className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-semibold">₹{stock.currentPrice.toLocaleString('en-IN')}</span>
          <div className={cn(
            "flex items-center gap-1 mt-1 text-sm rounded-full px-2 py-0.5 w-fit",
            isUp ? "stock-up" : isDown ? "stock-down" : "stock-neutral"
          )}>
            {isUp ? <ArrowUp className="w-3.5 h-3.5" /> : isDown ? <ArrowDown className="w-3.5 h-3.5" /> : null}
            <span>{isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePercentage.toFixed(2)}%)</span>
          </div>
        </div>
        
        {isBuyOpportunity && (
          <div className="bg-stock-upBg text-stock-up px-2 py-1 rounded-md text-xs font-medium">
            Buy Opportunity
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/80 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">52W High</p>
          <p className="font-medium">₹{stock.weekHigh52.toLocaleString('en-IN')}</p>
          <p className="text-xs text-stock-down mt-1">
            {percentFrom52WeekHigh.toFixed(1)}% below
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">52W Low</p>
          <p className="font-medium">₹{stock.weekLow52.toLocaleString('en-IN')}</p>
          <p className="text-xs text-stock-up mt-1">
            {percentFrom52WeekLow.toFixed(1)}% above
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">P/E Ratio</p>
          <p className="font-medium">{stock.pe ? stock.pe.toFixed(2) : 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Sector</p>
          <p className="font-medium">{stock.sector}</p>
        </div>
      </div>
    </div>
  );
};
