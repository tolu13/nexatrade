export interface Trade {
  pairId: string;
  price: number;
  quantity?: number;
  side?: "buy" | "sell";
}