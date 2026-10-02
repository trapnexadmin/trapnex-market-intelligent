import {
  buildCompleteStockIntelligence,
} from "./integration/complete-engine";
import {
  persistFactorSnapshot,
  persistRunSummary,
} from "./integration/snapshot-store";
import { listUniverse } from "@/lib/universe/registry";
import { ensureUniverseLoaded } from "@/lib/universe/bootstrap";

export interface StockIntelligenceBatchOptions {
  symbols?: string[];
  concurrency?: number;
  persist?: boolean;
  marketPulse?: number | null;
  capPulseResolver?: (
    symbol: string,
  ) => Promise<number | null>;
  sectorPulseResolver?: (
    symbol: string,
  ) => Promise<number | null>;
}

function chunk<T>(rows: T[], size: number) {
  const output: T[][] = [];
  for (let i = 0; i < rows.length; i += size) {
    output.push(rows.slice(i, i + size));
  }
  return output;
}

export async function runStockIntelligenceBatch(
  options: StockIntelligenceBatchOptions = {},
) {
  await ensureUniverseLoaded();

  const universe = listUniverse().filter(
    (row) => row.exchange === "NSE",
  );

  const symbols = options.symbols?.length
    ? [...new Set(
        options.symbols
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean),
      )]
    : universe.map((row) => row.symbol);

  const concurrency = Math.max(
    1,
    Math.min(options.concurrency ?? 4, 10),
  );

  const runId = crypto.randomUUID();
  const startedAt = new Date().toISOString();
  const results: Awaited<
    ReturnType<typeof buildCompleteStockIntelligence>
  >[] = [];

  for (const group of chunk(symbols, concurrency)) {
    const settled = await Promise.all(
      group.map(async (symbol) => {
        try {
          const capPulse = options.capPulseResolver
            ? await options.capPulseResolver(symbol)
            : null;

          const sectorPulse = options.sectorPulseResolver
            ? await options.sectorPulseResolver(symbol)
            : null;

          return await buildCompleteStockIntelligence(
            symbol,
            {
              marketPulse: options.marketPulse ?? null,
              capPulse,
              sectorPulse,
            },
          );
        } catch (error) {
          return {
            symbol,
            score: null,
            status: "INSUFFICIENT_DATA" as const,
            confidence: 0,
            factors: [],
            calculatedAt: new Date().toISOString(),
            quote: null,
            marketDataProvider: null,
            historicalProvider: null,
            fundamentalProvider: null,
            instrumentToken: null,
            errors: [
              error instanceof Error
                ? error.message
                : "BATCH_SYMBOL_ERROR",
            ],
            dataCompleteness: {
              quote: false,
              historicalCandles: false,
              fundamentals: false,
              valuation: false,
              institutionalFlow: false,
            },
          };
        }
      }),
    );

    results.push(...settled);
  }

  const readyCount = results.filter(
    (row) => row.status === "READY",
  ).length;
  const insufficientCount =
    results.length - readyCount;
  const errorCount = results.filter(
    (row) => row.errors.length > 0,
  ).length;
  const completedAt = new Date().toISOString();

  if (options.persist) {
    const metadata = {
      universeSize: symbols.length,
      marketPulse: options.marketPulse ?? null,
    };

    await Promise.all(
      results.map((row) =>
        persistFactorSnapshot({
          runId,
          symbol: row.symbol,
          calculatedAt: row.calculatedAt,
          score: row.score,
          status: row.status,
          confidence: row.confidence,
          factors: row.factors,
          metadata,
        }).catch(() => false),
      ),
    );

    await persistRunSummary({
      runId,
      startedAt,
      completedAt,
      universeSize: symbols.length,
      readyCount,
      insufficientCount,
      errorCount,
    }).catch(() => false);
  }

  return {
    runId,
    startedAt,
    completedAt,
    universeSize: symbols.length,
    readyCount,
    insufficientCount,
    errorCount,
    results,
  };
}
