
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Filter, RefreshCw, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { PortfolioHolding } from './PortfolioHolding';
import { cn } from '@/lib/utils';
import { PortfolioTabs } from './PortfolioTabs';
import { StockGraphOverlay } from './StockGraphOverlay';
const demo = [
  {
    'tradingsymbol': 'AMBUJACEM', 
    'exchange': 'BSE', 
    'instrument_token': 128108804, 
    'isin': 'INE079A01024', 
    'product': 'CNC', 'price': 0, 'quantity': 20, 'used_quantity': 0, 't1_quantity': 0, 
    'realised_quantity': 20, 'authorised_quantity': 0, 'authorised_date': '2025-03-17 00:00:00', 'opening_quantity': 20, 
    'average_price': 487.35,
    'last_price': 491,
    'close_price': 486.2, 
    'pnl': 72.99999999999955, 
    'day_change': 4.800000000000011, 
    'day_change_percentage': 0.9872480460715779, 
    'mtf': {
      'quantity': 0,
      'used_quantity': 0,
      'average_price': 0,
      'value': 0, 
      'initial_margin': 0
    }
  }
];
// Sample data - this would be replaced with actual API response
const SAMPLE_HOLDINGS = [
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

];

interface PortfolioViewProps {
  title: string;
}

type SortOption = 'name' | 'day_change_per' | 'p&l_per' | 'pe' | 'down%' | 'up%';


export const PortfolioView: React.FC<PortfolioViewProps> = ({ title }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [holdings, setHoldings] = useState([]);
  const [credentials, setCredentials] = useState({ apiKey: '', apiSecret: '' });
  // const [sortBy, setSortBy] = useState<SortOption>('name');
  // const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Total portfolio values calculations
  const totalInvestment = holdings.reduce((sum, item) => sum + (item.avgPrice * item.quantity), 0);
  const currentValue = holdings.reduce((sum, item) => sum + item.value, 0);
  const totalPL = currentValue - totalInvestment;
  const totalPLPercentage = (totalPL / totalInvestment) * 100;
  const isProfit = totalPL >= 0;

  // Load all holdings when the page loads for the first time

  const fetchZerodhaHoldings = async () => {

    try{
      const response = await fetch('http://localhost:8000/api/holdings');
      const result = await response.json();
      console.log('Queried stock holindgs', result);
      return result;
    }
    catch(error){
      console.log("Error occured while fetching holdings from Zerodha", error);
      return [];
    }
    
  }


  useEffect(()=> {

    const loadHoldingsOnFirstHold = async () => {
      
      const result = await fetchZerodhaHoldings();
      setHoldings(result);
    }

    loadHoldingsOnFirstHold();
      

    //   const intervalId = setInterval(async ()=>{
    //   setIsRefreshing(true);
    //   const updatedHoldings = await fetchZerodhaHoldings();
      
    //   setHoldings(updatedHoldings);
    //   console.log('Holdings refeshed again!')
    //   setIsRefreshing(false);
    // },1000);

    // return ()=> {
    //   if(intervalId)
    //     clearInterval(intervalId);
    // }; 
  

  },[]);


  const handleConnect = () => {
    // This would be replaced with actual Zerodha API authentication
    console.log('Connecting to Zerodha with credentials:', credentials);
    setIsRefreshing(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsConnected(true);
      setIsRefreshing(false);
    }, 1500);
  };
  
  const handleRefresh = () => {
    // This would be replaced with actual data fetching
    // setIsRefreshing(true);
    

    // setInterval(async ()=>{
    //   const updatedHoldings = await fetchZerodhaHoldings();
      
    //   setHoldings(updatedHoldings);
    //   console.log('Holdings refeshed again!')
    //   setIsRefreshing(false);
    // },1500);

    // Simulate API delay
    // setTimeout(async () => {
    //   // Update with new random values to simulate real-time changes
    //   const updatedHoldings = await fetchZerodhaHoldings();
      
    //   setHoldings(updatedHoldings);
    //   setIsRefreshing(false);
    // }, 1500);
  };

  const handleSelectStock = (symbol: string) => {
    setSelectedStock(symbol);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedStock(null);
  };







  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {isConnected && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        )}
      </div>

      {!isConnected ? (
        <Card className="p-6 glass-card">
          <h2 className="text-xl font-semibold mb-4">Connect to Zerodha</h2>
          <p className="text-muted-foreground mb-6">
            Enter your Zerodha API credentials to fetch your portfolio data. Your credentials are stored locally and never shared.
          </p>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="apiKey" className="text-sm font-medium">API Key</label>
              <Input 
                id="apiKey" 
                type="text" 
                placeholder="Enter your Zerodha API key"
                value={credentials.apiKey}
                onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="apiSecret" className="text-sm font-medium">API Secret</label>
              <Input 
                id="apiSecret" 
                type="password" 
                placeholder="Enter your API secret"
                value={credentials.apiSecret}
                onChange={(e) => setCredentials({...credentials, apiSecret: e.target.value})}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleConnect}
              disabled={!credentials.apiKey || !credentials.apiSecret || isRefreshing}
            >
              {isRefreshing ? 'Connecting...' : 'Connect to Zerodha'}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-5 glass-card">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Investment</h3>
              <p className="text-2xl font-bold">₹{totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            </Card>
            
            <Card className="p-5 glass-card">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Value</h3>
              <p className="text-2xl font-bold">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            </Card>
            
            <Card className={`p-5 glass-card ${isProfit ? 'border-stock-up/30' : 'border-stock-down/30'}`}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total P&L</h3>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${isProfit ? 'text-stock-up' : 'text-stock-down'}`}>
                  {isProfit ? '+' : ''}₹{Math.abs(totalPL).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </p>
                <span className={`flex items-center text-sm font-medium px-2 py-0.5 rounded-full ${isProfit ? 'stock-up' : 'stock-down'}`}>
                  {isProfit ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(totalPLPercentage).toFixed(2)}%
                </span>
              </div>
            </Card>
          </div>

          <PortfolioTabs 
            holdings={holdings} 
            onSelectStock={handleSelectStock} 
          />

          <StockGraphOverlay 
            isOpen={isOverlayOpen}
            onClose={handleCloseOverlay}
            stockSymbol={selectedStock}
          />
        </>
      )}
    </div>
  );
};
