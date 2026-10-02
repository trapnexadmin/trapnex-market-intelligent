import type { StockIntelligenceScore } from "../types";

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

export interface FactorSnapshot {
  runId: string;
  symbol: string;
  calculatedAt: string;
  score: number | null;
  status: string;
  confidence: number;
  factors: StockIntelligenceScore["factors"];
  metadata: Record<string, unknown>;
}

export async function persistFactorSnapshot(snapshot: FactorSnapshot) {
  const c = config();
  if (!c) return false;

  const response = await fetch(
    `${c.url}/rest/v1/stock_intelligence_run_factor_snapshots`,
    {
      method: "POST",
      headers: {
        apikey: c.key,
        Authorization: `Bearer ${c.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        run_id: snapshot.runId,
        symbol: snapshot.symbol,
        calculated_at: snapshot.calculatedAt,
        score: snapshot.score,
        status: snapshot.status,
        confidence: snapshot.confidence,
        factors: snapshot.factors,
        metadata: snapshot.metadata,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `SUPABASE_FACTOR_SNAPSHOT_${response.status}`,
    );
  }

  return true;
}

export async function persistRunSummary(input: {
  runId: string;
  startedAt: string;
  completedAt: string;
  universeSize: number;
  readyCount: number;
  insufficientCount: number;
  errorCount: number;
}) {
  const c = config();
  if (!c) return false;

  const response = await fetch(
    `${c.url}/rest/v1/stock_intelligence_runs`,
    {
      method: "POST",
      headers: {
        apikey: c.key,
        Authorization: `Bearer ${c.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        run_id: input.runId,
        started_at: input.startedAt,
        completed_at: input.completedAt,
        universe_size: input.universeSize,
        ready_count: input.readyCount,
        insufficient_count: input.insufficientCount,
        error_count: input.errorCount,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`SUPABASE_STOCK_RUN_${response.status}`);
  }

  return true;
}
