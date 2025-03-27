
import React from 'react';
import { Filter, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioHolding } from './PortfolioHolding';

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

interface PortfolioTabsProps {
  holdings: Holding[];
  onSelectStock: (symbol: string) => void;
}

export const PortfolioTabs: React.FC<PortfolioTabsProps> = ({ holdings, onSelectStock }) => {
  return (
    <Tabs defaultValue="holdings" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <TabsContent value="holdings" className="mt-0">
        <div className="space-y-4">
          {holdings.map((holding, index) => (
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
