import React from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pl: number;
  plPercentage: number;
  dayChange: number;
  sector: string;
}

interface PortfolioHoldingProps {
  holding: Holding;
}

export const ScreenerFrame = () => {
  function openModal() {
    document.getElementById('myModal').style.display = 'block';
  }
  function closeModal() {
    document.getElementById('myModal').style.display = 'none';
  }

  return (
    <div>
    <div className="zz">
      Hello
    </div>
    <button onClick={openModal}>Open Screener</button>

    <div id="myModal" className="modal hidden">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <iframe src="https://www.screener.in/" width="100%" height="500px"></iframe>
      </div>
    </div>
    </div>
  )
}