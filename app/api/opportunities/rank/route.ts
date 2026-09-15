import { NextResponse } from "next/server";
import { rankOpportunities } from "@/lib/universe/ranking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];

    const ranked = rankOpportunities(rows);

    return NextResponse.json({
      status: "READY",
      total: ranked.length,
      eligible: ranked.filter((row) => row.eligible).length,
      ranked,
      checkedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "REJECTED",
        error: "INVALID_RANKING_PAYLOAD",
      },
      { status: 400 },
    );
  }
}
