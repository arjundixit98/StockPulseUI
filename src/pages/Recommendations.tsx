
import React from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { RecommendationsView } from '@/components/recommendations/RecommendationsView';
import { Navbar } from '@/components/layout/Navbar';

const Recommendations = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-10">
        <PageTransition>
          <RecommendationsView title="Stock Recommendations" />
        </PageTransition>
      </div>
    </div>
  );
};

export default Recommendations;
