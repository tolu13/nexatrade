export interface Order {
    id: string;
    price: number;
    quantity: number;
    side: 'BUY' | 'SELL';
    userId: string;
    type: 'MARKET' | 'LIMIT';
    timestamp: string;   // converted to ISO string in frontend
    status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED'; // example statuses
    pairId: string;
  }
  
  export interface Trade {
    buyOrderId: string;
    sellOrderId: string;
    price: number;
    quantity: number;
    timestamp: string;  // ISO string format
    buyerId: string;
    sellerId: string;
    pairId: string;
  }
  
  export interface OrderBook {
    buyOrders: Order[];
    sellOrders: Order[];
    lastPrice: number;
    
  }
  
  export interface Candle {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: number;
  }
  