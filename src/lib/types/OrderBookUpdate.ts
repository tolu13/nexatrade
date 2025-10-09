import type { OrderBook } from "./OrderBook";

export interface OrderBookUpdate {
  pairId: string;
  symbol: string;
  orderBook: OrderBook;
}