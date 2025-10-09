// src/orderbooksocket.ts
import { create } from "zustand";
import  io  from "socket.io-client";
import { useAuthStore } from "./lib/store/authstore";
import type { PlaceOrderPayload } from "./lib/types/PlacdeOrderPayload";
import type { MarketPrice } from "./lib/types/MarketPrice";
import type { OrderBookUpdate } from "./lib/types/OrderBookUpdate";
import type { TradeMatched } from "./lib/types/TradeMatched";
import type { TradingPair } from "./lib/types/tradingpair";

/** --- Zustand store state --- **/
interface OrderBookState {
    socket: SocketIOClient.Socket | null;
  connected: boolean;
  markets: Record<string, MarketPrice>; // ✅ NEW: store for live prices
tradingpairs: TradingPair[];

  connect: () => void;
  disconnect: () => void;
  isConnected: () => boolean;

  // Event listeners
  onOrderBookUpdate: (callback: (update: OrderBookUpdate) => void) => () => void;
  onMarketPriceUpdate: (callback: (price: MarketPrice) => void) => () => void;
  onTradeMatched: (callback: (trade: TradeMatched) => void) => () => void;

  // Actions
  placeOrder: (order: PlaceOrderPayload) => void;
}

/** --- Zustand store implementation --- **/
export const useOrderBookStore = create<OrderBookState>((set, get) => ({
  socket: null,
  connected: false,
  markets: {}, // ✅ initialize empty market list
  tradingpairs: [],

  connect: () => {
    const { token } = useAuthStore.getState();
    const { socket } = get();

    if (socket && socket.connected) return;

    const newSocket: SocketIOClient.Socket = io("http://localhost:5000/orderbook", {
      auth: { token },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      set({ connected: true });
      console.log("WebSocket connected:", newSocket.id);
    });
    newSocket.on("tradingpairs", (pairs: TradingPair[]) => {
      set({ tradingpairs: pairs });
      console.log("trading pairs", pairs )
});

    newSocket.on("disconnect", () => {
      set({ connected: false });
      console.log("WebSocket disconnected");
    });

    // ✅ Listen for live market updates and update store automatically
    newSocket.on("marketPriceUpdate", (data: MarketPrice) => {
      set((state) => ({
        markets: {
          ...state.markets,
          [data.pairId]: data,
        },
      }));
    });

    set({ socket: newSocket });
  },
  

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null, connected: false, markets: {} });
    }
  },

  isConnected: () => get().connected,

  /** --- Event listeners --- **/
  onOrderBookUpdate: (callback) => {
    const s = get().socket;
    if (!s) return () => {};
    const handler = (data: OrderBookUpdate) => callback(data);
    s.on("orderBookUpdate", handler);
    return () => s.off("orderBookUpdate", handler);
  },

  onMarketPriceUpdate: (callback) => {
    const s = get().socket;
    if (!s) return () => {};
    const handler = (data: MarketPrice) => callback(data);
    s.on("marketPriceUpdate", handler);
    return () => s.off("marketPriceUpdate", handler);
  },

  onTradeMatched: (callback) => {
    const s = get().socket;
    if (!s) return () => {};
    const handler = (trade: TradeMatched) => callback(trade);
    s.on("tradeMatched", handler);
    return () => s.off("tradeMatched", handler);
  },

  /** --- Place order --- **/
  placeOrder: (order) => {
    get().socket?.emit("placeOrder", order);
  },
}));
