"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, BarChart3, Building2, Newspaper, ShieldAlert, Sparkles, WalletCards } from "lucide-react";

type Factor = {
  key: string;
  label: string;
  weight: number;
  score: number | null;
  status: "READY" | "MISSING";
};

type Payload = {
  status: string;
  symbol: string;
  quote?: { price?: number | null; previousClose?: number | null; exchange?: string } | null;
  instrument?: { name?: string; symbol?: string } | null;
  intelligence?: { score: number | null; confidence: number; factors: Factor[] } | null;
  readiness?: Record<string, boolean>;
  data?: { candleCount?: number };
  providerErrors?: string[];
};

const icons: Record<string, React.ComponentType<{ size?: number }>> = {
  fundamentalQuality: Building2,
  technicalStructure: Activity,
  valuation: BarChart3,
  institutionalFlow: WalletCards,
  sectorAlignment: Sparkles,
  newsEvent: Newspaper,
  riskTrapShield: ShieldAlert,
};

export default function StockIntelligencePanel({ symbol }: { symbol: string }) {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/stocks/intelligence?symbol=${encodeURIComponent(symbol)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: Payload) => {
        if (mounted) setPayload(data);
      })
      .catch(() => {
        if (mounted) setPayload({ status: "UNAVAILABLE", symbol, intelligence: null });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [symbol]);

  const factors = payload?.intelligence?.factors ?? [];
  const readiness = useMemo(() => Object.entries(payload?.readiness ?? {}), [payload]);

  return (
    <main className="stock-terminal">
      <header className="stock-header">
        <div>
          <span className="eyebrow">STOCK INTELLIGENCE</span>
          <h1>{payload?.instrument?.name ?? symbol}</h1>
          <p>{payload?.instrument?.symbol ?? symbol} · {payload?.quote?.exchange ?? "NSE"}</p>
        </div>
        <div className="stock-live-price">
          <small>LIVE PRICE</small>
          <strong>
            {payload?.quote?.price != null
              ? `₹${payload.quote.price.toLocaleString("en-IN")}`
              : "—"}
          </strong>
        </div>
      </header>

      <section className="stock-score">
        <div className="score-summary">
          <span>TRAPNEX SCORE</span>
          <strong>{payload?.intelligence?.score ?? "—"}<small>/100</small></strong>
          <b>{payload?.status ?? (loading ? "LOADING" : "INSUFFICIENT_DATA")}</b>
          <em>Confidence {payload?.intelligence?.confidence ?? 0}%</em>
          {payload?.data?.candleCount != null ? (
            <small>Daily candles: {payload.data.candleCount}</small>
          ) : null}
        </div>

        <div className="factor-grid">
          {factors.map((factor) => {
            const Icon = icons[factor.key] ?? AlertTriangle;
            return (
              <article className="factor-card" key={factor.key}>
                <Icon size={16} />
                <div>
                  <span>{factor.label}</span>
                  <i><em style={{ width: `${factor.score ?? 0}%` }} /></i>
                </div>
                <strong>{factor.score ?? "—"}</strong>
              </article>
            );
          })}
        </div>
      </section>

      <section className="readiness">
        <h2>Data readiness</h2>
        <div>
          {readiness.map(([name, ready]) => (
            <span key={name}>{name}: {ready ? "READY" : "PENDING"}</span>
          ))}
        </div>
        {payload?.providerErrors?.length ? (
          <p>{payload.providerErrors.join(" · ")}</p>
        ) : null}
      </section>
    </main>
  );
}
