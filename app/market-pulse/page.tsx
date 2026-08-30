"use client";
import {useEffect,useState} from "react";

export default function MarketPulsePage(){
  const [data,setData]=useState<any>(null);
  useEffect(()=>{fetch("/api/market/pulse",{cache:"no-store"}).then(r=>r.json()).then(setData).catch(()=>setData({status:"UNAVAILABLE"}))},[]);
  return <main className="page-shell">
    <div className="page-header"><span>TERMINAL · MARKET</span><h1>NIFTY Trend Pulse</h1><p>Market regime, breadth, momentum, volume and risk factors.</p></div>
    <section className="page-card"><strong>{data?.pulse?.direction??data?.status??"LOADING"}</strong><h2>{data?.pulse?.score??"—"}</h2></section>
  </main>;
}
