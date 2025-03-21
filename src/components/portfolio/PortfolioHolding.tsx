
import React from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pl: number;
  plPercentage: number;
  dayChange: number;
  sector: string;
}

interface PortfolioHoldingProps {
  holding: Holding;
}

export const PortfolioHolding: React.FC<PortfolioHoldingProps> = ({ holding }) => {
  const isProfit = holding.pl >= 0;
  const isDayUp = parseFloat(holding.dayChange.toString()) >= 0;
  
  return (
    <div className="glass-card rounded-lg p-4 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between md:justify-start gap-2">
            <h3 className="font-semibold">{holding.symbol}</h3>
            <span className="text-xs rounded-full bg-muted px-2 py-0.5">{holding.sector}</span>
            <a 
              href={`https://www.screener.in/company/${holding.symbol.slice(0, holding.symbol.length-3)}/consolidated/`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{holding.name}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Quantity</p>
            <p className="font-medium">{holding.quantity}</p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Avg. Price</p>
            <p className="font-medium">₹{holding.avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">LTP</p>
            <div className="flex items-center gap-1">
              <p className="font-medium">₹{holding.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
              <span className={cn(
                "text-xs flex items-center",
                isDayUp ? "text-stock-up" : "text-stock-down"
              )}>
                {isDayUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(parseFloat(holding.dayChange.toString())).toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Current Value</p>
            <p className="font-medium">₹{holding.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">P&L</p>
            <div className="flex items-center gap-1">
              <p className={isProfit ? "text-stock-up font-medium" : "text-stock-down font-medium"}>
                {isProfit ? "+" : ""}₹{Math.abs(holding.pl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
              <span className={cn(
                "text-xs rounded-full px-1.5 py-0.5 flex items-center gap-0.5",
                isProfit ? "bg-stock-upBg text-stock-up" : "bg-stock-downBg text-stock-down"
              )}>
                {isProfit ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(holding.plPercentage).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
