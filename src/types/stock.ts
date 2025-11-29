export interface Stock {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface Sector {
  id: string;
  name: string;
  description: string;
  leadingStocks: Stock[];
  totalVolume: number;
  totalMarketCap: number;
}
