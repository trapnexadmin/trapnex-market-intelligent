"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  Newspaper,
  ShieldAlert,
  Sparkles,
  WalletCards,
} from "lucide-react";

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
  instrument?: { symbol?: string; name?: string; exch_seg?: string } | null;
  quote?: { price?: number | null; exchange?: string } | null;
  intelligence?: { score: number | null; confidence: number; factors: Factor[] } | null;
  readiness?: Record<string, boolean>;
  message?: string;
};

const factorIcons: Record<
  string,
  React.ComponentType<{ size?: number }>
> = {
  fundamentalQuality: Building2,
  technicalStructure: Activity,
  valuation: BarChart3,
  institutionalFlow: WalletCards,
  sectorAlignment: Sparkles,
  newsEvent: Newspaper,
  riskTrapShield: ShieldAlert,
};

export default function StockIntelligencePanel({
  symbol,
}: {
  symbol: string;
}) {
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch(`/api/stocks/intelligence?symbol=${encodeURIComponent(symbol)}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data: Payload) => {
        if (mounted) setPayload(data);
      })
      .catch(() => {
        if (mounted)
          setPayload({
            status: "UNAVAILABLE",
            symbol,
            intelligence: null,
          });
      });

    return () => {
      mounted = false;
    };
  }, [symbol]);

  const factors = payload?.intelligence?.factors ?? [];
  const readiness = useMemo(
    () => Object.entries(payload?.readiness ?? {}),
    [payload],
  );

  return (
    <div className="stock-terminal">
      <header className="stock-header">
        <div>
          <span className="eyebrow">STOCK TERMINAL · TRAPNEX INTELLIGENCE</span>
          <h1>{payload?.instrument?.name ?? symbol}</h1>
          <p>
            {payload?.instrument?.symbol ?? symbol} ·{" "}
            {payload?.quote?.exchange ?? "NSE"}
          </p>
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
        <div>
          <span>TRAPNEX STOCK INTELLIGENCE</span>
          <strong>
            {payload?.intelligence?.score ?? "—"}
            <small>/100</small>
          </strong>
          <b>{payload?.status ?? "LOADING"}</b>
          <em>
            Confidence: {payload?.intelligence?.confidence ?? 0}%
          </em>
        </div>

        <div className="factor-grid">
          {factors.map((factor) => {
            const Icon = factorIcons[factor.key] ?? AlertTriangle;

            return (
              <article key={factor.key} className="factor-card">
                <Icon size={16} />
                <div>
                  <span>{factor.label}</span>
                  <i>
                    <em style={{ width: `${factor.score ?? 0}%` }} />
                  </i>
                </div>
                <strong>{factor.score ?? "—"}</strong>
              </article>
            );
          })}
        </div>
      </section>

      <section className="readiness">
        <h2>Factor readiness</h2>
        <div>
          {readiness.map(([name, ready]) => (
            <span key={name}>
              {name}: {ready ? "READY" : "PENDING"}
            </span>
          ))}
        </div>
        {payload?.message ? <p>{payload.message}</p> : null}
      </section>
    </div>
  );
}
