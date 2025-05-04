import React, { useEffect, useState } from 'react';
import { StockCard, StockInfo } from './StockCard';
import { WishlistSelector } from './WishlistSelector';
import { Indicators } from './Indicators';
import { 
  Search, 
  SlidersHorizontal, 
  Clock, 
  ArrowUpDown, 
  Filter, 
  RefreshCw,
  Heart,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { StockGraphOverlay } from '../portfolio/StockGraphOverlay';

const mockStocks: StockInfo[] = [
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
];

type SortOption = 'name' | 'price' | 'change' | 'pe';

interface ScreenerViewProps {
  title: string;
}

export const ScreenerView: React.FC<ScreenerViewProps> = ({ title }) => {
  const [stocks, setStocks] = useState<StockInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [tempWishlist, setTempWishlist] = useState<string[]>([]);
  const [newTickerInput, setNewTickerInput] = useState('');
  const [isAddingTicker, setIsAddingTicker] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState('');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  

  let intervalId;

  const apiPolling = (stockSymbols) => {
    console.log('Polling again!');
    intervalId = setTimeout(()=> fetchStockDataOnceAndStartPolling(stockSymbols), 3000);
  };


  const fetchStockDataOnceAndStartPolling = async (stockSymbols: string[]) => {
    try {

       const tickerString = stockSymbols.toString();

       const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/stocks?tickers=${tickerString}`);
       const result = await response.json();
      //  console.log('Queried stocks data',result);
       setStocks(result);
      //apiPolling(stockSymbols);
      //  setStocks(result);
       

    }
    catch(error){
      console.error('Error fetching data from Django REST API', error);
      setStocks([]);
      if(intervalId)
        clearTimeout(intervalId);
      return;
    }
  }

  const fetchStockData = async (stockSymbols: string[]) => {
    try {

       const tickerString = stockSymbols.toString();
       const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/stocks?tickers=${tickerString}`);
       const result = await response.json();
      //  console.log('Queried stocks data',result);
       return result;

      //  setStocks(result);
       

    }
    catch(error){
      console.error('Error fetching data from Django REST API', error);
      return [];
    }
  }


  const startRealtimeRefresh = async ()=> {

      const intervalId = setInterval(async ()=> {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/stocks?tickers=SWIGGY.NS,ZOMATO.NS`);
          const result = await response.json();
          console.log('stock data updated');
          setStocks(result);
      },1000);
     
      setTimeout(async()=> {

         clearInterval(intervalId);
      },20000);
  }

  useEffect(()=> {

    const loadStocksOnFirstLoad = async () =>{
      const data = await fetchStockData(['SWIGGY.NS','ETERNAL.NS']);
      setStocks(data);
      console.log('stock data updated on first load');
    }
    
    loadStocksOnFirstLoad();
    

  },[]);
  
  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('asc');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Stock data refreshed');
    }, 1000);
  };


  const handleAddToWishlist = async (symbol: string) => {
    if (!tempWishlist.includes(symbol)) {
      setTempWishlist([...tempWishlist, symbol]);
      //call to backend API and persist this new symbol in the database

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/wishlist?name=${selectedWishlist}`,{
          method: 'PUT',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify([symbol])
        });

      if(response.ok){
          console.log('Wishlist updated into db successfully');
      }
    
      else{
          console.log('Failed to updated wishlist'); 
      }

      toast.success(`${symbol} added to temporary wishlist`);
    } else {
      toast.info(`${symbol} is already in your wishlist`);
    }
  };

  // const handleAddToWishlist = (symbol: string) => {
  //   if (!tempWishlist.includes(symbol)) {
  //     setTempWishlist([...tempWishlist, symbol]);
  //     toast.success(`${symbol} added to temporary wishlist`);
  //   } else {
  //     toast.info(`${symbol} is already in your wishlist`);
  //   }
  // };


  const handleLoadWishlist = async (stockSymbols: string[], wishlistname : string) => {

    // const data = await fetchStockData(stockSymbols);
    // // console.log(stockSymbols);
    // setStocks(data);
    // setTempWishlist(stockSymbols);

    fetchStockDataOnceAndStartPolling(stockSymbols);
    setTempWishlist(stockSymbols);
    setShowWishlist(false);
    setSelectedWishlist(wishlistname);
    
  
  };

  const fetchWishlists = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/wishlists`);
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

    const stocksData = await fetchStockData(stockSymbols);

    setStocks(stocksData);
    setTempWishlist([]);
  };

  const handleAddNewTicker = async () => {
    if (!newTickerInput.trim()) {
      toast.error('Please enter a valid ticker symbol');
      return;
    }

    const tickerSymbol = newTickerInput.trim().toUpperCase();

   

    if (stocks.some(stock => stock.symbol === tickerSymbol)) {
      toast.info(`${tickerSymbol} is already in your list`);
      setNewTickerInput('');
      return;
    }

    try{
      //load data for this newly added ticker
      const response = await fetchStockData([tickerSymbol]);
      console.log('response',response);

      if(!response || response.length===0){
        toast.error(`Failed to load data for ${tickerSymbol}`);
        return;
      }
      
      const newStockData = response[0];
      setStocks(prevStocks => [...prevStocks, newStockData]);

      //   if (tempWishlist.length > 0) {
      //   setTempWishlist(prev => [...prev, tickerSymbol]);
      // }
    
      toast.success(`Added ${tickerSymbol} to your list`);

      setNewTickerInput('');
      setIsAddingTicker(false);
    }
    
    catch(error){
      console.error('Error fetching stock data:', error);
      toast.error('Error fetching stock data');
    }
     
  };

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.symbol.localeCompare(b.symbol) 
        : b.symbol.localeCompare(a.symbol);
    } else if (sortBy === 'price') {
      return sortOrder === 'asc' 
        ? a.currentPrice - b.currentPrice 
        : b.currentPrice - a.currentPrice;
    } else if (sortBy === 'change') {
      return sortOrder === 'asc' 
        ? a.changePercentage - b.changePercentage 
        : b.changePercentage - a.changePercentage;
    } else if (sortBy === 'pe') {
      if (a.pe === null) return sortOrder === 'asc' ? 1 : -1;
      if (b.pe === null) return sortOrder === 'asc' ? -1 : 1;
      return sortOrder === 'asc' ? a.pe - b.pe : b.pe - a.pe;
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
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-muted w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
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

{isAddingTicker ? (
        <div className="bg-muted/30 rounded-lg p-4 flex flex-col md:flex-row gap-3 items-center animate-fadeIn">
          <div className="flex-grow">
            <Input
              placeholder="Enter ticker symbol (e.g., AAPL, MSFT, GOOGL)"
              value={newTickerInput}
              onChange={(e) => setNewTickerInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewTicker()}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddNewTicker}>
              <Plus className="h-4 w-4 mr-2" />
              Add Ticker
            </Button>
            <Button variant="ghost" onClick={() => setIsAddingTicker(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="w-full justify-center"
          onClick={() => setIsAddingTicker(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Ticker Symbol
        </Button>
      )}


      <Indicators stocks={stocks} />
      
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <SortButton option="name" label="Name" />
            <SortButton option="price" label="Price" />
            <SortButton option="change" label="Change" />
            <SortButton option="pe" label="P/E" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1.5 bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center gap-1.5 bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
            <Clock className="w-4 h-4" />
            <span>Real-time</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedStocks.map((stock) => (
          <StockCard 
            key={stock.symbol} 
            stock={stock} 
            onAddToWishlist={handleAddToWishlist}
            onSelectStock={handleSelectStock} 
          />
        ))}
      </div>
      
      {sortedStocks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No stocks found matching your search.</p>
        </div>
      )}


      <StockGraphOverlay 
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
          stockSymbol={selectedStock}
        />
    </div>
  );
};
