import { create } from "zustand";

import api from "../api";

interface PortfolioItem {
  id: string;
  userId: string;
  assetId: string;
  balance: number;
  available: number;
  locked: number;
  updatedAt: string;
  createdAt: string;
  asset: {
    id: string;
    symbol: string;
    name: string;
    createdAt: string;
  };
}

interface PortfolioState {
  portfolio: PortfolioItem[];
  fetchPortfolio: (token: string) => Promise<void>;
}

const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: [],
  fetchPortfolio: async (token: string) => {
    try {
      const res = await api.get<PortfolioItem[]>(
        "/wallet/portfolio",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("portfolio data", res.data)
      set({ portfolio: res.data });
    } catch (error) {
      console.error("Failed to fetch portfolio", error);
    }
  },
}));

export default usePortfolioStore;
