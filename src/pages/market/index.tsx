// src/components/OrderBook.tsx
import React, { useEffect, useState } from "react";
import { useOrderBookStore } from "../../orderbooksocket";

interface Order {
  price: number;
  quantity: number;
}

interface OrderBookState {
  buyOrders: Order[];
  sellOrders: Order[];
  lastPrice: number;
}

interface MarketPrice {
  pairId: string;
  symbol: string;
  price: number;
}

export const Market: React.FC = () => {
  const {
    connect,
    disconnect,
    onOrderBookUpdate,
    onTradeMatched,
    onMarketPriceUpdate,
  } = useOrderBookStore();

  // 🔹 Store multiple pairs instead of one
  const [markets, setMarkets] = useState<Record<string, MarketPrice>>({});
  const [orderBooks, setOrderBooks] = useState<
    Record<string, OrderBookState>
  >({});

  useEffect(() => {
    connect();

    // Handle order book updates for all pairs
    onOrderBookUpdate(
      (data: { pairId: string; symbol: string; orderBook: OrderBookState }) => {
        setOrderBooks((prev) => ({
          ...prev,
          [data.pairId]: data.orderBook,
        }));
      }
    );

    // Handle live market price updates
    onMarketPriceUpdate((data: MarketPrice) => {
      setMarkets((prev) => ({
        ...prev,
        [data.pairId]: data,
      }));
    });

    onTradeMatched((trade) => {
      console.log("New trade:", trade);
    });

    return () => {
      disconnect();
    };
  }, [
    connect,
    disconnect,
    onOrderBookUpdate,
    onTradeMatched,
    onMarketPriceUpdate,
  ]);

  return (
    <div className="orderbook">
      <h2 className="text-xl font-bold mb-4">Live Market Prices</h2>

      {/* 🔹 Show all pairs */}
      <div className="market-list">
        {Object.values(markets).map((m) => (
          <div key={m.pairId} className="market-item mb-4 p-2 border-b rounded">

            <div className="flex items-center gap-2 mb-2">
            <img
          src={`/logos/${m.symbol.split("/")[0].toLowerCase()}.png`}
          alt={m.symbol}
          className="w-5 h-5"
          onError={(e) => (e.currentTarget.src = "/logos/default.png")}
        />
            <h3 className="font-semibold">
              {m.symbol} — ${m.price.toFixed(2)}
            </h3>
            </div>

            {/* Show order book for this pair */}
            <div className="orderbook-columns flex gap-8">
              <div className="buy">
                <h4>Buy</h4>
                {orderBooks[m.pairId]?.buyOrders?.map((order, i) => (
                  <div key={i} className="order-row flex justify-between">
                    <span>{order.quantity}</span>
                    <span>${order.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="sell">
                <h4>Sell</h4>
                {orderBooks[m.pairId]?.sellOrders?.map((order, i) => (
                  <div key={i} className="order-row flex justify-between">
                    <span>{order.quantity}</span>
                    <span>${order.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Market;