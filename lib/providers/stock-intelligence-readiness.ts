import { getProviderHealth } from "./registry";
import { getHistoricalProviderHealth } from "./historical-registry";
import { getFundamentalProviderHealth } from "./fundamentals/registry";
import { getInstitutionalProviderHealth } from "./institutional/registry";

export type DependencyStatus = "READY" | "ERROR" | "NOT_CONFIGURED";

function statusOf(rows: Array<{ status: DependencyStatus }>): DependencyStatus {
  if (rows.some((row) => row.status === "ERROR")) return "ERROR";
  if (rows.length && rows.every((row) => row.status === "READY")) return "READY";
  return "NOT_CONFIGURED";
}

export async function getStockIntelligenceReadiness() {
  const [market, historical, fundamentals, institutional] =
    await Promise.all([
      getProviderHealth(),
      getHistoricalProviderHealth(),
      getFundamentalProviderHealth(),
      getInstitutionalProviderHealth(),
    ]);

  const marketStatus = statusOf(market);
  const historicalStatus = statusOf(historical);
  const fundamentalsStatus = statusOf(fundamentals);
  const institutionalStatus = statusOf(institutional);

  // Institutional data is optional because the current pipeline can
  // calculate a score without it. Historical data is required by the
  // technical factor, while market data is required for market pulse.
  const ready =
    historicalStatus === "READY" &&
    marketStatus !== "NOT_CONFIGURED";

  return {
    status: ready
      ? "READY"
      : [marketStatus, historicalStatus, fundamentalsStatus, institutionalStatus]
          .includes("ERROR")
        ? "DEGRADED"
        : "NOT_CONFIGURED",
    dependencies: {
      market: marketStatus,
      historical: historicalStatus,
      fundamentals: fundamentalsStatus,
      institutional: institutionalStatus,
    },
    required: {
      market: true,
      historical: true,
      fundamentals: false,
      institutional: false,
    },
    providers: {
      market,
      historical,
      fundamentals,
      institutional,
    },
    checkedAt: new Date().toISOString(),
  };
}
