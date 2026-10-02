import { getProviderHealth } from "./registry";
import { getHistoricalProviderHealth } from "./historical-registry";
import { getFundamentalProviderHealth } from "./fundamentals/registry";
import { getInstitutionalProviderHealth } from "./institutional/registry";
import { getMarketNewsContext } from "@/lib/news-intelligence/market-news";

export async function getProviderDiagnostics() {
  const [market, historical, fundamentals, institutional, marketNews] =
    await Promise.all([
      getProviderHealth(),
      getHistoricalProviderHealth(),
      getFundamentalProviderHealth(),
      getInstitutionalProviderHealth(),
      getMarketNewsContext(),
    ]);

  const statuses = [
    ...market.map((row) => row.status),
    ...historical.map((row) => row.status),
    ...fundamentals.map((row) => row.status),
    ...institutional.map((row) => row.status),
  ];

  const errors = [
    ...market.filter((row) => row.status === "ERROR"),
    ...historical.filter((row) => row.status === "ERROR"),
    ...fundamentals.filter((row) => row.status === "ERROR"),
    ...institutional.filter((row) => row.status === "ERROR"),
  ];

  return {
    status: errors.length
      ? "DEGRADED"
      : statuses.some((status) => status === "READY")
        ? "READY"
        : "NOT_CONFIGURED",
    market,
    historical,
    fundamentals,
    institutional,
    marketNews,
    checkedAt: new Date().toISOString(),
  };
}
