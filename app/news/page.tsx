"use client";

import { useEffect, useState } from "react";

type Event = { id:string; headline:string; summary:string|null; url:string|null; riskScore:number|null; newsScore:number|null; reasons:string[] };

export default function NewsPage() {
  const [scope,setScope]=useState("INDIA");
  const [events,setEvents]=useState<Event[]>([]);
  const [status,setStatus]=useState("LOADING");

  useEffect(()=>{
    let active=true;
    fetch(`/api/market-news?scope=${scope}`,{cache:"no-store"})
      .then(r=>r.json())
      .then(data=>{
        if(!active)return;
        setEvents(data.events??[]);
        setStatus(data.status??"UNAVAILABLE");
      })
      .catch(()=>active&&setStatus("UNAVAILABLE"));
    return()=>{active=false};
  },[scope]);

  return <main className="page-shell">
    <div className="page-header">
      <span>INTELLIGENCE · NEWS</span>
      <h1>News Center</h1>
      <p>India and global market news with AI-assisted event scoring.</p>
      <div>
        <button onClick={()=>setScope("INDIA")}>India</button>
        <button onClick={()=>setScope("GLOBAL")}>Global</button>
        <strong>{status}</strong>
      </div>
    </div>
    <section className="page-card">
      {events.map(event=><article key={event.id} className="news-item">
        <div><b>{event.headline}</b><p>{event.summary??"No summary supplied."}</p><small>{event.reasons.join(" · ")}</small></div>
        <aside><small>News {event.newsScore??"—"}</small><small>Risk {event.riskScore??"—"}</small>{event.url?<a href={event.url} target="_blank" rel="noreferrer">Source ↗</a>:null}</aside>
      </article>)}
    </section>
  </main>;
}
