
import { MOCK_HOLDINGS } from './mockDataService';

export interface Holding {
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

export const fetchZerodhaHoldings = async (): Promise<Holding[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would be an actual API call
    // const response = await fetch('https://api.example.com/holdings');
    // if (!response.ok) throw new Error('Failed to fetch holdings');
    // const data = await response.json();
    // return data;
    
    // Return our mock data
    return MOCK_HOLDINGS;
  }
  catch(error) {
    console.log("Error occurred while fetching holdings from Zerodha", error);
    throw new Error("Failed to fetch holdings");
  }
};
