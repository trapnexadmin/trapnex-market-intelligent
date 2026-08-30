"use client";
import { useEffect, useState } from "react";
export default function ClassificationPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/classification", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setRows(d.rows ?? []))
      .catch(() => setRows([]));
  }, []);
  return (
    <main className="page-shell">
      <div className="page-header">
        <span>TERMINAL · UNIVERSE</span>
        <h1>Constituent Classification</h1>
        <p>Market-cap and sector mapping used by Pulse calculations.</p>
      </div>
      <section className="page-card">
        {rows.map((row) => (
          <div key={`${row.exchange}:${row.symbol}`}>
            <strong>{row.symbol}</strong>
            <span>
              {" "}
              · {row.capBucket} · {row.sector}
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
