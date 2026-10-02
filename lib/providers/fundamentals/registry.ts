import { getUpstoxFundamentals } from "@/lib/providers/upstox/fundamentals";
import type { FundamentalDataProvider, FundamentalProviderResult } from "./types";

const providers: FundamentalDataProvider[] = [
  {
    name: "Upstox Fundamentals",
    priority: 10,
    async health() {
      if (!process.env.UPSTOX_ACCESS_TOKEN) return { provider: this.name, status: "NOT_CONFIGURED" as const, message: "UPSTOX_ACCESS_TOKEN is missing" };
      try { return { provider: this.name, status: "READY" as const }; }
      catch (e) { return { provider: this.name, status: "ERROR" as const, message: e instanceof Error ? e.message : "error" }; }
    },
    async getFundamentals({ isin }) { return getUpstoxFundamentals(isin); },
  },
].sort((a,b)=>a.priority-b.priority);

export async function resolveFundamentals(input:{symbol:string; isin:string}) {
  const errors:string[]=[];
  for (const provider of providers) {
    try {
      const result = await provider.getFundamentals(input);
      if (result) return { ...result, errors };
    } catch (e) {
      errors.push(`${provider.name}: ${e instanceof Error ? e.message : "unknown provider error"}`);
    }
  }
  return { provider:null, asOf:null, fundamentals:null, valuation:null, institutionalFlow:null, errors };
}

export async function getFundamentalProviderHealth(){ return Promise.all(providers.map(p=>p.health())); }
