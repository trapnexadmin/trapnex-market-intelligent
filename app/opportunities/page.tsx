"use client";

import { useEffect, useState } from "react";
import OpportunityTable from "@/components/opportunities/OpportunityTable";

export default function OpportunitiesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState("LOADING");
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/opportunities", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setItems(data.ranked ?? []);
        setProviders(data.providerResults ?? []);
        setStatus(data.status ?? "UNAVAILABLE");
      })
      .catch(() => setStatus("UNAVAILABLE"));
  }, []);

  return (
    <main className="page-shell">
      <div className="page-header">
        <span>DISCOVER · OPPORTUNITIES</span>
        <h1>Opportunity Engine</h1>
        <p>Provider-backed, risk-adjusted screening for 10%+ opportunities.</p>
        <strong>{status}</strong>
      </div>

      <section className="page-card">
        {items.length ? (
          <OpportunityTable items={items} />
        ) : (
          <p>No verified opportunity candidate is currently available.</p>
        )}
      </section>

      <section className="page-card">
        <h2>Provider diagnostics</h2>
        {providers.map((item) => (
          <div key={item.symbol}>
            <strong>{item.symbol}</strong>
            <span>
              {" "}
              {item.sources?.length
                ? item.sources.join(", ")
                : "No normalized source"}
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
