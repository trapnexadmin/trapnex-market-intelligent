import type { Opportunity } from "./types";

export function rankOpportunities(opportunities: Opportunity[]) {
  return [...opportunities]
    .filter((item) => item.score !== null)
    .sort((a, b) => {
      const scoreDiff = (b.score ?? -1) - (a.score ?? -1);
      if (scoreDiff !== 0) return scoreDiff;

      const returnDiff =
        (b.expectedReturnPct ?? -Infinity) -
        (a.expectedReturnPct ?? -Infinity);
      if (returnDiff !== 0) return returnDiff;

      return (b.confidence ?? 0) - (a.confidence ?? 0);
    });
}
