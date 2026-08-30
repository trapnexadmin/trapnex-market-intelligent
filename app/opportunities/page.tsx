"use client";

import {useEffect,useState} from "react";
import OpportunityTable from "@/components/opportunities/OpportunityTable";

export default function OpportunitiesPage(){
  const [items,setItems]=useState<any[]>([]);
  const [status,setStatus]=useState("LOADING");
  useEffect(()=>{
    fetch("/api/opportunities",{cache:"no-store"})
      .then(r=>r.json())
      .then(data=>{setItems(data.ranked??[]);setStatus(data.status??"UNAVAILABLE")})
      .catch(()=>setStatus("UNAVAILABLE"));
  },[]);
  return <main className="page-shell">
    <div className="page-header">
      <span>DISCOVER · OPPORTUNITIES</span>
      <h1>Opportunity Engine</h1>
      <p>India universe screening with a strict 10%+ opportunity gate.</p>
      <strong>{status}</strong>
    </div>
    <section className="page-card">
      {items.length?<OpportunityTable items={items}/>:<p>No verified candidates yet. The engine will not invent scores or returns.</p>}
    </section>
  </main>
}
