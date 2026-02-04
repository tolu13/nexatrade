import { useEffect, useState } from "react";
import { useOrderBookStore } from  "../orderbooksocket";

type TradingPair = {
  id: string;
  symbol: string;
  price?: number
};

export const TradingPairsList = ({ onSelectPair }: { onSelectPair: (pair: TradingPair) => void }) => {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const { connect, disconnect,  onMarketPriceUpdate } = useOrderBookStore();

  useEffect(() => {
    fetch("https://server-z0rg.onrender.com/tradingpair")
      .then(res => res.json())
      .then(setPairs)
      .catch(console.error);
    
    connect();

    onMarketPriceUpdate((data: {pairId: string, symbol: string, price: number}) => {
      setPairs((prev) => prev.map(pair => pair.id === data.pairId ? {...pair, price: data.price} : pair));
    })
    
      return () => {
      disconnect();
    };
  }, [connect, disconnect, onMarketPriceUpdate]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-yellow-400 mb-2">Trading Pairs</h2>
      <div className="flex flex-wrap gap-2">
        {pairs.map(pair => (
          <button
            key={pair.id}
            onClick={() => onSelectPair(pair)}
            className="bg-gray-700 hover:bg-yellow-500 text-white px-4 py-1 rounded-full shadow-sm transition duration-200"
          >
            {pair.symbol}
             <span className="text-yellow-400">
            {pair.price ? `$${pair.price.toFixed(2)}` : "Loading..."}
          </span>
          </button>
          
        ))}
      </div>
    </div>
  );
};
