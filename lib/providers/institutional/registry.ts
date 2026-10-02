import type { InstitutionalFlowProvider } from "./types";
import { getNseInstitutionalFlow } from "./nse";

const providers: InstitutionalFlowProvider[] = [
  {
    name: "NSE Institutional Flow",
    priority: 10,
    async health() {
      if (process.env.NSE_INSTITUTIONAL_API_ENABLED !== "true") {
        return {
          provider: this.name,
          status: "NOT_CONFIGURED" as const,
          message: "Enable NSE institutional ingestion explicitly.",
        };
      }
      try {
        await getNseInstitutionalFlow();
        return { provider: this.name, status: "READY" as const };
      } catch (error) {
        return {
          provider: this.name,
          status: "ERROR" as const,
          message: error instanceof Error ? error.message : "NSE flow error",
        };
      }
    },
    async getFlow(symbol) {
      return getNseInstitutionalFlow(symbol);
    },
  },
].sort((a, b) => a.priority - b.priority);

export async function resolveInstitutionalFlow(symbol?: string) {
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      const result = await provider.getFlow(symbol);
      if (result) return { ...result, errors };
    } catch (error) {
      errors.push(
        `${provider.name}: ${error instanceof Error ? error.message : "unknown institutional-flow error"}`,
      );
    }
  }

  return {
    provider: null,
    asOf: null,
    snapshot: {
      fiiNet: null,
      diiNet: null,
      deliveryRatio: null,
      institutionalOwnershipChange: null,
    },
    raw: null,
    errors,
  };
}

export async function getInstitutionalProviderHealth() {
  return Promise.all(providers.map((provider) => provider.health()));
}
