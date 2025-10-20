import { useState, useEffect } from "react";
import CandlestickChart, { type CandleDataPoint } from "../candleStick";
import { Portfolio } from "../Portfolio";
import { useOrderBookStore } from "../../orderbooksocket";

type TradingPair = {
  id: string;
  symbol: string;
  lastPrice: number;
  change: number; // 24h %
  volume: number; // 24h volume
};

export const DashboardHome = () => {
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [candles, setCandles] = useState<CandleDataPoint[]>([]);
  const { connect, disconnect, onMarketPriceUpdate, socket } =
    useOrderBookStore();

  const handleSelectPair = async (pair: TradingPair) => {
    setSelectedPair(pair);
    setCandles([]);

    if (!socket) return;
    socket.emit("getCandles", pair.id, (response: CandleDataPoint[]) => {
      console.log("📊 Received historical candles:", response);
      setCandles(response);
    });
  };
  // Dummy pairs for UI demo
  const { tradingpairs } = useOrderBookStore();
  const pairs: TradingPair[] = tradingpairs.length ? tradingpairs : [];
  useEffect(() => {
    connect();

    const unsub = onMarketPriceUpdate(({ pairId, price }) => {
      if (!selectedPair || pairId !== selectedPair.id) return;

      setCandles((prev) => {
        const now = Date.now();
        const last = prev[prev.length - 1];

        if (last && now - last.x < 60_000) {
          return [
            ...prev.slice(0, -1),
            {
              ...last,
              h: Math.max(last.h, price),
              l: Math.min(last.l, price),
              c: price,
            },
          ];
        } else {
          return [...prev, { x: now, o: price, h: price, l: price, c: price }];
        }
      });
    });

    return () => {
      unsub();
      disconnect();
    };
  }, [connect, disconnect, onMarketPriceUpdate, selectedPair]);

  return (
    <div className="min-h-screen bg-white text-gray-700 p-6 m-5">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-[#BF7587]">
          Trading Dashboard
        </h1>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 `">
        {/* Portfolio Section */}
        <section className="lg:col-span-1 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <Portfolio />
        </section>

        {/* Trading Pairs Table */}
        <section className="lg:col-span-2 bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Markets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="px-3 py-2">Pair</th>
                  <th className="px-3 py-2">Last Price</th>
                  <th className="px-3 py-2">24h %</th>
                  <th className="px-3 py-2">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pairs.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectPair(p)}
                  >
                    <td className="px-3 py-2 flex items-center gap-2">
                      <img
                        src={`/logos/${p.symbol
                          .split("/")[0]
                          .toLowerCase()}.png`}
                        alt={p.symbol}
                        className="w-5 h-5"
                      />
                      {p.symbol}
                    </td>
                    <td className="px-3 py-2">{p.lastPrice}</td>
                    <td
                      className={`px-3 py-2 ${
                        p.change > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {p.change}%
                    </td>
                    <td className="px-3 py-2">{p.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedPair && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-bold mb-2 text-gray-700">
                  Selected Pair
                </h3>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-semibold text-gray-900">
                    {selectedPair.symbol}
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      selectedPair.change > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedPair.lastPrice}
                  </span>
                  <span className="text-sm text-gray-500">
                    Vol: {selectedPair.volume}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Chart Section */}
        <section className="lg:col-span-3 bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Price Chart
          </h2>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <CandlestickChart data={candles} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
