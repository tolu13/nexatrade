// src/pages/Portfolio/index.tsx
import { useEffect } from "react";
import usePortfolioStore from "../../lib/store/portfolioStore";
import { useAuthStore } from "../../lib/store/authstore";
import { useOrderBookStore } from "../../orderbooksocket";

export const Portfolio = () => {
  const token = useAuthStore((state) => state.token);
  const portfolio = usePortfolioStore((state) => state.portfolio);
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);
  const markets = useOrderBookStore((state) => state.markets); // ✅ live prices from WebSocket

  useEffect(() => {
    if (token) {
      fetchPortfolio(token);
    }
  }, [fetchPortfolio, token]);

  // ✅ Get BTC/USDT price as reference
  const btcPrice =
    Object.values(markets).find((m) => m.symbol === "BTC/USDT")?.price || 0;

  return (
    <div className="max-w-2xl w-full mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#A2574F] mb-6 border-b-2 border-[#A2574F] pb-2">
        My Portfolio
      </h2>

      <ul className="space-y-4">
        {portfolio.map((item) => {
          const assetSymbol = item.asset.symbol.toUpperCase();
          const market = Object.values(markets).find(
            (m) => m.symbol === `${assetSymbol}/USDT`
          );
          const assetPrice = market?.price || 0;
          const usdValue = assetPrice * item.balance;
          const btcEquivalent =
            btcPrice > 0 ? usdValue / btcPrice : 0;

          return (
            <li
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#F9F4F3] rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Left side - logo and asset */}
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                <img
                  src={`/logos/${assetSymbol.toLowerCase()}.png`}
                  alt={item.asset.name}
                  className="w-6 h-6"
                  onError={(e) => (e.currentTarget.src = "/logos/default.png")}
                />
                <div>
                  <p className="text-lg sm:text-xl font-semibold text-[#6B4C3B]">
                    {assetSymbol}
                  </p>
                  <p className="text-sm text-gray-600">{item.asset.name}</p>
                </div>
              </div>

              {/* Right side - balance and values */}
              <div className="text-right">
                <p className="text-md sm:text-lg font-medium text-[#A2574F]">
                  Balance: <span className="font-bold">{item.balance}</span>
                </p>
                {assetPrice > 0 && (
                  <>
                    <p className="text-sm text-gray-700">
                      ≈ ${(usdValue).toFixed(2)} USD
                    </p>
                    {btcPrice > 0 && (
                      <p className="text-sm text-gray-500">
                        ≈ {btcEquivalent.toFixed(6)} BTC
                      </p>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Portfolio;