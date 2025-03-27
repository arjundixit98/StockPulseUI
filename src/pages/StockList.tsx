import { useState } from "react";
import StockChartModal from "../components/portfolio/StockChartModal";

const stocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
];

const StockList = () => {
  const [selectedStock, setSelectedStock] = useState(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Stock List</h2>
      <div className="grid grid-cols-3 gap-4">
        {stocks.map((stock) => (
          <button
            key={stock.symbol}
            className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            onClick={() => setSelectedStock(stock)}
          >
            {stock.name}
          </button>
        ))}
      </div>

      {selectedStock && (
        <StockChartModal stock={selectedStock} onClose={() => setSelectedStock(null)} />
      )}
    </div>
  );
}

export default StockList;

