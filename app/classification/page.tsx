"use client";
import {useEffect,useState} from "react";

export default function ClassificationPage(){
 const [data,setData]=useState<any>(null);
 useEffect(()=>{fetch("/api/classification/status",{cache:"no-store"}).then(r=>r.json()).then(setData).catch(()=>setData({status:"UNAVAILABLE"}))},[]);
 return <main className="page-shell">
  <div className="page-header"><span>TERMINAL · UNIVERSE</span><h1>Classification Status</h1><p>Validated cap and sector classification used by market intelligence.</p></div>
  <section className="page-card"><strong>{data?.status??"LOADING"}</strong><p>Constituents: {data?.count??"—"}</p><p>Sources: {data?.sources?.join(", ")||"—"}</p><p>Effective dates: {data?.effectiveDates?.join(", ")||"—"}</p></section>
 </main>
}