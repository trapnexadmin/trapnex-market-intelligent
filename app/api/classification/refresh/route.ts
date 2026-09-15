import {NextResponse} from "next/server";
import {validateRefresh} from "@/lib/classification/refresh";
import {replaceClassifications} from "@/lib/classification/registry";
import type {InstrumentClassification} from "@/lib/classification/types";
import {persistClassificationSnapshot} from "@/lib/classification/supabase";

export const runtime="nodejs";

export async function POST(request:Request){
  try{
    const body=await request.json();
    const rows=Array.isArray(body.rows)?body.rows as InstrumentClassification[]:[];
    const source=String(body.source??"");
    const effectiveDate=body.effectiveDate?String(body.effectiveDate):null;
    const result=validateRefresh(rows,source,effectiveDate);

    let persisted=false;
    if(result.status==="READY"){
      replaceClassifications(rows);
      try{
        persisted=await persistClassificationSnapshot(rows);
      }catch(error){
        result.errors.push(error instanceof Error?error.message:"CLASSIFICATION_PERSISTENCE_ERROR");
      }
    }

    return NextResponse.json({...result,persisted},{status:result.status==="READY"?200:422});
  }catch(error){
    return NextResponse.json({
      status:"REJECTED",accepted:0,rejected:0,source:"",effectiveDate:null,
      errors:[error instanceof Error?error.message:"INVALID_REFRESH_PAYLOAD"],
    },{status:400});
  }
}
