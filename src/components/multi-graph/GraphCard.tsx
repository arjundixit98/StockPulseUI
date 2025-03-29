
import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ArrowUp, ArrowDown, MoreHorizontal, Maximize2, Minimize2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { time } from 'console';

export interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercentage: number;
  chartData: {
    date: string;
    price: number;
  }[];
  weekHigh52: number;
  weekLow52: number;
}

interface GraphCardProps {
  stock: StockData;
  onMaximize?: (symbol: string) => void;
  isMaximized?: boolean;
}

type TimeRange = '1D' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX';

export const GraphCard: React.FC<GraphCardProps> = ({ stock, onMaximize,isMaximized = false}) => {



  const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
  const [chartData, setChartData] = useState([]);
  // Load historical data as and when Time range on graph is changed by user
  useEffect(()=> {

      //call the backend API and just fetch the historical data for the time frame
      //for a single ticker
      const fetchHistoricalData = async (symbol, time: TimeRange) => {

            const response = await fetch(`http://localhost:8000/api/stock_hist?ticker=${symbol}&time=${time}`);
            const result = await response.json();
            
            console.log('Fetching historical data for', symbol);
            setChartData(result.chartData);
      }

      fetchHistoricalData(stock.symbol, timeRange);

  },[stock.symbol,timeRange]);

  const isUp = stock.change > 0;
  const isDown = stock.change < 0;
  
  // Filter data based on time range
  const getFilteredData = () => {
    // This would normally filter based on the timeRange
    // For demo purposes, we'll just return all data
    return stock.chartData;
  };
  
  // const filteredData = getFilteredData();
  
  // Find min/max for better chart display
  const minPrice = Math.min(...chartData.map(d => d.price)) * 0.98;
  const maxPrice = Math.max(...chartData.map(d => d.price)) * 1.02;
 
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-2 text-sm">
          <p className="font-medium">{label}</p>
          <p>₹{payload[0].value.toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };
  
  const TimeRangeButton = ({ range }: { range: TimeRange }) => (
    <button
      onClick={() => setTimeRange(range)}
      className={cn(
        "px-2 py-1 text-xs font-medium transition-colors",
        timeRange === range 
          ? "bg-primary text-primary-foreground rounded" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {range}
    </button>
  );
  
  const shortenedStockSymbol = stock.symbol.slice(0,stock.symbol.length-3);
  return (
    <div className={cn(
      "graph-card flex flex-col h-full transition-all duration-500",
      isMaximized && "col-span-full"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{shortenedStockSymbol}</h3>
            <div className={cn(
              "flex items-center gap-1 text-xs rounded-full px-2 py-0.5",
              isUp ? "stock-up" : isDown ? "stock-down" : "stock-neutral"
            )}>
              {isUp ? <ArrowUp className="w-3 h-3" /> : isDown ? <ArrowDown className="w-3 h-3" /> : null}
              <span>{isUp ? "+" : ""}{stock.change.toFixed(2)} ({isUp ? "+" : ""}{stock.changePercentage.toFixed(2)}%)</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
          <p className="text-xl font-semibold mt-1">₹{stock.currentPrice.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="flex gap-1">
          <button 
            onClick={() => onMaximize?.(stock.symbol)}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-grow">
        <div className="h-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }} 
                tickMargin={10}
                axisLine={false}
                tickLine={false}
                minTickGap={30}
              />
              <YAxis 
                domain={[minPrice, maxPrice]} 
                tick={{ fontSize: 10 }} 
                tickMargin={10}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${Math.round(value)}`}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={stock.weekHigh52} stroke="#22c55e" strokeDasharray="3 3" opacity={0.7} />
              <ReferenceLine y={stock.weekLow52} stroke="#ef4444" strokeDasharray="3 3" opacity={0.7} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isUp ? '#22c55e' : '#ef4444'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-4 border-t border-border/80 pt-4 flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <span className="px-2 py-0.5 text-stock-up bg-stock-upBg rounded mr-2">
            52W H: ₹{stock.weekHigh52.toLocaleString('en-IN')}
          </span>
          <span className="px-2 py-0.5 text-stock-down bg-stock-downBg rounded">
            52W L: ₹{stock.weekLow52.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center">
          <TimeRangeButton range="1D" />
          <TimeRangeButton range="1M" />
          <TimeRangeButton range="3M" />
          <TimeRangeButton range="6M" />
          <TimeRangeButton range="YTD" />
          <TimeRangeButton range="1Y" />
          <TimeRangeButton range="5Y" />
          <TimeRangeButton range="MAX" />
        </div>
      </div>
    </div>
  );
};
