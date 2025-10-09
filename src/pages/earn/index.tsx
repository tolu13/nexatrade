import { useState, useEffect } from "react";
import { useOrderBookStore } from "../../orderbooksocket";
import { useAuthStore } from "../../lib/store/authstore";

interface EarnProduct {
  id: string;
  asset: string;
  apy: number;
  duration: string;
}

interface MyStake {
  id: string;
  asset: string;
  amount: number;
  apy: number;
  startDate: string;
  duration: string;
}

export const Earn = () => {
  const { onMarketPriceUpdate } = useOrderBookStore();
  const {user} = useAuthStore();
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [myStakes, setMyStakes] = useState<MyStake[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<EarnProduct | null>(
    null
  );
  const [stakeAmount, setStakeAmount] = useState<number>(0);

  const earnProducts: EarnProduct[] = [
    { id: "1", asset: "BTC", apy: 4.5, duration: "Flexible" },
    { id: "2", asset: "ETH", apy: 5.2, duration: "30 Days" },
    { id: "3", asset: "USDT", apy: 6.8, duration: "7 Days" },
  ];

  useEffect(() => {
    const unsubscribe = onMarketPriceUpdate((data) => {
      const base = data.symbol.split("/")[0];
      setPrices((prev) => ({ ...prev, [base]: data.price }));
    });
    return () => unsubscribe();
  }, [onMarketPriceUpdate]);

  const handleStake = () => {
    if (!selectedProduct || stakeAmount <= 0) return;
    const newStake: MyStake = {
      id: crypto.randomUUID(),
      asset: selectedProduct.asset,
      amount: stakeAmount,
      apy: selectedProduct.apy,
      startDate: new Date().toISOString(),
      duration: selectedProduct.duration,
    };
    setMyStakes([...myStakes, newStake]);
    setSelectedProduct(null);
    setStakeAmount(0);
  };

  const handleUnstake = (id: string) => {
    setMyStakes(myStakes.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#A2574F] mb-6 border-b-2 border-[#A2574F] pb-2">
        Earn
      </h2>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#F9F4F3] p-4 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Total Staked</h3>
          <p className="text-xl font-bold text-[#6B4C3B]">
            {myStakes.reduce((sum, s) => sum + s.amount, 0).toFixed(4)} USD
          </p>
        </div>
        <div className="bg-[#F9F4F3] p-4 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Estimated Rewards (Annual)</h3>
          <p className="text-xl font-bold text-[#6B4C3B]">
            {(
              myStakes.reduce(
                (sum, s) => sum + s.amount * (s.apy / 100),
                0
              ) || 0
            ).toFixed(4)}{" "}
            USD
          </p>
        </div>
        <div className="bg-[#F9F4F3] p-4 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Active Positions</h3>
          <p className="text-xl font-bold text-[#6B4C3B]">{myStakes.length}</p>
        </div>
      </div>

      {/* Available Earn Products */}
      <h3 className="text-lg font-bold mb-3 text-[#A2574F]">Available Earn Offers</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {earnProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={`/logos/${p.asset.toLowerCase()}.png`}
                alt={p.asset}
                className="w-6 h-6"
                onError={(e) => (e.currentTarget.src = "/logos/default.png")}
              />
              <span className="text-lg font-semibold">{p.asset}</span>
            </div>
            <p className="text-sm text-gray-600">APY: {p.apy}%</p>
            <p className="text-sm text-gray-600 mb-3">Duration: {p.duration}</p>
            <button
              onClick={() => setSelectedProduct(p)}
              className="w-full bg-[#A2574F] text-white py-2 rounded-lg hover:bg-[#8c4a40]"
            >
              Stake
            </button>
          </div>
        ))}
      </div>

      {/* My Stakings */}
      <h3 className="text-lg font-bold mb-3 text-[#A2574F]">My Stakings</h3>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F9F4F3] text-[#6B4C3B]">
            <tr>
              <th className="py-3 px-4 text-left">Asset</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">APY</th>
              <th className="py-3 px-4 text-left">Duration</th>
              <th className="py-3 px-4 text-left">Rewards (Est)</th>
              <th className="py-3 px-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {myStakes.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  No active stakes yet.
                </td>
              </tr>
            )}
            {myStakes.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="py-3 px-4 flex items-center gap-2">
                  <img
                    src={`/logos/${s.asset.toLowerCase()}.png`}
                    alt={s.asset}
                    className="w-5 h-5"
                    onError={(e) =>
                      (e.currentTarget.src = "/logos/default.png")
                    }
                  />
                  {s.asset}
                </td>
                <td className="py-3 px-4">{s.amount}</td>
                <td className="py-3 px-4">{s.apy}%</td>
                <td className="py-3 px-4">{s.duration}</td>
                <td className="py-3 px-4">
                  {(s.amount * (s.apy / 100)).toFixed(4)}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleUnstake(s.id)}
                    className="text-red-500 hover:underline"
                  >
                    Unstake
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stake Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-[#A2574F]">
              Stake {selectedProduct.asset}
            </h3>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="w-full border rounded-lg p-2 mb-4"
            />
            <div className="flex justify-between gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleStake}
                className="flex-1 py-2 bg-[#A2574F] text-white rounded-lg hover:bg-[#8c4a40]"
              >
                Confirm
              </button>
            </div>
            <div> 
                <p>{user ? user.email : ""} </p>
                <p>{prices.map}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earn;
