"use client";
import {useEffect,useState} from "react";
export default function MarketBreadthPage(){
  const [data,setData]=useState<any>(null);
  useEffect(()=>{fetch("/api/market/pulse",{cache:"no-store"}).then(r=>r.json()).then(setData).catch(()=>setData({status:"UNAVAILABLE"}))},[]);
  return <main className="page-shell"><div className="page-header"><span>TERMINAL · BREADTH</span><h1>Market Breadth</h1><p>Participation component of NIFTY Trend Pulse.</p></div><section className="page-card"><strong>Advancers / Decliners</strong><p>{data?.pulse?.factors?.find((x:any)=>x.key==="breadth")?.score??"—"}</p></section></main>;
}
