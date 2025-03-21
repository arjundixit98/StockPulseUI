
import React from 'react';
import { StockInfo } from './StockCard';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Percent, DollarSign, BarChart3 } from 'lucide-react';

interface IndicatorProps {
  stocks: StockInfo[];
}

const IndicatorCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  change?: { value: number; isPositive: boolean } 
  icon: React.ElementType;
}) => (
  <div className="glass-card rounded-xl p-4 flex justify-between items-center">
    <div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      {change && (
        <div className={cn(
          "flex items-center gap-1 mt-1 text-xs rounded-full px-2 py-0.5 w-fit",
          change.isPositive ? "stock-up" : "stock-down"
        )}>
          {change.isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          <span>
            {change.isPositive ? "+" : ""}{change.value.toFixed(2)}%
          </span>
        </div>
      )}
    </div>
    <div className="bg-muted rounded-full p-3">
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

export const Indicators: React.FC<IndicatorProps> = ({ stocks }) => {
  // Average P/E ratio, excluding null values
  const validPeRatios = stocks.filter(stock => stock.pe !== null).map(stock => stock.pe as number);
  const avgPE = validPeRatios.length > 0 
    ? validPeRatios.reduce((sum, pe) => sum + pe, 0) / validPeRatios.length 
    : 0;
    
  // Average % down from 52 week high
  const avgDownFrom52WeekHigh = stocks.length > 0
    ? stocks.reduce((sum, stock) => sum + stock.downFrom52WeekHigh, 0) / stocks.length
    : 0;
    
  // Count stocks that went up today
  const stocksUp = stocks.filter(stock => stock.change > 0).length;
  const stocksUpPercentage = (stocksUp / stocks.length) * 100;
  
  // Average percentage change
  const avgChange = stocks.length > 0
    ? stocks.reduce((sum, stock) => sum + stock.changePercentage, 0) / stocks.length
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <IndicatorCard 
        title="Average P/E Ratio" 
        value={avgPE.toFixed(2)} 
        icon={BarChart3}
      />
      <IndicatorCard 
        title="Avg. Down From 52W High" 
        value={`${avgDownFrom52WeekHigh.toFixed(2)}%`}
        change={{ value: -avgDownFrom52WeekHigh, isPositive: false }}
        icon={Percent}
      />
      <IndicatorCard 
        title="Stocks Trending Up" 
        value={`${stocksUp}/${stocks.length} (${stocksUpPercentage.toFixed(0)}%)`}
        change={{ value: stocksUpPercentage, isPositive: stocksUpPercentage >= 50 }}
        icon={ArrowUp}
      />
      <IndicatorCard 
        title="Average Change Today" 
        value={`${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}%`}
        change={{ value: avgChange, isPositive: avgChange > 0 }}
        icon={DollarSign}
      />
    </div>
  );
};
