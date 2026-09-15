import { NextResponse } from "next/server";
import { deduplicateUniverse, normalizeUniverseRow } from "@/lib/universe/normalize";
import { validateUniverse } from "@/lib/universe/validation";
import { replaceUniverse } from "@/lib/universe/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!Array.isArray(body.rows)) {
      return NextResponse.json(
        { status: "REJECTED", error: "ROWS_ARRAY_REQUIRED" },
        { status: 400 },
      );
    }

    const normalized = deduplicateUniverse(
      body.rows.map((row: any) =>
        normalizeUniverseRow({
          ...row,
          source: row.source ?? body.source,
          effectiveDate: row.effectiveDate ?? body.effectiveDate ?? null,
        }),
      ),
    );

    const validation = validateUniverse(normalized);

    if (!validation.valid) {
      return NextResponse.json(
        { status: "REJECTED", ...validation },
        { status: 422 },
      );
    }

    replaceUniverse(normalized);

    return NextResponse.json({
      status: "READY",
      count: normalized.length,
      active: normalized.filter((row) => row.active && row.listed).length,
      validation,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "REJECTED",
        error: error instanceof Error ? error.message : "UNIVERSE_REFRESH_ERROR",
      },
      { status: 400 },
    );
  }
}
