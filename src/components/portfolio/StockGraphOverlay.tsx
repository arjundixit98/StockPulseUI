import React from 'react';
import { X } from 'lucide-react';
import { GraphCard, StockData } from '@/components/multi-graph/GraphCard';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StockGraphOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string | null;
}

export const StockGraphOverlay: React.FC<StockGraphOverlayProps> = ({ 
  isOpen, 
  onClose,
  stockSymbol
}) => {
  if (!stockSymbol) return null;
  
  // Create a mock stock data object for the GraphCard
  const stockData: StockData = {
    symbol: stockSymbol,
    name: stockSymbol,
    currentPrice: 1500 + Math.random() * 500,
    change: Math.random() * 100 - 50,
    changePercentage: Math.random() * 5 - 2.5,
    chartData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: Math.random() * 1000 + 500
    })),
    weekHigh52: 2200,
    weekLow52: 850
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] bg-background/95 backdrop-blur-sm">
        <DialogTitle className="sr-only">Stock Performance</DialogTitle>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Stock Performance</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="h-[500px]">
          <GraphCard stock={stockData}/>
        </div>
      </DialogContent>
    </Dialog>
  );
};
