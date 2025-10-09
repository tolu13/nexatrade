export interface PlaceOrderPayload {
  type: "MARKET" | "LIMIT";
  side: "BUY" | "SELL";
  price: number;
  quantity: number;
  pairId: string;
  timestamp: Date;
}