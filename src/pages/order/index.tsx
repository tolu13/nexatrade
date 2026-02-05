// src/components/OrderForm.tsx
import React, { useState } from 'react';
import { useOrderBookStore } from '../../orderbooksocket';

export const OrderForm: React.FC = () => {
  const { placeOrder, selectedPairId } = useOrderBookStore();
  const [order, setOrder] = useState({
    type: 'LIMIT' as 'MARKET' | 'LIMIT',
    side: 'BUY' as 'BUY' | 'SELL',
    price: 0,
    quantity: 0,
   // pairId: '' // Match your backend pairId
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPairId) {
      alert("No trading pair selected");
      return;
    }

    placeOrder({
      ...order,
      pairId: selectedPairId || '', // Use selected pairId from store
      timestamp: new Date()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Order Type</label>
          <select 
            value={order.type}
            onChange={e => setOrder({...order, type: e.target.value as 'MARKET' | 'LIMIT'})}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="LIMIT">Limit</option>
            <option value="MARKET">Market</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Side</label>
          <select 
            value={order.side}
            onChange={e => setOrder({...order, side: e.target.value as 'BUY' | 'SELL'})}
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </div>
      </div>

      {order.type === 'LIMIT' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
          <input
            type="number"
            value={order.price}
            onChange={e => setOrder({...order, price: parseFloat(e.target.value)})}
            placeholder="Enter price"
            className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            min="0"
            step="0.01"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
        <input
          type="number"
          value={order.quantity}
          onChange={e => setOrder({...order, quantity: parseFloat(e.target.value)})}
          placeholder="Enter quantity"
          className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          min="0"
          step="0.01"
        />
      </div>

      <button 
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-md transition duration-200 mt-4"
      >
        Place {order.side} Order
      </button>
    </form>
  );
};