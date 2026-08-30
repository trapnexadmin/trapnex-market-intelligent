"use client";
import {useEffect,useState} from "react";
import OpportunityTable from "@/components/opportunities/OpportunityTable";

export default function OpportunitiesPage(){
  const [items,setItems]=useState<any[]>([]);
  const [status,setStatus]=useState("LOADING");

  useEffect(()=>{
    fetch("/api/opportunities?symbol=RELIANCE",{cache:"no-store"})
      .then(r=>r.json())
      .then(data=>{setItems(data.ranked??(data.opportunity?[data.opportunity]:[]));setStatus(data.status??"UNAVAILABLE")})
      .catch(()=>setStatus("UNAVAILABLE"));
  },[]);

  return <main className="page-shell">
    <div className="page-header">
      <span>DISCOVER · OPPORTUNITIES</span>
      <h1>Opportunity Engine</h1>
      <p>Strict risk-adjusted screening for 10%+ expected-return candidates.</p>
      <strong>{status}</strong>
    </div>
    <section className="page-card">
      {items.length?<OpportunityTable items={items}/>:<p>No verified opportunity candidate is available.</p>}
    </section>
  </main>
}
