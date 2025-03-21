
import React from 'react';
import { ArrowUp, ArrowDown, Bell, BellOff, ExternalLink, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Recommendation {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  targetPrice: number;
  change: number;
  changePercentage: number;
  recommendation: 'buy' | 'sell' | 'hold';
  analysis: string;
  opportunity: string;
  notificationsEnabled: boolean;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onToggleNotification: (id: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation,
  onToggleNotification
}) => {
  const priceGap = recommendation.targetPrice - recommendation.currentPrice;
  const priceGapPercentage = (priceGap / recommendation.currentPrice) * 100;
  const isPositiveGap = priceGap > 0;
  
  const recommendationClass = 
    recommendation.recommendation === 'buy' ? 'stock-up' : 
    recommendation.recommendation === 'sell' ? 'stock-down' : 
    'stock-neutral';
  
  return (
    <div className="recommendation-card animate-fadeIn">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{recommendation.symbol}</h3>
          <p className="text-sm text-muted-foreground">{recommendation.name}</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-lg text-sm font-medium uppercase",
          recommendation.recommendation === 'buy' ? 'bg-stock-upBg text-stock-up' :
          recommendation.recommendation === 'sell' ? 'bg-stock-downBg text-stock-down' :
          'bg-stock-neutralBg text-stock-neutral'
        )}>
          {recommendation.recommendation}
        </div>
      </div>
      
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-2xl font-semibold">₹{recommendation.currentPrice.toLocaleString('en-IN')}</span>
          <div className={cn(
            "flex items-center gap-1 mt-1 text-sm rounded-full px-2 py-0.5 w-fit",
            recommendation.change > 0 ? "stock-up" : 
            recommendation.change < 0 ? "stock-down" : 
            "stock-neutral"
          )}>
            {recommendation.change > 0 ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
            <span>
              {recommendation.change > 0 ? "+" : ""}{recommendation.change.toFixed(2)} 
              ({recommendation.change > 0 ? "+" : ""}{recommendation.changePercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Target Price</p>
          <p className="text-xl font-semibold">₹{recommendation.targetPrice.toLocaleString('en-IN')}</p>
          <p className={cn(
            "text-xs mt-1",
            isPositiveGap ? "text-stock-up" : "text-stock-down"
          )}>
            {isPositiveGap ? "+" : ""}{priceGap.toFixed(2)} ({isPositiveGap ? "+" : ""}{priceGapPercentage.toFixed(2)}%)
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center gap-1 mb-1">
          <Info className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Analysis</h4>
        </div>
        <p className="text-sm text-muted-foreground pl-5">{recommendation.analysis}</p>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-1">Opportunity</h4>
        <p className="text-sm text-muted-foreground">{recommendation.opportunity}</p>
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-border/80">
        <button
          onClick={() => onToggleNotification(recommendation.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            recommendation.notificationsEnabled 
              ? "bg-primary/10 text-primary" 
              : "bg-muted hover:bg-muted/80"
          )}
        >
          {recommendation.notificationsEnabled ? (
            <>
              <Bell className="w-4 h-4" />
              <span>Notifications On</span>
            </>
          ) : (
            <>
              <BellOff className="w-4 h-4" />
              <span>Enable Alerts</span>
            </>
          )}
        </button>
        
        <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
