import { NextRequest, NextResponse } from "next/server";
import { resolveQuotes, resolveIndices } from "@/lib/providers/registry";
import { reconcileQuotes, reconcileIndices } from "@/lib/market/reconciliation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbols = (request.nextUrl.searchParams.get("symbols") ?? "")
    .split(",").map(s => s.trim().toUpperCase()).filter(Boolean);
  const indexSymbols = (request.nextUrl.searchParams.get("indices") ?? "NIFTY 50,BANK NIFTY,SENSEX")
    .split(",").map(s => s.trim()).filter(Boolean);

  const [quotes, indices] = await Promise.all([
    resolveQuotes(symbols),
    resolveIndices(indexSymbols),
  ]);

  const reconciledQuotes = reconcileQuotes(quotes.quotes);
  const reconciledIndices = reconcileIndices(indices.indices);

  return NextResponse.json({
    status: reconciledQuotes.length || reconciledIndices.length ? "LIVE" : "INSUFFICIENT_DATA",
    quotes: reconciledQuotes,
    indices: reconciledIndices,
    providers: {
      quotes: quotes.provider,
      indices: indices.provider,
    },
    fallbackUsed: quotes.fallbackUsed || indices.fallbackUsed,
    errors: quotes.errors,
    checkedAt: new Date().toISOString(),
  }, { status: reconciledQuotes.length || reconciledIndices.length ? 200 : 503 });
}
