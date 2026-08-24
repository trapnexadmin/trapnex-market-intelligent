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
  instrument?: { symbol?: string; name?: string; exch_seg?: string } | null;
  quote?: { price?: number | null; previousClose?: number | null; exchange?: string } | null;
  intelligence?: { score: number | null; confidence: number; factors: Factor[] } | null;
  readiness?: Record<string, boolean>;
  message?: string;
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
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/stocks/intelligence?symbol=${encodeURIComponent(symbol)}`,
          { cache: "no-store" },
        );
        const data = (await response.json()) as Payload;
        if (active) setPayload(data);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [symbol]);

  const factors = payload?.intelligence?.factors ?? [];
  const score = payload?.intelligence?.score ?? null;
  const confidence = payload?.intelligence?.confidence ?? 0;

  const readiness = useMemo(
    () => Object.entries(payload?.readiness ?? {}),
    [payload],
  );

  return (
    <main className="stock-page">
      <div className="stock-hero">
        <div>
          <span className="stock-eyebrow">STOCK TERMINAL · TRAPNEX INTELLIGENCE</span>
          <h1>{payload?.instrument?.name ?? symbol}</h1>
          <p>{payload?.instrument?.symbol ?? symbol} · {payload?.quote?.exchange ?? "NSE"}</p>
        </div>
        <div className="stock-price">
          <small>LIVE PRICE</small>
          <strong>{payload?.quote?.price != null ? `₹${payload.quote.price.toLocaleString("en-IN")}` : "—"}</strong>
        </div>
      </div>

      <section className="stock-score-panel">
        <div className="score-block">
          <span>TRAPNEX STOCK INTELLIGENCE</span>
          <strong>{score === null ? "—" : score}</strong>
          <small>/100</small>
          <b>{payload?.status ?? (loading ? "LOADING" : "INSUFFICIENT_DATA")}</b>
          <em>Confidence {confidence}%</em>
        </div>

        <div className="score-explanation">
          <h2>Explainable factor breakdown</h2>
          <p>
            Trapnex only scores factors that have real inputs. Missing providers
            are displayed as unavailable rather than replaced with guessed values.
          </p>
          <div className="factor-grid">
            {factors.map((factor) => {
              const Icon = icons[factor.key] ?? AlertTriangle;
              return (
                <div className="factor-card" key={factor.key}>
                  <Icon size={16} />
                  <div>
                    <span>{factor.label}</span>
                    <i>
                      <em style={{ width: `${factor.score ?? 0}%` }} />
                    </i>
                  </div>
                  <strong>{factor.score ?? "—"}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="readiness-panel">
        <h2>Intelligence readiness</h2>
        <div className="readiness-grid">
          {readiness.map(([name, ready]) => (
            <div key={name}>
              <span>{name}</span>
              <b className={ready ? "ready" : "pending"}>
                {ready ? "READY" : "PENDING"}
              </b>
            </div>
          ))}
        </div>
        {payload?.message ? <p>{payload.message}</p> : null}
      </section>
    </main>
  );
}
