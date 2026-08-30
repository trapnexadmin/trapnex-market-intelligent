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
      <h1>TRAPNEX Opportunity Engine</h1>
      <p>Risk-adjusted screening. 10%+ is a target threshold, not a guarantee.</p>
      <strong>{status}</strong>
    </div>
    <section className="page-card">
      {items.length
        ? <OpportunityTable items={items}/>
        : <p>No verified candidate is currently available.</p>}
    </section>
  </main>
}
