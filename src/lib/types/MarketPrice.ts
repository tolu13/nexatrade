export interface MarketPrice {
  pairId: string;
  symbol: string;
  price: number;
  change?: number;
  volume?: number;
  history?: number[];
}