
import React, { useState } from 'react';
import { ArrowUpRight, ArrowUp, ArrowDown, ArrowDownRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { GraphCard } from '../multi-graph/GraphCard';

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


interface PortfolioHoldingProps {
  holding: Holding;
  onSelectStock: (symbol: string) => void;
}

export const PortfolioHolding: React.FC<PortfolioHoldingProps> = ({ holding, onSelectStock }) => {
  const isProfit = holding.pl >= 0;
  const isDayUp = parseFloat(holding.dayChange.toString()) >= 0;
  const [selectedStock, setSelectedStock ] = useState(null);
  
  return (
    <div className="glass-card rounded-lg p-4 hover:shadow-md transition-all duration-300">
     <div className="flex items-center mb-3">
        <div>
          <div className="flex items-center gap-2">

          <h3 
              className="font-semibold cursor-pointer hover:text-primary transition-colors"
              onClick={() => onSelectStock(holding.symbol)}
            >
              {holding.symbol.slice(0, holding.symbol.length-3)}
            </h3>
            
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
          <p 
            className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            onClick={() => onSelectStock(holding.symbol)}
          >
            {holding.name}
          </p>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Quantity</TableHead>
            <TableHead className="w-[120px]">Avg. Price</TableHead>
            <TableHead className="w-[120px]">LTP</TableHead>
            <TableHead className="w-[80px]">P/E</TableHead>
            <TableHead className="w-[150px]">52W High</TableHead>
            <TableHead className="w-[150px]">52W Low</TableHead>
            <TableHead className="w-[120px]">Invested Value</TableHead>
            <TableHead className="w-[120px]">Current Value</TableHead>
            <TableHead className="w-[150px]">P&L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{holding.quantity}</TableCell>
            <TableCell>₹{holding.avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <span>₹{holding.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                <span className={cn(
                  "text-xs flex items-center",
                  isDayUp ? "text-stock-up" : "text-stock-down"
                )}>
                  {isDayUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(parseFloat(holding.dayChange.toString())).toFixed(2)}%
                </span>
              </div>
            </TableCell>
            <TableCell>{holding.pe.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
            
            {/* <TableCell>{holding.weekHigh52}</TableCell> */}
            <TableCell>
              <div className="flex items-center gap-1">
                <span>₹{holding.weekHigh52.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                <span className={cn(
                  "text-xs flex items-center",
                  "text-stock-down"
                )}>
                  <ArrowDown className="h-3 w-3" />
                  {Math.abs(parseFloat(holding.percentFrom52WeekHigh.toString())).toFixed(2)}%
                </span>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-1">
                <span>₹{holding.weekLow52.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                <span className={cn(
                  "text-xs flex items-center",
                   "text-stock-up"
                )}>
                <ArrowUp className="h-3 w-3" />    
                {Math.abs(parseFloat(holding.percentFrom52WeekLow.toString())).toFixed(2)}% 
                
                </span>
              </div>
            </TableCell>

            <TableCell>₹{holding.investedValue}</TableCell>

           
           

            <TableCell>₹{holding.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>


            <TableCell>
              <div className="flex items-center gap-1">
                <span className={isProfit ? "text-stock-up font-medium" : "text-stock-down font-medium"}>
                  {isProfit ? "+" : ""}₹{Math.abs(holding.pl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
                <span className={cn(
                  "text-xs rounded-full px-1.5 py-0.5 flex items-center gap-0.5",
                  isProfit ? "bg-stock-upBg text-stock-up" : "bg-stock-downBg text-stock-down"
                )}>
                  {isProfit ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(holding.plPercentage).toFixed(2)}%
                </span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
