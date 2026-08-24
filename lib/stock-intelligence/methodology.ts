export const STOCK_INTELLIGENCE_METHODOLOGY = {
  fundamentalQuality: {
    weight: 25,
    inputs: [
      "revenue growth",
      "earnings growth",
      "ROE/ROCE",
      "debt quality",
      "cash-flow quality",
      "profit consistency",
    ],
  },
  technicalStructure: {
    weight: 20,
    inputs: [
      "trend",
      "moving-average structure",
      "momentum",
      "support/resistance",
      "volume confirmation",
    ],
  },
  valuation: {
    weight: 10,
    inputs: [
      "P/E",
      "P/B",
      "EV/EBITDA",
      "growth-adjusted valuation",
      "historical valuation range",
    ],
  },
  institutionalFlow: {
    weight: 15,
    inputs: [
      "FII/DII activity where available",
      "delivery/volume behavior",
      "institutional ownership changes",
    ],
  },
  sectorAlignment: {
    weight: 10,
    inputs: ["sector pulse", "sector relative strength", "market-cap pulse"],
  },
  newsEvent: {
    weight: 10,
    inputs: [
      "materiality",
      "sentiment",
      "event direction",
      "earnings/corporate catalyst",
    ],
  },
  riskTrapShield: {
    weight: 10,
    inputs: [
      "governance risk",
      "leverage risk",
      "liquidity risk",
      "abnormal price/volume",
      "regulatory/event risk",
    ],
  },
} as const;
