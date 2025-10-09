import type { Order } from "./Order";

export interface OrderBook {
  buyOrders: Order[];
  sellOrders: Order[];
  lastPrice: number;
}