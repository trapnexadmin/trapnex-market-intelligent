import { NextResponse } from "next/server";
import { resolveQuotes } from "@/lib/providers/registry";
import { validateQuotes } from "@/lib/market-data/quality";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const symbols = Array.isArray(body.symbols)
      ? body.symbols
          .map((x: unknown) => String(x).trim().toUpperCase())
          .filter(Boolean)
      : [];
    if (!symbols.length)
      return NextResponse.json(
        { status: "REJECTED", error: "SYMBOLS_REQUIRED" },
        { status: 400 },
      );
    const result = await resolveQuotes(symbols);
    const quality = validateQuotes(result.quotes);
    return NextResponse.json({
      status: quality.accepted.length ? "READY" : "INSUFFICIENT_DATA",
      provider: result.provider,
      fallbackUsed: result.fallbackUsed,
      quotes: quality.accepted,
      rejected: quality.rejected,
      errors: result.errors,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "PROVIDER_ERROR",
        error: error instanceof Error ? error.message : "QUOTE_ERROR",
      },
      { status: 503 },
    );
  }
}
