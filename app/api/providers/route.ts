import { NextResponse } from "next/server";
import { getProviderHealth } from "@/lib/providers/registry";

export async function GET() {
  return NextResponse.json({ providers: await getProviderHealth(), checkedAt: new Date().toISOString() });
}
