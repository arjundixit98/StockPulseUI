
import React from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { NewsView } from '@/components/news/NewsView';
import { Navbar } from '@/components/layout/Navbar';

const News = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-10">
        <PageTransition>
          <NewsView title="Market News" />
        </PageTransition>
      </div>
    </div>
  );
};

export default News;
