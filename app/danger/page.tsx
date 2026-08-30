"use client";

import { useEffect, useState } from "react";

export default function DangerPage() {
  const [data,setData]=useState<any>(null);

  useEffect(()=>{
    fetch("/api/danger?scope=MARKET",{cache:"no-store"})
      .then(r=>r.json())
      .then(setData)
      .catch(()=>setData({status:"UNAVAILABLE"}));
  },[]);

  return <main className="page-shell">
    <div className="page-header">
      <span>INTELLIGENCE · RISK</span>
      <h1>Danger Radar</h1>
      <p>Market-wide risk events and AI-assisted impact analysis.</p>
    </div>
    <section className="page-card">
      <h2>{data?.danger?.level ?? data?.status ?? "LOADING"}</h2>
      <strong>{data?.danger?.score ?? "—"}</strong>
      {data?.danger?.reasons?.map((reason:string,index:number)=><p key={`${index}-${reason}`}>{reason}</p>)}
    </section>
  </main>;
}
