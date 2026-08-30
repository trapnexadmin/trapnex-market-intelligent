"use client";

import { useEffect, useState } from "react";
import OpportunityTable from "@/components/opportunities/OpportunityTable";

export default function OpportunitiesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState("LOADING");
  const [providerSummary, setProviderSummary] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/opportunities", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setItems(data.ranked ?? []);
        setProviderSummary(
          (data.ranked ?? []).map((item: any) => ({
            symbol: item.symbol,
            sources: item.sources ?? [],
            candleCount: item.technical?.candleCount ?? 0,
            entry: item.technical?.entry ?? null,
            stopLoss: item.technical?.stopLoss ?? null,
            target: item.technical?.target ?? null,
          })),
        );
        setStatus(data.status ?? "UNAVAILABLE");
      })
      .catch(() => setStatus("UNAVAILABLE"));
  }, []);

  return (
    <main className="page-shell">
      <div className="page-header">
        <span>DISCOVER · OPPORTUNITIES</span>
        <h1>Opportunity Engine</h1>
        <p>Real price/history context with strict 10%+ screening.</p>
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
        <h2>Technical data provenance</h2>
        {providerSummary.map((item) => (
          <div key={item.symbol}>
            <strong>{item.symbol}</strong>
            <span>
              {" "}
              {item.sources.join(", ") || "No source"} · {item.candleCount} candles
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
