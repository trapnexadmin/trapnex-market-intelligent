"use client";
import {useEffect,useState} from "react";
export default function SectorPulsePage(){
  const [items,setItems]=useState<any[]>([]);
  useEffect(()=>{Promise.all(["BANK","IT","PHARMA","AUTO","ENERGY"].map(s=>fetch(`/api/market/sector-pulse?sector=${encodeURIComponent(s)}`,{cache:"no-store"}).then(r=>r.json()).then(d=>({sector:s,...d})).catch(()=>({sector:s,status:"UNAVAILABLE"})))).then(setItems)},[]);
  return <main className="page-shell"><div className="page-header"><span>TERMINAL · SECTORS</span><h1>Sector Pulse</h1><p>Relative sector strength foundation.</p></div><section className="page-card">{items.map(item=><div key={item.sector}><strong>{item.sector}</strong><span> {item.pulse?.score??"—"} · {item.pulse?.direction??item.status}</span></div>)}</section></main>;
}
