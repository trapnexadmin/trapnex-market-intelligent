import { NextRequest, NextResponse } from "next/server";
import { getAngelStreamManager } from "@/lib/providers/angelone/stream";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const manager = getAngelStreamManager();
  const body = await request.json().catch(() => ({}));

  try {
    await manager.start();

    if (body.exchange && Array.isArray(body.tokens) && body.tokens.length) {
      manager.subscribe(
        String(body.exchange).toUpperCase() as "NSE" | "NFO" | "BSE" | "BFO" | "MCX" | "NCX" | "CDE",
        body.tokens.map(String),
        Number(body.mode) || 1,
      );
    }

    return NextResponse.json({
      status: "READY",
      ...manager.status(),
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "ERROR",
      message: error instanceof Error ? error.message : "Stream start failed",
      ...manager.status(),
    }, { status: 503 });
  }
}

export async function DELETE() {
  const manager = getAngelStreamManager();
  await manager.stop();
  return NextResponse.json({ status: "STOPPED" });
}
