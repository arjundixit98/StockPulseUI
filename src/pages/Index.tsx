
import React from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ScreenerView } from '@/components/screener/ScreenerView';
import { Navbar } from '@/components/layout/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-10">
        <PageTransition>
          <ScreenerView title="Stock Screener" />
        </PageTransition>
      </div>
    </div>
  );
};

export default Index;
