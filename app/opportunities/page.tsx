"use client";

import { useEffect, useState } from "react";
import OpportunityCard from "@/components/opportunities/OpportunityCard";

type Opportunity = {
  symbol: string;
  score: number | null;
  expectedReturnPct: number | null;
  downsidePct: number | null;
  riskReward: number | null;
  decision: string;
  confidence: number;
  reasons: string[];
};

export default function OpportunitiesPage() {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [status, setStatus] = useState("LOADING");

  useEffect(() => {
    fetch("/api/opportunities?symbol=RELIANCE", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setOpportunity(data.opportunity ?? null);
        setStatus(data.status ?? "UNAVAILABLE");
      })
      .catch(() => setStatus("UNAVAILABLE"));
  }, []);

  return (
    <main className="page-shell">
      <div className="page-header">
        <span>DISCOVER · OPPORTUNITIES</span>
        <h1>Opportunity Engine</h1>
        <p>Risk-adjusted candidates targeting 10%+ expected return.</p>
        <strong>{status}</strong>
      </div>
      {opportunity ? <OpportunityCard opportunity={opportunity} /> : null}
    </main>
  );
}
