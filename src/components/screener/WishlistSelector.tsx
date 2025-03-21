
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heart, Plus, Check, Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface Wishlist {
  id: string;
  name: string;
  symbols: string[];
}

// Sample wishlists - in a real app, these would be stored in a database or localStorage
const defaultWishlists: Wishlist[] = [
  {
    id: 'tech-stocks',
    name: 'Tech Stocks',
    symbols: ['INFY', 'TCS', 'WIPRO']
  },
  {
    id: 'finance-stocks',
    name: 'Finance Stocks',
    symbols: ['HDFCBANK', 'ICICIBANK']
  },
  {
    id: 'mixed-portfolio',
    name: 'Mixed Portfolio',
    symbols: ['RELIANCE', 'TATAMOTORS', 'HINDUNILVR']
  }
];

interface WishlistSelectorProps {
  onLoadWishlist: (stockSymbols: string[]) => void;
  currentStocks: string[];
}

export const WishlistSelector: React.FC<WishlistSelectorProps> = ({ onLoadWishlist,currentStocks }) => {

  const [wishlists, setWishlists] = useState<Wishlist[]>([]);

  // const [wishlists, setWishlists] = useState<Wishlist[]>(() => {
  //   // Try to load wishlists from localStorage, or use defaults
  //   const savedWishlists = localStorage.getItem('stockScreenerWishlists');
  //   return savedWishlists ? JSON.parse(savedWishlists) : defaultWishlists;
  // });
  
  const [newWishlistName, setNewWishlistName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  useEffect(()=> {

    const fetchWishlists = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/wishlists`);
          const result = await response.json();
          if(result.length === 0){
            console.log('No wishlists found');
            return;
          }

          setWishlists(result);
        } 
        
        catch (error) {
          console.log('Issue occured while loading wishlists!', error);
        }
       
    }

    fetchWishlists();
  },[]);

  const handleLoadWishlist = (wishlist: Wishlist) => {
    console.log('Loading wishlist',wishlist);
    onLoadWishlist(wishlist.symbols);
    toast.success(`Loaded "${wishlist.name}" wishlist`);
  };
  
  const handleCreateWishlist = async () => {
    if (!newWishlistName.trim()) {
      toast.error('Please enter a wishlist name');
      return;
    }
    
    const newWishlist: Wishlist = {
      id: `wishlist-${Date.now()}`,
      name: newWishlistName,
      symbols: currentStocks
    };
    
    const updatedWishlists = [...wishlists, newWishlist];
    setWishlists(updatedWishlists);

    try{

          //save newly created wishlist into database
          const response = await fetch(`http://localhost:8000/api/wishlist`,{
              method: 'POST',
              headers: {
                'Content-Type':'application/json'
              },
              body: JSON.stringify(newWishlist),
          });

          if(response.ok){
              console.log('Wishlist saved into db successfully');
              setNewWishlistName('');
              setIsCreatingNew(false);
              toast.success(`Created new wishlist: ${newWishlistName}`);
          }

          else{
              console.log('Failed to save wishlist'); 
          }
    } 
    catch (error) {
      console.log('Error occured while saving wishlist', error); 
    }
  
    
  };
  
  const handleDeleteWishlist = async (id: string) => {
      const updatedWishlists = wishlists.filter(wishlist => wishlist.id !== id);
      setWishlists(updatedWishlists);

      try{

          //save newly created wishlist into database
          const response = await fetch(`http://localhost:8000/api/wishlist/${id}`,{
              method: 'DELETE',
          });

          if(response.ok){
              console.log('Wishlist deleted successfully');
              // setNewWishlistName('');
              // setIsCreatingNew(false);
              toast.success('Wishlist deleted');
          }

          else{
              console.log('Failed to delete wishlist'); 
          }
      } 
      catch (error) {
          console.log('Error occured while deleting wishlist', error); 
      }


  };



  
  return (
    <div className="bg-card border rounded-lg p-4 space-y-4 mb-6">
      <Tabs defaultValue="load">
        <TabsList className="mb-4">
          <TabsTrigger value="load">Load Wishlist</TabsTrigger>
          <TabsTrigger value="save">Save Wishlist</TabsTrigger>
        </TabsList>
        
        <TabsContent value="load" className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Your Wishlists</span>
          </h3>
          
          {wishlists.length === 0 ? (
            <p className="text-muted-foreground text-sm">No saved wishlists. Create one in the "Save" tab.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {wishlists.map((wishlist) => (
                <div key={wishlist.id} className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-md">
                  <div>
                    <p className="font-medium">{wishlist.name}</p>
                    <p className="text-xs text-muted-foreground">{wishlist.symbols.length} stocks</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleLoadWishlist(wishlist)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
                      onClick={() => handleDeleteWishlist(wishlist.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="save" className="space-y-4">
          {isCreatingNew ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                  placeholder="Enter wishlist name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button onClick={handleCreateWishlist} className="flex-shrink-0">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This will save your current list of {currentStocks.length} stocks.</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsCreatingNew(false)}
                  className="mt-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsCreatingNew(true)} className="w-full justify-center">
              <Plus className="h-4 w-4 mr-2" />
              Create New Wishlist
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
