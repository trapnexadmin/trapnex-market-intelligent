import { NextResponse } from "next/server";
import { getProviderDiagnostics } from "@/lib/providers/diagnostics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getProviderDiagnostics();

  return NextResponse.json(result, {
    status: result.status === "READY" ? 200 : 503,
  });
}
