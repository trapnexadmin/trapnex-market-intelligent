"use client";

import { useEffect, useState } from "react";
import OpportunityTable from "@/components/opportunities/OpportunityTable";

export default function OpportunitiesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState("LOADING");

  useEffect(() => {
    fetch("/api/opportunities", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setItems(data.ranked ?? []);
        setStatus(data.status ?? "UNAVAILABLE");
      })
      .catch(() => setStatus("UNAVAILABLE"));
  }, []);

  return (
    <main className="page-shell">
      <div className="page-header">
        <span>DISCOVER · OPPORTUNITIES</span>
        <h1>Opportunity Engine</h1>
        <p>Live-provider aggregation with strict verified-data gating.</p>
        <strong>{status}</strong>
      </div>
      <section className="page-card">
        {items.length ? (
          <OpportunityTable items={items} />
        ) : (
          <p>No verified opportunity candidate is currently available.</p>
        )}
      </section>
    </main>
  );
}
