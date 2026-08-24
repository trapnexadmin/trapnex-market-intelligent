export interface SectorPulseInputRow {
  symbol: string;
  sector: string;
  price: number;
  previousClose: number | null;
  volume: number | null;
  averageVolume20: number | null;
  return5d: number | null;
  benchmarkReturn5d: number | null;
  newsScore: number | null;
  earningsScore: number | null;
}

export interface SectorPulse {
  sector: string;
  score: number | null;
  direction: "LEADING" | "IMPROVING" | "WEAKENING" | "LAGGING" | "INSUFFICIENT_DATA";
  breadth: number | null;
  momentum: number | null;
  volume: number | null;
  relativeStrength: number | null;
  news: number | null;
  earnings: number | null;
  confidence: number;
  total: number;
  calculatedAt: string;
}
