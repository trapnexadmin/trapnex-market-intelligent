import {NextResponse} from "next/server";
import {listClassifications} from "@/lib/classification/registry";

export const runtime="nodejs";

export async function GET(){
  const rows=listClassifications();
  const effectiveDates=[...new Set(rows.map(x=>x.effectiveDate).filter(Boolean))];
  return NextResponse.json({
    status:rows.length?"READY":"INSUFFICIENT_DATA",
    count:rows.length,
    effectiveDates,
    sources:[...new Set(rows.map(x=>x.source))],
    checkedAt:new Date().toISOString(),
  });
}
