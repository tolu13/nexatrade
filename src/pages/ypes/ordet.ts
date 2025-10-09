export interface Order {
    id: string;
    userId: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    timestamp: Date;
    status: 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED';
    pairId: string;
    type: 'MARKET' | 'LIMIT';
  }
  
  export interface Trade {
    buyOrderId: string;
    sellOrderId: string;
    price: number;
    quantity: number;
    timestamp: Date;
    buyerId: string;
    sellerId: string;
    pairId: string;
  }
  
  export interface OrderBookUpdate {
    buyOrders: Order[];
    sellOrders: Order[];
    lastPrice: number;
  }
  
  export interface MarketPriceUpdate {
    pairId: string;
    price: number;
  }
  
  export interface PlaceOrderPayload {
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    type: 'MARKET' | 'LIMIT';
    pairId: string;
    timestamp: Date;
  }
  
  export type TradeMatchedPayload = Trade