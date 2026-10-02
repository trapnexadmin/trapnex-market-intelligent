import { getNseCorporateActions } from "@/lib/providers/corporate-actions/nse";
import type { CorporateAction } from "@/lib/providers/corporate-actions/types";

export async function getCompanyCorporateActions(symbol: string): Promise<CorporateAction[]> {
  return getNseCorporateActions(symbol);
}

export function corporateActionRisk(actions: CorporateAction[]): number | null {
  if (!actions.length) return null;

  const weighted =
    actions.reduce((sum, action) => {
      const risk =
        action.type === "DEMERGER" || action.type === "RIGHTS"
          ? 55
          : action.type === "BUYBACK"
            ? 30
            : action.type === "BONUS" || action.type === "SPLIT"
              ? 15
              : 10;
      return sum + risk;
    }, 0) / actions.length;

  return Math.min(100, weighted);
}
