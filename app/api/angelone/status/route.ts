import { NextResponse } from "next/server";
import { getAngelStreamManager } from "@/lib/providers/angelone/stream";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    provider: "Angel One SmartAPI",
    ...getAngelStreamManager().status(),
    checkedAt: new Date().toISOString(),
  });
}
