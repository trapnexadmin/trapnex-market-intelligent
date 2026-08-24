export interface BreadthInputRow {
  symbol: string;
  price: number;
  previousClose: number | null;
  dma20: number | null;
  dma50: number | null;
  dma200: number | null;
  volume: number | null;
  averageVolume20: number | null;
}

export interface MarketBreadth {
  market: string;
  total: number;
  advancers: number;
  decliners: number;
  unchanged: number;
  advanceDeclineRatio: number | null;
  above20DmaPercent: number | null;
  above50DmaPercent: number | null;
  above200DmaPercent: number | null;
  volumeAdvancingPercent: number | null;
  breadthThrust: number | null;
  score: number | null;
  confidence: number;
  coverage: {
    price: number;
    dma20: number;
    dma50: number;
    dma200: number;
    volume: number;
  };
  status: "READY" | "INSUFFICIENT_DATA";
  calculatedAt: string;
}
