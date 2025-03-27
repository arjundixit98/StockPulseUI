import { GraphCard } from "../multi-graph/GraphCard";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import { Search, RefreshCw, Plus, X, Heart } from 'lucide-react';

const StockChartModal = ({ stock, onClose }) =>{
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);


  return (
  <GraphCard 
  stock={stock} 
  onMaximize={onClose}
  isMaximized={true}
/>);
  // return createPortal(
  //   <div
  //   className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  //   onClick={onClose}
  //   >
  //       <div key={stock.symbol} className={cn(
  //         "relative",
  //         "md:col-span-2"
  //       )}>
  //         <button
  //           onClick={() => console.log(stock.symbol)}
  //           className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-muted/80 hover:bg-muted transition-colors"
  //           aria-label="Remove"
  //         >
  //             <X className="w-4 h-4" />
  //         </button>
  //         <GraphCard 
  //           stock={stock} 
  //           onMaximize={onClose}
  //           isMaximized={true}
  //         />
  //       </div>
  //   </div>,
  //     document.body
  // );


  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-3xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button className="absolute top-4 right-4 text-gray-600" onClick={onClose}>
          ✕
        </button> 
        <div className="h-100 flex items-center justify-center">
        */}
        {/* <GraphCard 
            stock={stock} 
            onMaximize={onClose}
            isMaximized={false}
          /> */}

            <div 
              key={stock.symbol} 
              className={cn(
                "relative",
                "md:col-span-2"
              )}
            >
              <button
                onClick={() => console.log(stock.symbol)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-muted/80 hover:bg-muted transition-colors"
                aria-label="Remove"
              >
                <X className="w-4 h-4" />
              </button>
              <GraphCard 
                stock={stock} 
                onMaximize={onClose}
                isMaximized={false}
              />
            </div>
       {/* 
        </div>
      </motion.div> */}
    </div>,
    document.body // Moves modal outside the main DOM tree
  );
}



export default StockChartModal;

