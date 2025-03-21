
import React from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import { MultiGraphView } from '@/components/multi-graph/MultiGraphView';
import { Navbar } from '@/components/layout/Navbar';

const MultiGraph = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-10">
        <PageTransition>
          <MultiGraphView title="Multi Graph View" />
        </PageTransition>
      </div>
    </div>
  );
};

export default MultiGraph;
