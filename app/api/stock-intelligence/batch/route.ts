import { NextRequest, NextResponse } from "next/server";
import {
  runStockIntelligenceBatch,
} from "@/lib/stock-intelligence/batch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw =
    request.nextUrl.searchParams.get("symbols");

  const symbols = raw
    ? raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  try {
    const result = await runStockIntelligenceBatch({
      symbols,
      persist:
        request.nextUrl.searchParams.get(
          "persist",
        ) !== "false",
      concurrency: Number(
        request.nextUrl.searchParams.get(
          "concurrency",
        ) ?? 4,
      ),
    });

    return NextResponse.json({
      status: result.readyCount
        ? "READY"
        : "INSUFFICIENT_DATA",
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "PROVIDER_ERROR",
        error:
          error instanceof Error
            ? error.message
            : "BATCH_ERROR",
      },
      { status: 503 },
    );
  }
}
