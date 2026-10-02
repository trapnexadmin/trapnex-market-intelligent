"use client";

import { useEffect, useState } from "react";

type Plan = {
  capital: number;
  riskProfile: string;
  allocations: Array<{
    symbol: string; capBucket: string | null; sector: string | null;
    weightPct: number; amount: number; score: number | null;
    expectedReturnPct: number | null; confidence: number;
    riskShield: number | null; liquidityScore: number | null;
    reasons: string[];
  }>;
  unallocatedAmount: number;
  capExposurePct: Record<string, number>;
  sectorExposurePct: Record<string, number>;
  constraints: {
    minPerStockPct: number; maxPerStockPct: number; maxStocks: number;
    sectorLimitPct?: number; capLimitsPct: Record<string, number>;
  };
  warnings: string[];
};

export default function PortfolioPage() {
  const [capital, setCapital] = useState("1000000");
  const [riskProfile, setRiskProfile] = useState("BALANCED");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [status, setStatus] = useState("IDLE");
  const [error, setError] = useState("");

  async function refresh() {
    setStatus("LOADING");
    setError("");
    try {
      const response = await fetch(
        `/api/portfolio/allocation?capital=${encodeURIComponent(capital)}&riskProfile=${riskProfile}`,
        { cache: "no-store" },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "PORTFOLIO_API_ERROR");
      setPlan(data.plan ?? null);
      setStatus(data.status ?? "READY");
    } catch (e) {
      setPlan(null);
      setStatus("ERROR");
      setError(e instanceof Error ? e.message : "PORTFOLIO_API_ERROR");
    }
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="page-shell">
      <div className="intro">
        <div>
          <label>PORTFOLIO INTELLIGENCE</label>
          <h1>Portfolio Allocation</h1>
          <p>Model-driven allocation built from the opportunity pipeline.</p>
        </div>
        <button className="open" onClick={() => void refresh()}>
          {status === "LOADING" ? "REFRESHING…" : "REFRESH ALLOCATION"}
        </button>
      </div>

      <section className="panel" style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span className="muted">CAPITAL (INR)</span>
            <input
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              inputMode="numeric"
              style={{ padding: 10, borderRadius: 7, border: "1px solid var(--border)", background: "#0a1019", color: "var(--text)" }}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span className="muted">RISK PROFILE</span>
            <select
              value={riskProfile}
              onChange={(e) => setRiskProfile(e.target.value)}
              style={{ padding: 10, borderRadius: 7, border: "1px solid var(--border)", background: "#0a1019", color: "var(--text)" }}
            >
              <option>CONSERVATIVE</option>
              <option>BALANCED</option>
              <option>GROWTH</option>
            </select>
          </label>
          <button className="open" onClick={() => void refresh()}>BUILD PLAN</button>
        </div>
      </section>

      {error && <section className="panel" style={{ padding: 16, marginTop: 12 }}>{error}</section>}

      {plan && (
        <>
          <section className="topgrid" style={{ marginTop: 12 }}>
            <article className="panel" style={{ padding: 16 }}>
              <div className="head"><span>CAPITAL</span><b>₹</b></div>
              <strong style={{ font: '800 30px "JetBrains Mono"' }}>
                ₹{plan.capital.toLocaleString("en-IN")}
              </strong>
              <p className="muted">
                Unallocated: ₹{plan.unallocatedAmount.toLocaleString("en-IN")}
              </p>
            </article>
            <article className="panel" style={{ padding: 16 }}>
              <div className="head"><span>RISK PROFILE</span></div>
              <strong style={{ font: '700 24px "JetBrains Mono"' }}>{plan.riskProfile}</strong>
              <p className="muted">{plan.allocations.length} holdings in current plan</p>
            </article>
          </section>

          <section className="panel" style={{ marginTop: 12 }}>
            <div className="head"><span>ALLOCATIONS</span><b>{plan.allocations.length}</b></div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Symbol","Cap","Sector","Weight","Amount","Score","Return","Risk","Liquidity"].map((h) =>
                      <th key={h} style={{ textAlign:"left", padding:10, color:"#718097", font:"8px JetBrains Mono" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {plan.allocations.map((a) => (
                    <tr key={a.symbol} style={{ borderTop:"1px solid #131d29" }}>
                      <td style={{ padding:10, fontWeight:700 }}>{a.symbol}</td>
                      <td style={{ padding:10 }}>{a.capBucket ?? "—"}</td>
                      <td style={{ padding:10 }}>{a.sector ?? "UNCLASSIFIED"}</td>
                      <td style={{ padding:10 }}>{a.weightPct.toFixed(2)}%</td>
                      <td style={{ padding:10 }}>₹{a.amount.toLocaleString("en-IN")}</td>
                      <td style={{ padding:10 }}>{a.score ?? "—"}</td>
                      <td style={{ padding:10 }}>{a.expectedReturnPct === null ? "—" : `${a.expectedReturnPct.toFixed(2)}%`}</td>
                      <td style={{ padding:10 }}>{a.riskShield ?? "—"}</td>
                      <td style={{ padding:10 }}>{a.liquidityScore ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bottomgrid" style={{ marginTop: 12 }}>
            <article className="panel" style={{ padding: 16 }}>
              <div className="head"><span>CAP EXPOSURE</span></div>
              {Object.entries(plan.capExposurePct).map(([k,v]) =>
                <p key={k} style={{ display:"flex", justifyContent:"space-between" }}><span>{k}</span><strong>{v.toFixed(2)}%</strong></p>)}
            </article>
            <article className="panel" style={{ padding: 16 }}>
              <div className="head"><span>SECTOR EXPOSURE</span></div>
              {Object.entries(plan.sectorExposurePct).map(([k,v]) =>
                <p key={k} style={{ display:"flex", justifyContent:"space-between" }}><span>{k}</span><strong>{v.toFixed(2)}%</strong></p>)}
            </article>
            <article className="panel" style={{ padding: 16 }}>
              <div className="head"><span>GUARDRAILS</span></div>
              <p className="muted">Per stock: {plan.constraints.minPerStockPct}%–{plan.constraints.maxPerStockPct}%</p>
              <p className="muted">Max holdings: {plan.constraints.maxStocks}</p>
              <p className="muted">Large/Mid/Small: {plan.constraints.capLimitsPct.LARGE}% / {plan.constraints.capLimitsPct.MID}% / {plan.constraints.capLimitsPct.SMALL}%</p>
              <p className="muted">Sector limit: {plan.constraints.sectorLimitPct ?? 30}%</p>
            </article>
          </section>

          {plan.warnings.length > 0 && (
            <section className="panel" style={{ padding: 16, marginTop: 12 }}>
              <div className="head"><span>WARNINGS</span></div>
              {plan.warnings.map((warning) => <p key={warning} className="amber">{warning}</p>)}
            </section>
          )}
        </>
      )}
    </main>
  );
}
