import { NextResponse } from "next/server";
import { deleteHolding, listHoldings, upsertHolding } from "@/lib/portfolio/persistence";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:Request){
  const url=new URL(request.url);
  const portfolioKey=(url.searchParams.get("portfolioKey")??"default").trim()||"default";
  try{
    const holdings=await listHoldings(portfolioKey);
    return NextResponse.json({status:"READY",portfolioKey,holdings,checkedAt:new Date().toISOString()});
  }catch(error){
    return NextResponse.json({status:"PERSISTENCE_ERROR",error:error instanceof Error?error.message:"PORTFOLIO_HOLDINGS_ERROR"},{status:503});
  }
}

export async function PUT(request:Request){
  try{
    const body=await request.json();
    const portfolioKey=String(body.portfolioKey??"default").trim()||"default";
    const symbol=String(body.symbol??"").trim().toUpperCase();
    const exchange=(String(body.exchange??"NSE").toUpperCase()==="BSE"?"BSE":"NSE") as "NSE"|"BSE";
    const quantity=Number(body.quantity);
    const averagePrice=Number(body.averagePrice);
    if(!symbol||!Number.isFinite(quantity)||quantity<0||!Number.isFinite(averagePrice)||averagePrice<0)
      return NextResponse.json({status:"REJECTED",error:"INVALID_HOLDING"},{status:400});
    if(quantity===0){
      await deleteHolding(portfolioKey,symbol,exchange);
      return NextResponse.json({status:"READY",deleted:true});
    }
    const result=await upsertHolding({portfolioKey,symbol,exchange,quantity,averagePrice,notes:typeof body.notes==="string"?body.notes:null});
    return NextResponse.json({status:"READY",holding:result?.[0]??null});
  }catch(error){
    return NextResponse.json({status:"PERSISTENCE_ERROR",error:error instanceof Error?error.message:"PORTFOLIO_HOLDING_SAVE_ERROR"},{status:503});
  }
}

export async function DELETE(request:Request){
  const url=new URL(request.url);
  const portfolioKey=(url.searchParams.get("portfolioKey")??"default").trim()||"default";
  const symbol=(url.searchParams.get("symbol")??"").trim().toUpperCase();
  const exchange=(String(url.searchParams.get("exchange")??"NSE").toUpperCase()==="BSE"?"BSE":"NSE") as "NSE"|"BSE";
  if(!symbol) return NextResponse.json({status:"REJECTED",error:"SYMBOL_REQUIRED"},{status:400});
  try{
    await deleteHolding(portfolioKey,symbol,exchange);
    return NextResponse.json({status:"READY"});
  }catch(error){
    return NextResponse.json({status:"PERSISTENCE_ERROR",error:error instanceof Error?error.message:"PORTFOLIO_HOLDING_DELETE_ERROR"},{status:503});
  }
}