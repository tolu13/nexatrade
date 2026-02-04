import { useEffect, useState } from "react";
import { useAuthStore } from "../../lib/store/authstore";
import axios from "axios";

interface Order {
  id: string;
  pairId: string;
  symbol: string;
  type: string;
  side: string;
  price: number | null;
  quantity: number;
  filled: number;
  status: string;
  createdAt: string;
}

export const Transactions = () => {
  const token = useAuthStore((state) => state.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get("https://server-z0rg.onrender.com/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#A2574F] mb-6 border-b-2 border-[#A2574F] pb-2">
        My Transactions
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pair
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Side
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filled
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 flex items-center gap-2">
                    <img
                      src={`/logos/${order.symbol.split("/")[0].toLowerCase()}.png`}
                      alt={order.symbol}
                      className="w-5 h-5"
                      onError={(e) =>
                        (e.currentTarget.src = "/logos/default.png")
                      }
                    />
                    <span className="font-semibold">{order.symbol}</span>
                  </td>
                  <td className="px-4 py-2">{order.type}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      order.side === "BUY" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {order.side}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {order.price ? `$${order.price.toFixed(2)}` : "Market"}
                  </td>
                  <td className="px-4 py-2 text-right">{order.quantity}</td>
                  <td className="px-4 py-2 text-right">{order.filled}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "FILLED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "OPEN"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
