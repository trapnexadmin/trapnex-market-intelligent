import { getProviderHealth } from "./registry";
import { getFundamentalProviderHealth } from "./fundamentals/registry";
import { getInstitutionalProviderHealth } from "./institutional/registry";

export async function getMarketCapabilityReport() {
  const [market, fundamentals, institutional] = await Promise.all([
    getProviderHealth(),
    getFundamentalProviderHealth(),
    getInstitutionalProviderHealth(),
  ]);

  const providers = [...market, ...fundamentals, ...institutional];
  const configured = providers.filter(
    (provider) => provider.status !== "NOT_CONFIGURED",
  ).length;
  const ready = providers.filter(
    (provider) => provider.status === "READY",
  ).length;
  const errors = providers.filter(
    (provider) => provider.status === "ERROR",
  ).length;

  return {
    status:
      errors > 0
        ? "DEGRADED"
        : ready > 0
          ? "READY"
          : "NOT_CONFIGURED",
    configured,
    ready,
    errors,
    providers,
    checkedAt: new Date().toISOString(),
  };
}
