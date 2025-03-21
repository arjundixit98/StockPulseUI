
import React, { useEffect, useState } from 'react';
import { NewsCard, NewsItem } from './NewsCard';
import { Search, RefreshCw, Calendar, ArrowUpDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import Index from '@/pages/Index';

// Mock data for demonstration
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Reliance Industries Announces Strategic Partnership with Global Tech Giant',
    excerpt: 'Reliance Industries has entered into a strategic partnership with a leading global tech company to accelerate digital transformation across various sectors in India.',
    source: 'Economic Times',
    timestamp: '2023-06-10T09:15:00Z',
    url: '#',
    sentiment: 'positive',
    relatedStocks: ['RELIANCE', 'INFY'],
    imageUrl: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
];

type FilterOption = 'all' | 'positive' | 'negative' | 'neutral';

interface NewsViewProps {
  title: string;
}

export const NewsView: React.FC<NewsViewProps> = ({ title }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const correctTimeFormat = (datetime : string)=>{
    return datetime.slice(0,4)+'-'+datetime.slice(4,6)+'-'+datetime.slice(6,8)+'T'+datetime.slice(9,11)+':'+datetime.slice(11,13)+':'+datetime.slice(13,15)+'Z';

  };

  const correctSentiment = (sentiment : string) => {
    if(sentiment.includes("Bullish"))
      return 'positive';
    else if(sentiment.includes("Bearish"))
      return 'negative';

    return 'neutral';
  }

  const randomizeNewsFeed = ()=>{
    const randomNumbers = new Set();

    while (randomNumbers.size < 6) {
      randomNumbers.add(Math.floor(Math.random() * 50) + 1);
    }

    return [...randomNumbers];
  }

  useEffect(()=>{

    const fetchNewsData = async ()=>{
      try {
        const API_KEY = import.meta.env.VITE_API_KEY;
        const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL,NVDA&apikey=${API_KEY}`);
        const result = await response.json();
        console.log(result);

        const newsFeed = result.feed;
        console.log(newsFeed);
        const data = []
        if(!newsFeed || newsFeed.length==0)
        {
          console.log('News feed is empty');
          return;
        }

        newsFeed.forEach((feed,index : number) => {
          data.push({
            id: index+1,
            title: feed.title,
            excerpt: feed.summary,
            source: feed.source,
            timestamp: correctTimeFormat(feed.time_published),
            url: feed.url,
            sentiment: correctSentiment(feed.overall_sentiment_label),
            relatedStocks: feed.ticker_sentiment.map((tickerObj)=> tickerObj.ticker),
            imageUrl: feed.banner_image,
          });
        });
        console.log(data);
        const indices = randomizeNewsFeed();
        const randomizedFeed = [];
        indices.forEach((index : number) => {
          randomizedFeed.push(data[index]);
        });
        setNews(randomizedFeed);
      } 
      
      catch (error) {
        console.log('Error occured while fetching news', error);
      }
      


    };

    
    fetchNewsData();

  },[]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relatedStocks.some(stock => stock.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      filter === 'all' || 
      item.sentiment === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  const FilterButton = ({ 
    option, 
    label 
  }: { 
    option: FilterOption; 
    label: string 
  }) => (
    <button 
      onClick={() => setFilter(option)}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
        filter === option 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted hover:bg-muted/80"
      )}
    >
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
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg bg-muted w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <FilterButton option="all" label="All" />
            <FilterButton option="positive" label="Positive" />
            <FilterButton option="negative" label="Negative" />
            <FilterButton option="neutral" label="Neutral" />
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
            <Calendar className="w-4 h-4" />
            <span>Last 7 days</span>
          </button>
        </div>
      </div>
      
      {/* News grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNews.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
      
      {filteredNews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No news found matching your search.</p>
        </div>
      )}
    </div>
  );
};
