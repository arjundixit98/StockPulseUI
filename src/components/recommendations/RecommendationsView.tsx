
import React, { useState } from 'react';
import { RecommendationCard, Recommendation } from './RecommendationCard';
import { Search, Filter, RefreshCw, Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    currentPrice: 645.80,
    targetPrice: 750.00,
    change: 12.40,
    changePercentage: 1.96,
    recommendation: 'buy',
    analysis: 'Strong growth in EV segment and improving JLR performance.',
    opportunity: 'New models launch and expanding market share in EV segment presents significant upside potential.',
    notificationsEnabled: true
  },
  {
    id: '2',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    currentPrice: 2567.85,
    targetPrice: 2900.00,
    change: 32.45,
    changePercentage: 1.28,
    recommendation: 'buy',
    analysis: 'Robust performance across segments with digital business showing strong growth.',
    opportunity: 'Strategic partnerships and expansion in retail segment offer long-term growth prospects.',
    notificationsEnabled: false
  },
  {
    id: '3',
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    currentPrice: 1498.65,
    targetPrice: 1700.00,
    change: 24.35,
    changePercentage: 1.65,
    recommendation: 'buy',
    analysis: 'Consistent deal wins and strong digital capabilities driving growth.',
    opportunity: 'Current valuation presents a good entry point with potential for rerating.',
    notificationsEnabled: true
  },
  {
    id: '4',
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd.',
    currentPrice: 2432.15,
    targetPrice: 2300.00,
    change: -8.65,
    changePercentage: -0.35,
    recommendation: 'sell',
    analysis: 'Pressure on margins due to rising input costs and competitive pressure.',
    opportunity: 'Better opportunities exist in the sector with more favorable risk-reward.',
    notificationsEnabled: false
  },
  {
    id: '5',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    currentPrice: 1672.30,
    targetPrice: 1900.00,
    change: -12.80,
    changePercentage: -0.76,
    recommendation: 'buy',
    analysis: 'Post-merger integration on track with improving loan growth metrics.',
    opportunity: 'Current dip offers a good entry point for long-term investors.',
    notificationsEnabled: true
  },
  {
    id: '6',
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    currentPrice: 3342.50,
    targetPrice: 3400.00,
    change: -15.75,
    changePercentage: -0.47,
    recommendation: 'hold',
    analysis: 'Stable performance but facing challenges in key markets.',
    opportunity: 'Wait for better entry points as valuation remains elevated compared to peers.',
    notificationsEnabled: false
  }
];

type FilterOption = 'all' | 'buy' | 'sell' | 'hold' | 'notifications';

interface RecommendationsViewProps {
  title: string;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ title }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleToggleNotification = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id ? { ...rec, notificationsEnabled: !rec.notificationsEnabled } : rec
      )
    );
  };
  
  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = 
      rec.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rec.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'buy') matchesFilter = rec.recommendation === 'buy';
    else if (filter === 'sell') matchesFilter = rec.recommendation === 'sell';
    else if (filter === 'hold') matchesFilter = rec.recommendation === 'hold';
    else if (filter === 'notifications') matchesFilter = rec.notificationsEnabled;
    
    return matchesSearch && matchesFilter;
  });
  
  const FilterButton = ({ 
    option, 
    label,
    icon: Icon
  }: { 
    option: FilterOption; 
    label: string;
    icon?: React.ElementType;
  }) => (
    <button 
      onClick={() => setFilter(option)}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5",
        filter === option 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted hover:bg-muted/80"
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search recommendations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg bg-muted w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterButton option="all" label="All" />
          <FilterButton option="buy" label="Buy" />
          <FilterButton option="sell" label="Sell" />
          <FilterButton option="hold" label="Hold" />
          <FilterButton option="notifications" label="With Alerts" icon={Bell} />
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1.5 bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Recommendations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecommendations.map((rec) => (
          <RecommendationCard 
            key={rec.id} 
            recommendation={rec} 
            onToggleNotification={handleToggleNotification}
          />
        ))}
      </div>
      
      {filteredRecommendations.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recommendations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
