export interface RankedOpportunity {
  symbol: string;
  score: number | null;
  decision: string;
  completenessPct: number;
  eligible: boolean;
  rank: number | null;
  reasons: string[];
}

export function rankOpportunities(
  rows: RankedOpportunity[],
): RankedOpportunity[] {
  const eligible = rows
    .filter((row) => row.eligible && row.score !== null)
    .sort((a, b) => (b.score ?? -Infinity) - (a.score ?? -Infinity));

  const rankBySymbol = new Map(
    eligible.map((row, index) => [row.symbol.toUpperCase(), index + 1]),
  );

  return rows
    .map((row) => ({
      ...row,
      rank: rankBySymbol.get(row.symbol.toUpperCase()) ?? null,
    }))
    .sort((a, b) => {
      if (a.rank === null && b.rank === null) return 0;
      if (a.rank === null) return 1;
      if (b.rank === null) return -1;
      return a.rank - b.rank;
    });
}
