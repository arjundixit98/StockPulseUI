
import React from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { PortfolioView } from '@/components/portfolio/PortfolioView';
import { Navbar } from '@/components/layout/Navbar';

const Portfolio = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-10">
        <PageTransition>
          <PortfolioView title="Zerodha Portfolio" />
        </PageTransition>
      </div>
    </div>
  );
};

export default Portfolio;
