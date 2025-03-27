import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { GraphCard } from '@/components/multi-graph/GraphCard';

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

  const [stockData, setStockData] = useState(null);


  const fetchStockData = async (ticker: string) => {
    
    if(!ticker)
      return null;

    try{

      const response = await fetch(`http://localhost:8000/api/stock?ticker=${ticker}`);
      const result = await response.json();
      
      console.log(`Queried stock data for ${result.symbol}`,result);
      return result;
    }
    catch(error)
    {
      console.log('Error occured while fetching historical data', error);
      return null;
    }
    
  };

  useEffect(()=>{
    const loadData = async ()=> {
      const stockData = await fetchStockData(stockSymbol);
      setStockData(stockData);

    }

    loadData();
  },[stockSymbol]);


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl bg-opacity-95">
      <DialogHeader>
      {/* <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription> */}
    </DialogHeader>
        {stockData && (
          <GraphCard 
            stock={stockData}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};