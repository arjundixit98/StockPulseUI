
import React, { useState} from 'react';
import { Filter, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioHolding } from './PortfolioHolding';
import { cn } from '@/lib/utils';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  investedValue: number,
  value: number;
  pl: number;
  plPercentage: number;
  dayChange: number;
  sector: string;
  pe: number;
  weekHigh52: number;
  weekLow52: number;
  percentFrom52WeekHigh: number;
  percentFrom52WeekLow: number;
  stock: object;
}


interface PortfolioTabsProps {
  holdings: Holding[];
  onSelectStock: (symbol: string) => void;
}

type SortOption = 'name' | 'day_change_per' | 'p&l_per' | 'pe' | 'down%' | 'up%';


export const PortfolioTabs: React.FC<PortfolioTabsProps> = ({ holdings, onSelectStock }) => {
   const [sortBy, setSortBy] = useState<SortOption>('name');
   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('asc');
    }
  };

    const sortedHoldings = [...holdings].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.symbol.localeCompare(b.symbol) 
          : b.symbol.localeCompare(a.symbol);
      } else if (sortBy === 'day_change_per') {
        return sortOrder === 'asc' 
          ? a.dayChange - b.dayChange 
          : b.dayChange - a.dayChange;
      } else if (sortBy === 'p&l_per') {
        return sortOrder === 'asc' 
          ? a.plPercentage - b.plPercentage 
          : b.plPercentage - a.plPercentage;
      }
      else if (sortBy === 'pe') {
        if (a.pe === null) return sortOrder === 'asc' ? 1 : -1;
        if (b.pe === null) return sortOrder === 'asc' ? -1 : 1;
        return sortOrder === 'asc' ? a.pe - b.pe : b.pe - a.pe;
      }
      else if (sortBy === 'down%') {
        return sortOrder === 'asc' 
          ? a.percentFrom52WeekHigh - b.percentFrom52WeekHigh
          : b.percentFrom52WeekHigh - a.percentFrom52WeekHigh;
      }
      else if (sortBy === 'up%') {
        return sortOrder === 'asc' 
          ? a.percentFrom52WeekLow - b.percentFrom52WeekLow 
          : b.percentFrom52WeekLow - a.percentFrom52WeekLow;
      }
      return 0;
    });


     const SortButton = ({ 
        option, 
        label 
      }: { 
        option: SortOption; 
        label: string 
      }) => (
        <button 
          onClick={() => handleSort(option)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            sortBy === option 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted hover:bg-muted/80"
          )}
        >
          {label}
          {sortBy === option && (
            <span className="ml-1">
              {sortOrder === 'asc' ? '↓' : '↑'}
            </span>
          )}
        </button>
      );
  


  return (
    <Tabs defaultValue="holdings" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <SortButton option="name" label="Name" />
            <SortButton option="day_change_per" label="Change%" />
            <SortButton option="p&l_per" label="P&L%" />
            <SortButton option="down%" label="Down%" />
            <SortButton option="up%" label="Up%" />
            <SortButton option="pe" label="P/E" />
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <TabsContent value="holdings" className="mt-0">
        <div className="space-y-4">
          {sortedHoldings.map((holding, index) => (
            <PortfolioHolding 
              key={index} 
              holding={holding} 
              onSelectStock={onSelectStock}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="analysis" className="mt-0">
        <div className="flex flex-col items-center justify-center p-10 glass-card rounded-lg">
          <PieChart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Portfolio Analysis</h3>
          <p className="text-muted-foreground text-center">
            Detailed portfolio analysis visualization will be added here, showing sector allocation, risk metrics, and performance over time.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
