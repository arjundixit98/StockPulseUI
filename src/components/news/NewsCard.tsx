
import React from 'react';
import { ExternalLink, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  timestamp: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedStocks: string[];
  imageUrl?: string;
}

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  // Define the icon component based on sentiment
  const SentimentIcon = 
    news.sentiment === 'positive' ? TrendingUp : 
    news.sentiment === 'negative' ? TrendingDown : 
    Minus;
  
  const sentimentClass = 
    news.sentiment === 'positive' ? 'stock-up' : 
    news.sentiment === 'negative' ? 'stock-down' : 
    'stock-neutral';

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
  };
  
  return (
    <div className="news-card h-full flex flex-col">
      <div className="flex-grow">
        {news.imageUrl && (
          <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg">
            <img 
              src={news.imageUrl} 
              alt={news?.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{news?.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{news.excerpt}</p>
      </div>
      
      <div className="mt-auto">
        <div className="flex flex-wrap gap-1 mb-3">
          {news.relatedStocks.map((stock) => (
            <span 
              key={stock} 
              className="text-xs px-2 py-0.5 bg-muted rounded-full"
            >
              {stock}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-border/80">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 text-xs rounded-full px-2 py-0.5",
              sentimentClass
            )}>
              <SentimentIcon className="w-3 h-3" />
              <span className="capitalize">{news.sentiment}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatTimestamp(news.timestamp)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{news.source}</span>
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Open article"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
