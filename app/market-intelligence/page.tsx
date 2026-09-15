 "use client";

import { useEffect, useState } from "react";

export default function MarketIntelligencePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/market/pulse-unified", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ status: "UNAVAILABLE" }));
  }, []);

  const caps = data?.pulses?.capPulses ?? {};
  const sectors = data?.pulses?.sectorPulses ?? {};

  return (
    <main className="page-shell">
      <div className="page-header">
        <span>TERMINAL · MARKET INTELLIGENCE</span>
        <h1>Unified Market Pulses</h1>
        <p>NIFTY + Large/Mid/Small cap + sector regime view.</p>
        <strong>{data?.status ?? "LOADING"}</strong>
      </div>

      <section className="page-card">
        <h2>NIFTY</h2>
        <strong>{data?.pulses?.nifty?.score ?? "—"}</strong>
        <span> · {data?.pulses?.nifty?.direction ?? "—"}</span>
      </section>

      <section className="page-card">
        <h2>Cap Pulses</h2>
        {(["LARGE", "MID", "SMALL"] as const).map((bucket) => (
          <div key={bucket}>
            <strong>{bucket}</strong>
            <span>
              {" "}
              {caps[bucket]?.score ?? "—"} · {caps[bucket]?.direction ?? "—"}
            </span>
          </div>
        ))}
      </section>

      <section className="page-card">
        <h2>Sector Pulses</h2>
        {Object.entries(sectors).map(([sector, pulse]: any) => (
          <div key={sector}>
            <strong>{sector}</strong>
            <span>
              {" "}
              {pulse?.score ?? "—"} · {pulse?.direction ?? "—"}
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
